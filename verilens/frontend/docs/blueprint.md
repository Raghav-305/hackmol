# **App Name**: VeriLens

## Core Features:

- Secure Image Upload & Preview: Allow users to securely upload images via drag-and-drop or file selection, with an instant visual preview of the selected image.
- Real-time Analysis via API: Sends the uploaded image to the FastAPI backend API at http://127.0.0.1:8000/upload/ and processes the returned JSON analysis.
- Dynamic Result Display with Badges: Visually presents AI detection result (Real/Fake), confidence score, 'Similar Images' (if found), and final verification status (Verified/Modified/Fake/Unverified) using distinct color-coded badges for clarity.
- Persistent Scan History (Firestore): Automatically stores a record of each image analysis, including filename, detection result, confidence, and timestamp, in Firestore.
- Secure Image Storage (Firebase Storage): Stores uploaded images in Firebase Storage as part of the analysis workflow.
- Contextual AI Explanation Tool: Provides a tool leveraging generative AI to offer high-level explanations on common deepfake indicators, helping users understand the general types of patterns that contribute to detected results.
- Responsive & Animated Interface: Ensures a smooth, adaptive user experience across various devices, incorporating subtle loading animations and modern glassmorphism design elements for visual impressiveness.

## Style Guidelines:

- The primary interface elements (e.g., buttons, highlights) will use a discerning blue (#0066DD), evoking clarity and trustworthiness against the dark background.
- The background will feature a dark, sophisticated almost-black shade with a subtle blue tint (#161C1F), providing a sleek canvas for the UI and supporting the glassmorphism aesthetic.
- An accent color of vibrant purple (#8A62FF) will be used sparingly for secondary interactive elements or status indicators, providing visual dynamism.
- Functional colors for status badges will be: Green for 'Verified' (#4CAF50), Yellow for 'Modified/Suspicious' (#FFEB3B), and Red for 'Fake' (#F44336).
- Body and headline text will use the 'Inter' sans-serif font for its modern, clean, and objective appearance, suitable for clear data presentation.
- Use crisp, minimal line-based icons that align with a modern, technical aesthetic, supporting the clarity of the interface.
- The UI will implement a clean, spatial layout with distinct 'Drag and drop upload area', 'Image preview card', and 'Result cards' featuring glassmorphism effects (subtle transparency and blur).
- Include subtle loading animations during image processing and transitions to provide smooth visual feedback, enhancing the user experience.