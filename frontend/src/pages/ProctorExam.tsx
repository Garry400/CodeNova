import React, { useEffect, useRef, useState } from "react";

const ProctorExam: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Monitoring...");
  const [cheatCount, setCheatCount] = useState(0);

  useEffect(() => {
    // Start webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });

    const interval = setInterval(async () => {
      const video = videoRef.current;
      if (!video) return;

      // Capture frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/jpeg");

      // Send to backend
      const res = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();

      const { head_direction, eye_direction } = data;

      // Check cheating condition
      if (
        head_direction === "Left" ||
        head_direction === "Right" ||
        eye_direction === "Looking Left" ||
        eye_direction === "Looking Right"
      ) {
        setCheatCount((c) => c + 1);
        setStatus("⚠️ CHEATING DETECTED!");
      } else {
        setStatus("Monitoring...");
      }

      // Optional: auto flag after 3 strikes
      if (cheatCount > 3) {
        alert("🚨 Multiple cheating attempts detected!");
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [cheatCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Proctoring System</h1>
      <video ref={videoRef} autoPlay className="w-[400px] rounded-lg shadow-md" />
      <p className="mt-4 text-lg">{status}</p>
      <p className="text-sm text-gray-400 mt-1">Cheat Count: {cheatCount}</p>
    </div>
  );
};

export default ProctorExam;
