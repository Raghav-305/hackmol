import cv2

# Load the Cascade Classifier for face detection
def load_face_detection_model():
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    return face_cascade

# Function to detect faces in an image
def detect_faces(image, face_cascade):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    return faces

# Modifying the AI inference function to include face detection

def ai_inference(image):
    face_cascade = load_face_detection_model()
    faces = detect_faces(image, face_cascade)
    # Process detected faces and perform AI inference
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Draw rectangle around face
    # Add your existing AI inference code here

    return image

# Add the above code in the existing ai_detection.py before inference