database = []

def save_hash(image_name, hash_value):
    database.append({
        "name": image_name,
        "hash": hash_value
    })

def get_all_hashes():
    return database