from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
import math
import time

app = FastAPI(title="CodeNova Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Routes -----------------
@app.get("/")
def root():
    return {"message": "CodeNova Backend Running 🚀"}

# ----------------------------------------------------
# PROCESS IMAGE + RETURN HEAD / EYE DIRECTIONS
# ----------------------------------------------------
@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Read uploaded image
    data = await file.read()
    npimg = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Mediapipe face mesh
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(frame_rgb)

    # Default directions
    head_direction = "Straight"
    eye_direction = "Looking Center"

    # Thresholds (relaxed head thresholds, eyes same)
    yaw_threshold = 18        # previously 12
    pitch_up_threshold = -20  # previously -15
    pitch_down_threshold = 20  # previously 15

    # Eyes thresholds remain the same
    HR_LEFT = 0.40
    HR_RIGHT = 0.60
    VR_UP = 0.42
    VR_DOWN = 0.52



    if results.multi_face_landmarks:
        mesh_points = results.multi_face_landmarks[0].landmark
        h, w, _ = frame.shape
        points = np.array([[lm.x * w, lm.y * h, lm.z * w] for lm in mesh_points])

        # --- HEAD POSE ---
        left_eye = points[33]
        right_eye = points[263]
        chin = points[199]
        forehead = points[10]

        x_axis = right_eye - left_eye
        y_axis = chin - forehead
        z_axis = np.cross(x_axis, y_axis)

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
        else:
            head_direction = "Straight"

        # --- EYE DIRECTION ---
        def eye_ratio(eye_left, eye_right, eye_top, eye_bottom, iris):
            hr = (iris.x - eye_left.x) / (eye_right.x - eye_left.x)
            vr = (iris.y - eye_top.y) / (eye_bottom.y - eye_top.y)
            return hr, vr

        # Left eye
        l_hr, l_vr = eye_ratio(mesh_points[33], mesh_points[133],
                               mesh_points[159], mesh_points[145],
                               mesh_points[468])
        # Right eye
        r_hr, r_vr = eye_ratio(mesh_points[362], mesh_points[263],
                               mesh_points[386], mesh_points[374],
                               mesh_points[473])
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
        else:
            eye_direction = "Looking Center"

    return {
        "head_direction": head_direction,
        "eye_direction": eye_direction
    }
