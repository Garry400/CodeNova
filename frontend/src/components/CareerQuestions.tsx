import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  acceptanceRate: string;
}

const CareerQuestions = () => {
  const navigate = useNavigate();

  const questions: Question[] = [
    { id: "1", title: "Two Sum", difficulty: "easy", topics: ["Array", "Hash Table"], acceptanceRate: "49.2%" },
    { id: "2", title: "Add Two Numbers", difficulty: "medium", topics: ["Linked List", "Math"], acceptanceRate: "41.3%" },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "medium", topics: ["String", "Sliding Window"], acceptanceRate: "34.8%" },
    { id: "4", title: "Median of Two Sorted Arrays", difficulty: "hard", topics: ["Array", "Binary Search"], acceptanceRate: "38.7%" },
    { id: "5", title: "Longest Palindromic Substring", difficulty: "medium", topics: ["String", "Dynamic Programming"], acceptanceRate: "33.4%" },
    { id: "6", title: "Reverse Integer", difficulty: "medium", topics: ["Math"], acceptanceRate: "27.8%" },
    { id: "7", title: "Palindrome Number", difficulty: "easy", topics: ["Math"], acceptanceRate: "54.2%" },
    { id: "8", title: "Regular Expression Matching", difficulty: "hard", topics: ["String", "Dynamic Programming"], acceptanceRate: "28.3%" },
    { id: "9", title: "Container With Most Water", difficulty: "medium", topics: ["Array", "Two Pointers"], acceptanceRate: "54.1%" },
    { id: "10", title: "3Sum", difficulty: "medium", topics: ["Array", "Two Pointers"], acceptanceRate: "33.8%" },
    { id: "11", title: "Roman to Integer", difficulty: "easy", topics: ["Hash Table", "Math", "String"], acceptanceRate: "58.9%" },
    { id: "12", title: "Longest Common Prefix", difficulty: "easy", topics: ["String"], acceptanceRate: "42.2%" },
    { id: "13", title: "Valid Parentheses", difficulty: "easy", topics: ["String", "Stack"], acceptanceRate: "40.6%" },
    { id: "14", title: "Merge Two Sorted Lists", difficulty: "easy", topics: ["Linked List"], acceptanceRate: "63.1%" },
    { id: "15", title: "Remove Duplicates from Sorted Array", difficulty: "easy", topics: ["Array", "Two Pointers"], acceptanceRate: "51.7%" },
  ];

  const handleQuestionClick = (question: Question) => {
    navigate(`/career/${question.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "hard":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Career Practice Questions</h2>
      
      <div className="space-y-2">
        {questions.map((question) => (
          <Card 
            key={question.id}
            className="p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleQuestionClick(question)}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                <Code2 className="h-4 w-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold hover:text-primary transition-colors">
                  {question.id}. {question.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {question.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
                <div className="text-sm text-muted-foreground min-w-[60px] text-right">
                  {question.acceptanceRate}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerQuestions;