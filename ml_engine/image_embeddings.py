import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import numpy as np

class ImageEmbedder:
    def __init__(self):
        self.model = models.resnet50(pretrained=True)
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def get_embedding(self, image_path):
        image = Image.open(image_path).convert('RGB')
        image = self.transform(image).unsqueeze(0)
        with torch.no_grad():
            embedding = self.model(image)
        return embedding.numpy().flatten()
    
    def embed_images(self, image_paths):
        vectors = []
        for path in image_paths:
            vectors.append(self.get_embedding(path))
        return np.array(vectors)

def main():
    embedder = ImageEmbedder()
    # Example usage
    embedding = embedder.get_embedding('path_to_image.jpg')
    print(embedding)

if __name__ == "__main__":
    main()