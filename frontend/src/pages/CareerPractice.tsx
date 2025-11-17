import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  description: string;
  testCases: TestCase[];
  acceptanceRate: string;
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

const careerQuestions: Question[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    topics: ["Array", "Hash Table"],
    acceptanceRate: "49.2%",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]" },
      { input: "[3,2,4], 6", output: "[1,2]" },
      { input: "[3,3], 6", output: "[0,1]" }
    ]
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "medium",
    topics: ["Linked List", "Math"],
    acceptanceRate: "41.3%",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nExample:\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.",
    testCases: [
      { input: "[2,4,3], [5,6,4]", output: "[7,0,8]" },
      { input: "[0], [0]", output: "[0]" },
      { input: "[9,9,9,9,9,9,9], [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" }
    ]
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topics: ["String", "Sliding Window"],
    acceptanceRate: "34.8%",
    description: "Given a string s, find the length of the longest substring without repeating characters.\n\nExample:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
    testCases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" }
    ]
  },
  {
    id: "4",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    topics: ["Array", "Binary Search"],
    acceptanceRate: "38.7%",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nExample:\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.0\nExplanation: merged array = [1,2,3] and median is 2.",
    testCases: [
      { input: "[1,3], [2]", output: "2.0" },
      { input: "[1,2], [3,4]", output: "2.5" },
      { input: "[], [1]", output: "1.0" }
    ]
  },
  {
    id: "5",
    title: "Longest Palindromic Substring",
    difficulty: "medium",
    topics: ["String", "Dynamic Programming"],
    acceptanceRate: "33.4%",
    description: "Given a string s, return the longest palindromic substring in s.\n\nExample:\nInput: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer.",
    testCases: [
      { input: "babad", output: "bab" },
      { input: "cbbd", output: "bb" },
      { input: "a", output: "a" }
    ]
  },
  {
    id: "6",
    title: "Reverse Integer",
    difficulty: "medium",
    topics: ["Math"],
    acceptanceRate: "27.8%",
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nExample:\nInput: x = 123\nOutput: 321",
    testCases: [
      { input: "123", output: "321" },
      { input: "-123", output: "-321" },
      { input: "120", output: "21" }
    ]
  },
  {
    id: "7",
    title: "Palindrome Number",
    difficulty: "easy",
    topics: ["Math"],
    acceptanceRate: "54.2%",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nExample:\nInput: x = 121\nOutput: true\nExplanation: 121 reads as 121 from left to right and from right to left.",
    testCases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" }
    ]
  },
  {
    id: "8",
    title: "Regular Expression Matching",
    difficulty: "hard",
    topics: ["String", "Dynamic Programming"],
    acceptanceRate: "28.3%",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:\n'.' Matches any single character.\n'*' Matches zero or more of the preceding element.\n\nExample:\nInput: s = \"aa\", p = \"a\"\nOutput: false",
    testCases: [
      { input: "aa, a", output: "false" },
      { input: "aa, a*", output: "true" },
      { input: "ab, .*", output: "true" }
    ]
  },
  {
    id: "9",
    title: "Container With Most Water",
    difficulty: "medium",
    topics: ["Array", "Two Pointers"],
    acceptanceRate: "54.1%",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nExample:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49",
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "[1,1]", output: "1" },
      { input: "[4,3,2,1,4]", output: "16" }
    ]
  },
  {
    id: "10",
    title: "3Sum",
    difficulty: "medium",
    topics: ["Array", "Two Pointers"],
    acceptanceRate: "33.8%",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.\n\nExample:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]",
    testCases: [
      { input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "[0,1,1]", output: "[]" },
      { input: "[0,0,0]", output: "[[0,0,0]]" }
    ]
  },
  {
    id: "11",
    title: "Roman to Integer",
    difficulty: "easy",
    topics: ["Hash Table", "Math", "String"],
    acceptanceRate: "58.9%",
    description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.\n\nSymbol Value\nI 1\nV 5\nX 10\nL 50\nC 100\nD 500\nM 1000\n\nGiven a roman numeral, convert it to an integer.\n\nExample:\nInput: s = \"III\"\nOutput: 3",
    testCases: [
      { input: "III", output: "3" },
      { input: "LVIII", output: "58" },
      { input: "MCMXCIV", output: "1994" }
    ]
  },
  {
    id: "12",
    title: "Longest Common Prefix",
    difficulty: "easy",
    topics: ["String"],
    acceptanceRate: "42.2%",
    description: "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string \"\".\n\nExample:\nInput: strs = [\"flower\",\"flow\",\"flight\"]\nOutput: \"fl\"",
    testCases: [
      { input: "[\"flower\",\"flow\",\"flight\"]", output: "fl" },
      { input: "[\"dog\",\"racecar\",\"car\"]", output: "" },
      { input: "[\"ab\",\"a\"]", output: "a" }
    ]
  },
  {
    id: "13",
    title: "Valid Parentheses",
    difficulty: "easy",
    topics: ["String", "Stack"],
    acceptanceRate: "40.6%",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample:\nInput: s = \"()\"\nOutput: true",
    testCases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" }
    ]
  },
  {
    id: "14",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    topics: ["Linked List"],
    acceptanceRate: "63.1%",
    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
    testCases: [
      { input: "[1,2,4], [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "[], []", output: "[]" },
      { input: "[], [0]", output: "[0]" }
    ]
  },
  {
    id: "15",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    topics: ["Array", "Two Pointers"],
    acceptanceRate: "51.7%",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.\n\nExample:\nInput: nums = [1,1,2]\nOutput: 2, nums = [1,2,_]\nExplanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.",
    testCases: [
      { input: "[1,1,2]", output: "2" },
      { input: "[0,0,1,1,1,2,2,3,3,4]", output: "5" },
      { input: "[1,2,3]", output: "3" }
    ]
  }
];

const CareerPractice = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const username = localStorage.getItem("username") || "guest";
  const { toast } = useToast();

  useEffect(() => {
    if (!questionId) return;

    const foundQuestion = careerQuestions.find((q) => q.id === questionId);
    
    if (!foundQuestion) {
      toast({
        title: "Question Not Found",
        description: "This question doesn't exist",
        variant: "destructive"
      });
      navigate("/home");
      return;
    }

    setQuestion(foundQuestion);

    // Check if already submitted
    const submissions = JSON.parse(localStorage.getItem("careerSubmissions") || "[]");
    const hasSubmitted = submissions.some(
      (s: any) => s.questionId === questionId && s.username === username
    );
    setSubmitted(hasSubmitted);
  }, [questionId, navigate, username, toast]);

  const handleSubmit = (code: string, language: string, results: TestResult[]) => {
    if (!question) return;

    const submission = {
      id: Date.now().toString(),
      questionId: question.id,
      username,
      code,
      language,
      results,
      submittedAt: new Date().toISOString(),
      score: results.filter(r => r.passed).length / results.length * 100
    };

    const submissions = JSON.parse(localStorage.getItem("careerSubmissions") || "[]");
    submissions.push(submission);
    localStorage.setItem("careerSubmissions", JSON.stringify(submissions));

    setSubmitted(true);

    const passedCount = results.filter(r => r.passed).length;
    toast({
      title: passedCount === results.length ? "All Tests Passed!" : "Submission Recorded",
      description: `${passedCount}/${results.length} test cases passed`,
      variant: passedCount === results.length ? "default" : "destructive"
    });
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

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Career Questions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Details */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {question.id}. {question.title}
                </h1>
                {submitted && (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Acceptance: {question.acceptanceRate}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {question.topics.map((topic, idx) => (
                  <Badge key={idx} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {question.description}
                </pre>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Sample Test Cases</h3>
                <div className="space-y-2">
                  {question.testCases.map((tc, idx) => (
                    <div key={idx} className="bg-muted p-3 rounded-lg text-sm">
                      <div>
                        <span className="font-medium">Input:</span> {tc.input}
                      </div>
                      <div>
                        <span className="font-medium">Output:</span> {tc.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Code Editor */}
          <div>
            <CodeEditor
              questionId={question.id}
              testCases={question.testCases}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CareerPractice;