import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";

interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  questions: Question[];
}

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  testCases: TestCase[];
}

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

const ContestParticipation = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [submissions, setSubmissions] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const username = localStorage.getItem("username") || "guest";
  const { toast } = useToast();

  useEffect(() => {
    if (!contestId) return;

    const contests = JSON.parse(localStorage.getItem("contests") || "[]");
    const foundContest = contests.find((c: Contest) => c.id === contestId);
    
    if (!foundContest) {
      toast({
        title: "Contest Not Found",
        description: "This contest doesn't exist",
        variant: "destructive"
      });
      navigate("/home");
      return;
    }

    setContest(foundContest);
    if (foundContest.questions?.length > 0) {
      setSelectedQuestion(foundContest.questions[0].id);
    }

    // Load previous submissions
    const stored = JSON.parse(localStorage.getItem("submissions") || "[]");
    const userSubmissions = stored.filter(
      (s: any) => s.contestId === contestId && s.username === username
    );
    const submissionMap: Record<string, boolean> = {};
    userSubmissions.forEach((s: any) => {
      submissionMap[s.questionId] = true;
    });
    setSubmissions(submissionMap);
  }, [contestId, navigate, username, toast]);

  useEffect(() => {
    if (!contest) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(contest.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining("Contest Ended");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  const handleSubmit = (code: string, language: string, results: TestResult[]) => {
    if (!contest || !selectedQuestion) return;

    const submission = {
      id: Date.now().toString(),
      contestId: contest.id,
      questionId: selectedQuestion,
      username,
      code,
      language,
      results,
      submittedAt: new Date().toISOString(),
      score: results.filter(r => r.passed).length / results.length * 100
    };

    const stored = JSON.parse(localStorage.getItem("submissions") || "[]");
    localStorage.setItem("submissions", JSON.stringify([...stored, submission]));

    setSubmissions({ ...submissions, [selectedQuestion]: true });

    const passedCount = results.filter(r => r.passed).length;
    toast({
      title: "Solution Submitted!",
      description: `${passedCount}/${results.length} test cases passed`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (!contest) {
    return <div>Loading...</div>;
  }

  const currentQuestion = contest.questions?.find(q => q.id === selectedQuestion);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contests
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">{timeRemaining}</span>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
          <p className="text-muted-foreground">{contest.description}</p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Questions Sidebar */}
          <Card className="p-4 h-fit">
            <h2 className="font-semibold mb-4">Questions</h2>
            <div className="space-y-2">
              {contest.questions?.map((question, index) => (
                <Button
                  key={question.id}
                  variant={selectedQuestion === question.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  <span className="mr-2">{index + 1}.</span>
                  <span className="flex-1 text-left truncate">{question.title}</span>
                  {submissions[question.id] && (
                    <CheckCircle2 className="h-4 w-4 text-success ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </Card>

          {/* Question Content */}
          {currentQuestion ? (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
                
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{currentQuestion.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="mt-4">
                    <div className="space-y-4">
                      {currentQuestion.testCases?.slice(0, 2).map((testCase, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg">
                          <p className="font-semibold mb-2">Example {index + 1}:</p>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">Input:</span>
                              <code className="ml-2 bg-background px-2 py-1 rounded">
                                {testCase.input}
                              </code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Output:</span>
                              <code className="ml-2 bg-background px-2 py-1 rounded">
                                {testCase.output}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              <CodeEditor
                questionId={currentQuestion.id}
                testCases={currentQuestion.testCases || []}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No questions available for this contest yet.
              </p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContestParticipation;