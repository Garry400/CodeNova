from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from fastapi import UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import math
from io import BytesIO
from PIL import Image
import time
from fastapi import Request
import base64

# Create FastAPI app
app = FastAPI(title="CodeNova Backend")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
# NOTE: In auth.py you already have `router = APIRouter(prefix="/auth")`
# so we don't add another prefix here.
app.include_router(auth.router)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "CodeNova Backend is Running 🚀"}

@app.get("/ping")
def ping():
    return {"message": "Pong from FastAPI 🔥"}

# --- Load MediaPipe once ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

# Thresholds (same as your current tuned version)
yaw_threshold = 12
pitch_up_threshold = -15
pitch_down_threshold = 15
roll_threshold = 12
HR_LEFT = 0.40
HR_RIGHT = 0.60
VR_UP = 0.42
VR_DOWN = 0.52

@app.post("/detect")
async def detect_image(request: Request):
    data = await request.json()
    image_data = data["image"].split(",")[1]
    decoded = base64.b64decode(image_data)
    nparr = np.frombuffer(decoded, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    results = face_mesh.process(rgb)

    head_direction = "Straight"
    eye_direction = "Center"
    yaw = pitch = roll = hr = vr = 0

    if results.multi_face_landmarks:
        mesh_points = results.multi_face_landmarks[0].landmark
        points = np.array([[lm.x * w, lm.y * h, lm.z * w] for lm in mesh_points])

        left_eye = points[33]
        right_eye = points[263]
        chin = points[199]
        forehead = points[10]

        x_axis = right_eye - left_eye
        y_axis = chin - forehead
        yaw = math.degrees(math.atan2(x_axis[2], x_axis[0]))
        pitch = math.degrees(math.atan2(y_axis[2], y_axis[1]))
        roll = math.degrees(math.atan2(x_axis[1], x_axis[0]))

        if pitch < pitch_up_threshold:
            head_direction = "Chin Up"
        elif pitch > pitch_down_threshold:
            head_direction = "Chin Down"
        elif yaw < -yaw_threshold:
            head_direction = "Left"
        elif yaw > yaw_threshold:
            head_direction = "Right"

        # Eyes
        def eye_ratio(eye_left, eye_right, eye_top, eye_bottom, iris):
            hr = (iris.x - eye_left.x) / (eye_right.x - eye_left.x)
            vr = (iris.y - eye_top.y) / (eye_bottom.y - eye_top.y)
            return hr, vr

        left_eye_left = mesh_points[33]
        left_eye_right = mesh_points[133]
        left_eye_top = mesh_points[159]
        left_eye_bottom = mesh_points[145]
        left_iris = mesh_points[468]

        right_eye_left = mesh_points[362]
        right_eye_right = mesh_points[263]
        right_eye_top = mesh_points[386]
        right_eye_bottom = mesh_points[374]
        right_iris = mesh_points[473]

        l_hr, l_vr = eye_ratio(left_eye_left, left_eye_right, left_eye_top, left_eye_bottom, left_iris)
        r_hr, r_vr = eye_ratio(right_eye_left, right_eye_right, right_eye_top, right_eye_bottom, right_iris)
        hr = (l_hr + r_hr) / 2
        vr = (l_vr + r_vr) / 2

        if hr < HR_LEFT:
            eye_direction = "Looking Left"
        elif hr > HR_RIGHT:
            eye_direction = "Looking Right"
        elif vr < VR_UP:
            eye_direction = "Looking Up"
        elif vr > VR_DOWN:
            eye_direction = "Looking Down"

    return {
        "head_direction": head_direction,
        "eye_direction": eye_direction,
        "yaw": yaw,
        "pitch": pitch,
        "roll": roll,
        "hr": hr,
        "vr": vr
    }