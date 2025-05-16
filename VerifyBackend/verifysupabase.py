import os
import numpy as np
import torch
from verification import preprocess_query_image
from dotenv import load_dotenv
from supabase import create_client

# Load .env variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def verify_from_supabase(model, image_path, threshold=0.3):
    """
    Verifies a palmprint by comparing query image with all users' FVs stored in Supabase.
    If match is found, sets present_today = True for the matched user.
    Returns dict with matched status, ID, name, similarity.
    """
    try:
        # Step 1: Preprocess query image
        query_image = preprocess_query_image(image_path)
        query_image = query_image.unsqueeze(0).cuda()

        model.eval()
        with torch.no_grad():
            query_feature = model.getFeatureCode(query_image).cpu().numpy().flatten()

        # Step 2: Get all users with their feature vectors
        users_response = supabase.table("Users").select("id,Name,fv1,fv2,fv3,fv4").execute()
        users = users_response.data

        if not users:
            return {"matched": False, "error": "No users found in Supabase."}

        similarities = []

        for user in users:
            user_id = user["id"]
            name = user["Name"]
            for i in range(1, 5):
                key = f"fv{i}"
                vector = user.get(key)
                if vector:
                    db_fv = np.array(vector, dtype=np.float32)
                    sim = np.dot(query_feature, db_fv)
                    similarities.append((sim, user_id, name))

        if not similarities:
            return {"matched": False, "error": "No feature vectors found."}

        similarities.sort(key=lambda x: x[0], reverse=True)
        best_sim, best_id, best_name = similarities[0]
        matched = bool(best_sim > threshold)

        # ✅ Update present_today if matched
        if matched:
            supabase.table("Users").update({"present_today": True}).eq("id", best_id).execute()

        return {
            "matched": matched,
            "user_id": best_id,
            "name": best_name,
            "similarity": float(best_sim)
        }

    except Exception as e:
        return {"matched": False, "error": str(e)}
