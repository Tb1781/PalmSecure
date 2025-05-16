from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import os
import requests
import torch
from models.ccnet import ccnet
from verifysupabase import verify_from_supabase
from extract_and_update import extract_and_update_features  # ✅ new import

# === Load environment variables ===
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# === FastAPI app ===
app = FastAPI()

# === Load model once globally ===
model = ccnet(num_classes=767, weight=0.8)
model.load_state_dict(torch.load("newmodel.pth"))
model.eval().cuda()

# === Request schemas ===
class ImagePathRequest(BaseModel):
    image_path: str

class UserIDRequest(BaseModel):
    user_id: int

# === /verify route ===
@app.post("/verify")
async def verify_user(data: ImagePathRequest):
    try:
        image_url = f"{SUPABASE_URL}/storage/v1/object/public/my-bucket/{data.image_path}"
        local_path = os.path.join("query_images", os.path.basename(data.image_path))
        os.makedirs("query_images", exist_ok=True)

        # Download image
        response = requests.get(image_url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Image not found in Supabase")

        with open(local_path, 'wb') as f:
            f.write(response.content)

        # Run verification
        result = verify_from_supabase(model, local_path)

        # Delete temp image
        try:
            os.remove(local_path)
        except Exception as cleanup_error:
            print(f"⚠️ Failed to delete local image: {cleanup_error}")

        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === /extract_features route ===
@app.post("/extract_features")
async def extract_features(req: UserIDRequest):
    try:
        result = extract_and_update_features(req.user_id, model)

        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])

        return {
            "message": "Feature vectors extracted and saved successfully.",
            "data": result["updated"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
