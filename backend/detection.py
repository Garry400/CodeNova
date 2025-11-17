import cv2
import mediapipe as mp
import numpy as np
import math

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

# -----------------------------
# THRESHOLDS
# -----------------------------
YAW_SOFT = 8
YAW_HARD = 20

PITCH_UP_SOFT = -10
PITCH_UP_HARD = -22

PITCH_DOWN_SOFT = 12
PITCH_DOWN_HARD = 25

HR_LEFT = 0.38
HR_RIGHT = 0.62
HR_HARD_LEFT = 0.30
HR_HARD_RIGHT = 0.70

VR_UP = 0.42
VR_DOWN = 0.53
VR_HARD_UP = 0.35
VR_HARD_DOWN = 0.60


def eye_ratio(eL, eR, eT, eB, iris):
    hr = (iris.x - eL.x) / (eR.x - eL.x)
    vr = (iris.y - eT.y) / (eB.y - eT.y)
    return hr, vr


# --------------------------------------------------------
# ✔ FUNCTION USED BY main.py (THIS FIXES THE IMPORT ERROR)
# --------------------------------------------------------
def detect_frame(image_bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if frame is None:
        return {"status": "error", "reason": "invalid frame"}

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    head_dir = "Straight"
    eye_dir = "Center"

    is_suspicious = False
    is_cheating = False

    if results.multi_face_landmarks:
        lm = results.multi_face_landmarks[0].landmark
        pts = np.array([[p.x * w, p.y * h, p.z * w] for p in lm])

        # HEAD
        left_eye = pts[33]
        right_eye = pts[263]
        chin = pts[199]
        forehead = pts[10]

        x_axis = right_eye - left_eye
        y_axis = chin - forehead

        yaw = math.degrees(math.atan2(x_axis[2], x_axis[0]))
        pitch = math.degrees(math.atan2(y_axis[2], y_axis[1]))

        # HARD HEAD
        if abs(yaw) > YAW_HARD:
            head_dir = "Strong Left" if yaw < 0 else "Strong Right"
            is_cheating = True
        elif pitch < PITCH_UP_HARD:
            head_dir = "Strong Chin Up"
            is_cheating = True
        elif pitch > PITCH_DOWN_HARD:
            head_dir = "Strong Chin Down"
            is_cheating = True

        # SOFT HEAD
        elif abs(yaw) > YAW_SOFT:
            head_dir = "Left" if yaw < 0 else "Right"
            is_suspicious = True
        elif pitch < PITCH_UP_SOFT:
            head_dir = "Chin Up"
            is_suspicious = True
        elif pitch > PITCH_DOWN_SOFT:
            head_dir = "Chin Down"
            is_suspicious = True

        # EYES
        L_hr, L_vr = eye_ratio(lm[33], lm[133], lm[159], lm[145], lm[468])
        R_hr, R_vr = eye_ratio(lm[362], lm[263], lm[386], lm[374], lm[473])

        hr = (L_hr + R_hr) / 2
        vr = (L_vr + R_vr) / 2

        # HARD EYES
        if hr < HR_HARD_LEFT:
            eye_dir = "Strong Left"
            is_cheating = True
        elif hr > HR_HARD_RIGHT:
            eye_dir = "Strong Right"
            is_cheating = True
        elif vr < VR_HARD_UP:
            eye_dir = "Strong Up"
            is_cheating = True
        elif vr > VR_HARD_DOWN:
            eye_dir = "Strong Down"
            is_cheating = True

        # SOFT EYES
        elif hr < HR_LEFT:
            eye_dir = "Left"
            is_suspicious = True
        elif hr > HR_RIGHT:
            eye_dir = "Right"
            is_suspicious = True
        elif vr < VR_UP:
            eye_dir = "Up"
            is_suspicious = True
        elif vr > VR_DOWN:
            eye_dir = "Down"
            is_suspicious = True

    # FINAL STATUS
    if is_cheating:
        status = "cheating"
    elif is_suspicious:
        status = "suspicious"
    else:
        status = "normal"

    return {
        "status": status,
        "head_direction": head_dir,
        "eye_direction": eye_dir,
    }
