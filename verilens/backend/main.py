from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil

from hashing import generate_phash, compare_hashes
from database import save_hash, get_all_hashes
from ai_detection import detect_fake

app = FastAPI()

cors_origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:9002,http://127.0.0.1:9002,http://localhost:3000,http://127.0.0.1:3000",
)
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")


@app.get("/")
def home():
    return {"message": "VeriLens Backend Running"}


def map_match_status(diff: int) -> str:
    if diff == 0:
        return "exact"
    if diff < 5:
        return "very_similar"
    if diff < 10:
        return "slightly_modified"
    return "different"


def map_final_status(ai_result: str, confidence: float, results: list[dict]) -> str:
    has_close_match = any(r["difference"] < 5 for r in results)

    if ai_result == "Fake":
        if has_close_match:
            return "Modified"
        if confidence > 0.95:
            return "Fake"
        return "Fake"

    if ai_result == "Real":
        if has_close_match:
            return "Verified"
        return "Unverified"

    return "Unverified"


@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_hash = generate_phash(file_path)

    results = []
    for item in get_all_hashes():
        diff = compare_hashes(new_hash, item["hash"])
        results.append(
            {
                "id": item["name"],
                "image": item["name"],
                "difference": diff,
                "similarity": max(0.0, min(1.0, 1 - (diff / 16))),
                "url": f"/uploads/{item['name']}",
                "status": map_match_status(diff),
            }
        )

    save_hash(file.filename, new_hash)

    ai_result, confidence = detect_fake(file_path)
    final_status = map_final_status(ai_result, confidence, results)

    return {
        "filename": file.filename,
        "hash": new_hash,
        "ai_detection": {
            "result": ai_result,
            "confidence": float(confidence),
        },
        "matches": results,
        "final_status": final_status,
    }
