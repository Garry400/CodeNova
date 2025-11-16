import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Check, X, Video, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

interface TestCase {
  input: string;
  output: string;
}

interface CodeEditorProps {
  questionId: string;
  testCases: TestCase[];
  onSubmit: (code: string, language: string, results: TestResult[]) => void;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

const CodeEditor = ({ questionId, testCases, onSubmit }: CodeEditorProps) => {
  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [faceDetectionStatus, setFaceDetectionStatus] = useState<"checking" | "ok" | "warning" | "error">("checking");
  const [detectionMessage, setDetectionMessage] = useState("Initializing...");
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  const languageTemplates: Record<string, string> = {
    javascript: "// Write your JavaScript code here\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n",
    python: "# Write your Python code here\ndef solution(input):\n    # Your code here\n    return input\n",
    cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n",
    java: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n"
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage] || "");
  };

  const runCode = () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // Simple JavaScript evaluation (in production, use a backend service)
      if (language === "javascript") {
        testCases.forEach((testCase) => {
          try {
            // Execute the code
            const func = new Function("input", code + "\nreturn solution(input);");
            const actual = String(func(testCase.input));
            const expected = testCase.output.trim();
            
            results.push({
              passed: actual.trim() === expected,
              input: testCase.input,
              expected: expected,
              actual: actual.trim()
            });
          } catch (error) {
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.output,
              actual: `Error: ${error}`
            });
          }
        });
      } else {
        // For other languages, show placeholder results
        toast({
          title: "Language Not Supported",
          description: "Only JavaScript execution is supported in this demo. Other languages will be evaluated on submission.",
          variant: "destructive"
        });
        testCases.forEach((testCase) => {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.output,
            actual: "Not executed (language not supported in test run)"
          });
        });
      }

      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      toast({
        title: "Test Run Complete",
        description: `${passedCount}/${results.length} test cases passed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run code",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (testResults.length === 0) {
      toast({
        title: "Run Tests First",
        description: "Please run your code against test cases before submitting",
        variant: "destructive"
      });
      return;
    }

    onSubmit(code, language, testResults);
  };

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 240, height: 180 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraEnabled(true);
        }

        // Load face detection model
        const model = await blazeface.load();
        modelRef.current = model;
        setFaceDetectionStatus("ok");
        setDetectionMessage("Face detected");

        // Start face detection
        detectionIntervalRef.current = window.setInterval(async () => {
          if (videoRef.current && modelRef.current) {
            const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
            
            if (predictions.length === 0) {
              setFaceDetectionStatus("error");
              setDetectionMessage("No face detected!");
            } else if (predictions.length > 1) {
              setFaceDetectionStatus("warning");
              setDetectionMessage("Multiple faces detected!");
            } else {
              setFaceDetectionStatus("ok");
              setDetectionMessage("Face detected");
            }
          }
        }, 2000);

      } catch (error) {
        console.error("Error accessing camera:", error);
        setFaceDetectionStatus("error");
        setDetectionMessage("Camera access denied");
        toast({
          title: "Camera Required",
          description: "Please enable camera access for proctoring",
          variant: "destructive"
        });
      }
    };

    initializeCamera();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [toast]);

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

        <div className="flex gap-2">
          <Button onClick={runCode} disabled={isRunning} variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Run Tests
          </Button>
          <Button onClick={handleSubmit} disabled={isRunning}>
            Submit Solution
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden relative">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
        
        {/* Camera Feed Overlay */}
        <div className="absolute top-4 right-4 w-60 h-45 bg-background border-2 rounded-lg overflow-hidden shadow-lg" 
             style={{ 
               borderColor: faceDetectionStatus === "ok" ? "hsl(var(--success))" : 
                          faceDetectionStatus === "warning" ? "hsl(var(--warning))" : 
                          "hsl(var(--destructive))" 
             }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Status Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/90 px-2 py-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {faceDetectionStatus === "ok" ? (
                <Check className="h-3 w-3 text-success" />
              ) : faceDetectionStatus === "warning" ? (
                <AlertTriangle className="h-3 w-3 text-warning" />
              ) : (
                <X className="h-3 w-3 text-destructive" />
              )}
              <span className={
                faceDetectionStatus === "ok" ? "text-success" :
                faceDetectionStatus === "warning" ? "text-warning" :
                "text-destructive"
              }>
                {detectionMessage}
              </span>
            </div>
            <Video className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </Card>

      {testResults.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.passed ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.passed ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-medium">Test Case {index + 1}</span>
                </div>
                <div className="text-sm space-y-1 ml-6">
                  <div>
                    <span className="text-muted-foreground">Input:</span> {result.input}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected:</span> {result.expected}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual:</span> {result.actual}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeEditor;