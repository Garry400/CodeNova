import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  input: string;
  output: string;
}

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  testCases: TestCase[];
}

interface QuestionManagerProps {
  contestId: string;
  isOpen: boolean;
  onClose: () => void;
}

const QuestionManager = ({ contestId, isOpen, onClose }: QuestionManagerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: "", output: "" }]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen, contestId]);

  const loadQuestions = () => {
    const contests = JSON.parse(localStorage.getItem("contests") || "[]");
    const contest = contests.find((c: any) => c.id === contestId);
    if (contest) {
      setQuestions(contest.questions || []);
    }
  };

  const saveQuestions = (updatedQuestions: Question[]) => {
    const contests = JSON.parse(localStorage.getItem("contests") || "[]");
    const updatedContests = contests.map((c: any) =>
      c.id === contestId ? { ...c, questions: updatedQuestions } : c
    );
    localStorage.setItem("contests", JSON.stringify(updatedContests));
    setQuestions(updatedQuestions);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleTestCaseChange = (index: number, field: "input" | "output", value: string) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSaveQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const questionData: Question = {
      id: editingQuestion?.id || Date.now().toString(),
      title: formData.get("title") as string,
      difficulty: formData.get("difficulty") as "easy" | "medium" | "hard",
      description: formData.get("description") as string,
      testCases: testCases.filter(tc => tc.input.trim() || tc.output.trim()),
    };

    let updatedQuestions: Question[];
    if (editingQuestion) {
      updatedQuestions = questions.map(q => q.id === editingQuestion.id ? questionData : q);
    } else {
      updatedQuestions = [...questions, questionData];
    }

    saveQuestions(updatedQuestions);
    setIsAddEditOpen(false);
    setEditingQuestion(null);
    setTestCases([{ input: "", output: "" }]);

    toast({
      title: editingQuestion ? "Question Updated" : "Question Added",
      description: `Question "${questionData.title}" has been ${editingQuestion ? "updated" : "added"} successfully!`,
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setTestCases(question.testCases.length > 0 ? question.testCases : [{ input: "", output: "" }]);
    setIsAddEditOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    saveQuestions(updatedQuestions);
    toast({
      title: "Question Deleted",
      description: "Question has been removed from the contest.",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-success";
      case "medium": return "text-warning";
      case "hard": return "text-destructive";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Contest Questions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={() => {
            setEditingQuestion(null);
            setTestCases([{ input: "", output: "" }]);
            setIsAddEditOpen(true);
          }} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Question
          </Button>

          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions added yet. Click "Add New Question" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{question.title}</h3>
                        <span className={`text-sm font-medium capitalize ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {question.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {question.testCases.length} test case{question.testCases.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Question Dialog */}
        <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Edit" : "Add"} Question</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <Label htmlFor="title">Question Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingQuestion?.title}
                  required
                  placeholder="e.g., Two Sum"
                />
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select name="difficulty" defaultValue={editingQuestion?.difficulty || "medium"} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Problem Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingQuestion?.description}
                  required
                  rows={6}
                  placeholder="Describe the problem, constraints, and examples..."
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Test Cases</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTestCase}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Test Case
                  </Button>
                </div>

                {testCases.map((testCase, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Test Case {index + 1}</span>
                        {testCases.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTestCase(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Input</Label>
                        <Textarea
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                          rows={2}
                          placeholder="e.g., [2,7,11,15], 9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Expected Output</Label>
                        <Textarea
                          value={testCase.output}
                          onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                          rows={2}
                          placeholder="e.g., [0,1]"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingQuestion ? "Update" : "Add"} Question
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddEditOpen(false);
                  setEditingQuestion(null);
                  setTestCases([{ input: "", output: "" }]);
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionManager;