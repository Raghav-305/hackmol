import sys
import os

BASE_DIR = os.path.dirname(__file__)
sys.path.append(BASE_DIR)

import torch
from PIL import Image
import torchvision.transforms as transforms

from ai.mesonet import Meso4   # your classifier.py renamed

# Load model
model = Meso4(num_classes=2)

weights_path = os.path.join(BASE_DIR, "ai", "weights", "best.pkl")

# Handle .pkl safely
state = torch.load(weights_path, map_location="cpu")

# Some repos store weights differently
if isinstance(state, dict) and "state_dict" in state:
    model.load_state_dict(state["state_dict"], strict=False)
else:
    model.load_state_dict(state, strict=False)

model.eval()

# 🔥 IMPORTANT: SAME TRANSFORM AS TRAINING
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

def detect_fake(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        img = transform(img).unsqueeze(0)

        with torch.no_grad():
            output = model(img)

        prob = torch.softmax(output, dim=1)
        confidence = prob[0][1].item()

        if confidence > 0.5:
            return "Fake", confidence
        else:
            return "Real", confidence

    except Exception as e:
        return f"Error: {str(e)}", 0.0