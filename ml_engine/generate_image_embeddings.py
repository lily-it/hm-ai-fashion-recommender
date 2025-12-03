import os
import numpy as np
import pandas as pd
from PIL import Image
import torch
from torchvision import models, transforms

def generate_image_embeddings():
    df = pd.read_csv("dataset/preprocessed_data.csv")
    df_articles = df.drop_duplicates("article_id")[["article_id"]]

    base_image_path = "dataset/images"  # adjust if needed

    model = models.resnet50(pretrained=True)
    model.eval()

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])

    mapping = {}

    print("🖼 Generating image embeddings...")
    for article_id in df_articles["article_id"].tolist():
        image_path = f"{base_image_path}/{article_id}.jpg"

        if os.path.exists(image_path):
            img = Image.open(image_path).convert("RGB")
            img = transform(img).unsqueeze(0)

            with torch.no_grad():
                embedding = model(img).numpy().flatten()
                mapping[article_id] = embedding

    np.save("ml_engine/image_embeddings.npy", mapping)
    print("✅ Saved image_embeddings.npy")

if __name__ == "__main__":
    generate_image_embeddings()
