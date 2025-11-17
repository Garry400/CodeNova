import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  JUDGE0_API_URL,
  JUDGE0_API_HOST,
  JUDGE0_API_KEY,
} from "@/config/judge0";

const languageIds: Record<string, number> = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

interface TestCase {
  input: string;
  output: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

interface CodeEditorProps {
  questionId: string;
  testCases: TestCase[];
  onSubmit: (code: string, language: string, results: TestResult[]) => void;
}

const CodeEditor = ({ testCases, onSubmit }: CodeEditorProps) => {
  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  const { toast } = useToast();

  const languageTemplates: Record<string, string> = {
    javascript:
      "// Write your JavaScript code here\nfunction solution(input) {\n  return input;\n}\n",
    python: "# Write your Python code here\ndef solution(input):\n    return input\n",
    cpp: `#include <iostream>
using namespace std;

int main() {
    return 0;
}`,
    java: `public class Solution {
    public static void main(String[] args) {

    }
}`,
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage] || "");
  };

  const runCode = () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      if (language === "javascript") {
        testCases.forEach((testCase) => {
          try {
            const func = new Function("input", code + "\nreturn solution(input);");
            const actual = String(func(testCase.input));

            results.push({
              passed: actual.trim() === testCase.output.trim(),
              input: testCase.input,
              expected: testCase.output.trim(),
              actual: actual.trim(),
            });
          } catch {
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.output,
              actual: "Runtime Error",
            });
          }
        });
      } else {
        toast({
          title: "Language Not Supported",
          description: "Only JS runs locally.",
          variant: "destructive",
        });
        testCases.forEach((tc) =>
          results.push({
            passed: false,
            input: tc.input,
            expected: tc.output,
            actual: "Skipped",
          })
        );
      }

      setTestResults(results);
      toast({
        title: "Test Run Complete",
        description: `${results.filter((r) => r.passed).length}/${results.length} passed`,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (testResults.length === 0) {
      toast({
        title: "Run Tests First",
        description: "Execute tests before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(code, language, testResults);
  };

  // ---------------- CAMERA / PROCTORING -----------------
  const [headDir, setHeadDir] = useState("Unknown");
  const [eyeDir, setEyeDir] = useState("Unknown");
  const [proctorStatus, setProctorStatus] = useState("Normal");
  const [cheatingCount, setCheatingCount] = useState(0);

  const computeProctorStatus = (head: string, eyes: string) => {
    if (head === "Chin Up" || head === "Chin Down" || eyes === "Looking Left" || eyes === "Looking Right") {
      return "Cheating";
    } else if (head !== "Straight" || eyes !== "Looking Center") {
      return "Suspicious";
    } else {
      return "Normal";
    }
  };

  const sendFrameToBackend = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 180;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg"));
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch("http://localhost:8000/detect", { method: "POST", body: formData });
      const data = await res.json();

      const head = data.head_direction || "Unknown";
      const eyes = data.eye_direction || "Unknown";

      setHeadDir(head);
      setEyeDir(eyes);

      const status = computeProctorStatus(head, eyes);
      setProctorStatus(status);

      if (status === "Cheating") {
        setCheatingCount((prev) => {
          const updated = prev + 1;
          if (updated > 5) {
            toast({
              title: "Test Terminated",
              description: "Too many cheating attempts detected!",
              variant: "destructive",
            });
            // Optionally disable further actions
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Proctoring fetch error:", err);
      setHeadDir("Unknown");
      setEyeDir("Unknown");
      setProctorStatus("Error");
    }
  };

  useEffect(() => {
    const initCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 240, height: 180 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;

        detectionIntervalRef.current = window.setInterval(sendFrameToBackend, 2000);
      } catch {
        setHeadDir("Camera Error");
        setEyeDir("Camera Error");
        setProctorStatus("Error");
      }
    };

    initCam();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="java">Java</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          {/* Cheating Count Badge */}
          <div
            className={`px-3 py-1 rounded-md text-white font-medium transition-colors duration-300
              ${cheatingCount > 5 ? "bg-red-600" : "bg-gray-600"}
            `}
          >
            Cheating Count: {cheatingCount}
          </div>

          <Button onClick={runCode} disabled={isRunning} variant="outline" className="flex items-center gap-2">
            <Play className="h-4 w-4" /> Run Tests
          </Button>
          <Button onClick={handleSubmit} disabled={isRunning}>Submit</Button>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", automaticLayout: true }}
        />

        {/* Camera Feed */}
        <div
          className={`absolute top-4 right-4 w-64 h-48 rounded-xl overflow-hidden transition-all duration-300
            border-4
            ${proctorStatus === "Cheating" ? "border-red-600" : 
              proctorStatus === "Suspicious" ? "border-orange-500" : 
              "border-green-600"}
            shadow-lg
            ${proctorStatus === "Cheating" ? "shadow-red-600/50" : 
              proctorStatus === "Suspicious" ? "shadow-orange-500/50" : 
              "shadow-green-600/50"}
          `}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <div
            className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-md font-medium text-white
              ${proctorStatus === "Cheating" ? "bg-red-600" :
                proctorStatus === "Suspicious" ? "bg-orange-500" :
                "bg-green-600"}
              transition-colors duration-300
            `}
          >
            {proctorStatus} • Head: {headDir}, Eyes: {eyeDir}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CodeEditor;
