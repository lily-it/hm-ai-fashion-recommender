import os
import numpy as np
import pickle
from PIL import Image

# Koshish karein Torch load karne ki, agar nahi hai toh skip karein
try:
    import torch
    import torchvision.models as models
    import torchvision.transforms as transforms
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    print("⚠️ Torch not found. Installing instructions: pip install torch torchvision")

def generate():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(current_dir)
    images_dir = os.path.join(base_dir, "dataset", "images")
    output_path = os.path.join(current_dir, "image_embeddings.npy")

    if not os.path.exists(images_dir):
        print(f"⚠️ Images folder not found at {images_dir}. Creating dummy embeddings.")
        np.save(output_path, {})
        return

    if not HAS_TORCH:
        print("⚠️ Torch missing. Creating dummy embeddings to bypass error.")
        np.save(output_path, {})
        return

    # Setup ResNet Model (Computer Vision)
    print("📷 Loading ResNet model for Image Features...")
    model = models.resnet18(pretrained=True)
    model.eval()
    
    # Remove last layer to get features instead of classification
    feature_extractor = torch.nn.Sequential(*list(model.children())[:-1])

    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    embeddings = {}
    valid_images = [f for f in os.listdir(images_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"🔄 Processing {len(valid_images)} images...")

    for i, img_file in enumerate(valid_images):
        try:
            img_path = os.path.join(images_dir, img_file)
            img = Image.open(img_path).convert('RGB')
            input_tensor = preprocess(img).unsqueeze(0) #shape 
            
            with torch.no_grad():
                feature_vec = feature_extractor(input_tensor).flatten().numpy() # high visual features
            # pyTorch tensor are CPU/GPU bounds, so numpy array mein convert karna zaroori hai
            # Article ID filename se nikalo (e.g. "012345.jpg" -> "012345")
            article_id = os.path.splitext(img_file)[0]
            embeddings[article_id] = feature_vec
            
            if i % 50 == 0: print(f"   Processed {i} images...", end='\r')

        except Exception as e:
            print(f"   Skipped {img_file}: {e}")

    np.save(output_path, embeddings)
    print(f"\n✅ Saved {len(embeddings)} image embeddings to {output_path}")

if __name__ == "__main__":
    generate()