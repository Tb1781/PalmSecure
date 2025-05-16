import os
import numpy as np
import requests
import torch
from dotenv import load_dotenv
from supabase import create_client
from PIL import Image
from torchvision import transforms as T

# Load Supabase config
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class NormSingleROI:
    def __init__(self, outchannels=1):
        self.outchannels = outchannels

    def __call__(self, tensor):
        c, h, w = tensor.size()
        if c != 1:
            raise TypeError("Only grayscale supported")
        tensor = tensor.view(c, h * w)
        idx = tensor > 0
        t = tensor[idx]
        m = t.mean()
        s = t.std()
        t = t.sub_(m).div_(s + 1e-6)
        tensor[idx] = t
        tensor = tensor.view(c, h, w)
        if self.outchannels > 1:
            tensor = torch.repeat_interleave(tensor, repeats=self.outchannels, dim=0)
        return tensor

transform = T.Compose([
    T.Resize((128, 128)),
    T.ToTensor(),
    NormSingleROI(outchannels=1)
])

def download_image(url, save_path):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to download image: {url}")
    with open(save_path, 'wb') as f:
        f.write(response.content)

def extract_and_update_features(user_id, model):
    try:
        bucket = "user-palmprint-images"
        img_paths = [
            f"{user_id}/left_palm_1.jpg",
            f"{user_id}/left_palm_2.jpg",
            f"{user_id}/right_palm_1.jpg",
            f"{user_id}/right_palm_2.jpg",
        ]

        local_dir = f"NewUsers/{user_id}"
        os.makedirs(local_dir, exist_ok=True)

        features = []
        for path in img_paths:
            url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"
            local_path = os.path.join(local_dir, os.path.basename(path))
            download_image(url, local_path)
            img = Image.open(local_path).convert("L")
            img_tensor = transform(img).unsqueeze(0).cuda()
            with torch.no_grad():
                fv = model.getFeatureCode(img_tensor).cpu().numpy().flatten().tolist()
                features.append(fv)

        update_data = {
            "fv1": features[0],
            "fv2": features[1],
            "fv3": features[2],
            "fv4": features[3],
        }

        result = supabase.table("Users").update(update_data).eq("id", user_id).execute()
        # print("🧠 Feature update payload:", update_data)
        # print("📦 Supabase response:", result.data)

        return {"success": True, "updated": result.data}

    except Exception as e:
        return {"success": False, "error": str(e)}
