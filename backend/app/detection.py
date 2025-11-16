import cv2
import mediapipe as mp
import numpy as np
import math
import time

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

# --- Relaxed thresholds ---
yaw_threshold = 12
pitch_up_threshold = -15
pitch_down_threshold = 15
roll_threshold = 12

# Eyes – relaxed
HR_LEFT = 0.40
HR_RIGHT = 0.60
VR_UP = 0.42
VR_DOWN = 0.52

cap = cv2.VideoCapture(0)
cheating_start_time = None
cheating_alert = False
CHEAT_DELAY = 2  # seconds

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)
    h, w, _ = frame.shape

    head_direction = "Straight"
    eye_direction = "Center"
    yaw = pitch = roll = hr = vr = 0

    if results.multi_face_landmarks:
        mesh_points = results.multi_face_landmarks[0].landmark
        points = np.array([[lm.x * w, lm.y * h, lm.z * w] for lm in mesh_points])

        # --- HEAD POSE ESTIMATION ---
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

        # --- EYE TRACKING ---
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

        def eye_ratio(eye_left, eye_right, eye_top, eye_bottom, iris):
            hr = (iris.x - eye_left.x) / (eye_right.x - eye_left.x)
            vr = (iris.y - eye_top.y) / (eye_bottom.y - eye_top.y)
            return hr, vr

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
        else:
            eye_direction = "Looking Center"

        # --- CHEATING TIMER LOGIC ---
        cheating_now = (head_direction != "Straight" or eye_direction != "Looking Center")

        if cheating_now:
            if cheating_start_time is None:
                cheating_start_time = time.time()
            elif time.time() - cheating_start_time > CHEAT_DELAY:
                cheating_alert = True
        else:
            cheating_start_time = None
            cheating_alert = False

        # --- GUI PANEL ---
        panel_x = int(w * 0.65)
        panel_w = int(w * 0.35)
        overlay = frame.copy()
        cv2.rectangle(overlay, (panel_x, 0), (w, h), (30, 30, 30), -1)
        frame = cv2.addWeighted(overlay, 0.5, frame, 0.5, 0)

        y0 = 50
        dy = 35
        cv2.putText(frame, "EXAM PROCT", (panel_x + 15, y0), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
        cv2.putText(frame, f"Head: {head_direction}", (panel_x + 15, y0 + dy), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
        cv2.putText(frame, f"Eyes: {eye_direction}", (panel_x + 15, y0 + 2*dy), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
        cv2.putText(frame, f"Yaw: {yaw:.2f}", (panel_x + 15, y0 + 3*dy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        cv2.putText(frame, f"Pitch: {pitch:.2f}", (panel_x + 15, y0 + 4*dy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        cv2.putText(frame, f"Roll: {roll:.2f}", (panel_x + 15, y0 + 5*dy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)
        cv2.putText(frame, f"HR: {hr:.2f}  VR: {vr:.2f}", (panel_x + 15, y0 + 6*dy), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

        # Alert info
        if cheating_alert:
            cv2.putText(frame, "CHEATING DETECTED !!!", (int(w/4), int(h/1.1)), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0,0,255), 4)
        elif cheating_now:
            cv2.putText(frame, "Suspicious...", (int(w/3.2), int(h/1.1)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0,165,255), 3)
        # else:
        #     cv2.putText(frame, "All Clear", (int(w/3.2), int(h/1.1)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0,255,0), 3)

    cv2.imshow("Exam Proctor Vision", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
