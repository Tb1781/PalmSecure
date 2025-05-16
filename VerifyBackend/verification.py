import torch
import numpy as np
import os
from torchvision import transforms as T
from PIL import Image
from models.ccnet import ccnet

class NormSingleROI(object):
    def __init__(self, outchannels=1):
        self.outchannels = outchannels

    def __call__(self, tensor):
        c, h, w = tensor.size()
        if c != 1:
            raise TypeError('only support grayscale image.')
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

def preprocess_query_image(query_image_path, imside=128, outchannels=1):
    transform = T.Compose([
        T.Resize((imside, imside)),
        T.ToTensor(),
        NormSingleROI(outchannels)
    ])
    image = Image.open(query_image_path).convert('L')
    return transform(image)

def verify(model, query_image_path, feature_save_path, threshold=0.2, imside=128, outchannels=1):
    features = []
    labels = []
    file_path = os.path.join(feature_save_path, 'features_with_labels.txt')

    with open(file_path, 'r') as f:
        for line in f:
            if not line.strip():
                continue
            label, feature_str = line.strip().split(' ', 1)
            feature = np.array(eval(feature_str))
            features.append(feature)
            labels.append(label)

    print(f"✅ Loaded {len(features)} features.")

    query_image = preprocess_query_image(query_image_path, imside, outchannels)
    query_image = query_image.unsqueeze(0).cuda()

    model.eval()
    with torch.no_grad():
        query_feature = model.getFeatureCode(query_image).cpu().numpy().flatten()

    distances = [(np.dot(query_feature, db_feat), label) for db_feat, label in zip(features, labels)]
    distances.sort(key=lambda x: x[0], reverse=True)

    for i, (sim, label) in enumerate(distances):
        print(f"Match {i+1}: Label = {label}, Similarity = {sim:.4f}")

    max_sim, closest_label = distances[0]
    print(f"🎯 Closest: {closest_label}, Similarity: {max_sim:.4f}")

    return max_sim > threshold
