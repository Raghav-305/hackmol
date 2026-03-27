from PIL import Image
import imagehash

def generate_phash(image_path):
    image = Image.open(image_path)
    phash = imagehash.phash(image)
    return str(phash)

def compare_hashes(hash1, hash2):
    return imagehash.hex_to_hash(hash1) - imagehash.hex_to_hash(hash2)