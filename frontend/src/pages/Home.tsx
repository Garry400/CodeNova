import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Flame, Sparkles, Eye, Verified, Code2, Briefcase, Trophy, BookOpen, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import ContestManager from "@/components/ContestManager";
import ContestList from "@/components/ContestList";
import CareerQuestions from "@/components/CareerQuestions";

const Home = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const [viewCounts, setViewCounts] = useState<{[key: number]: number}>({});
  const [userRole, setUserRole] = useState<string>("student");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "student";
    setUserRole(role);
  }, []);

  const forYouPosts = [
    {
      author: "CodeNova",
      verified: true,
      time: "Sep 23, 2025",
      title: "What to ✨ Ask CodeNova. Winners Announcement 🎁",
      content: "👋 Hello CodeNovaers! We're excited to introduce a new feature to your coding experience: CodeNova AI. It is designed to help you explore ideas, fix bugs faster, and refine your coding style more effectively. 📚 Try...",
      upvotes: 177,
      views: 21700,
      icon: Trophy,
      tags: ["#Announcement", "#AI"]
    },
    {
      author: "Vishal Arya",
      verified: false,
      time: "an hour ago",
      title: "Microsoft Interview Experience | 28 Sept",
      content: "Round 1: Dsa round. Two questions were asked. First one was based on binary search. Second one was about stack. The interviewer was amazing. He shared a lot about his work. My remarks: Always be communicative and voice out your...",
      upvotes: 2,
      views: 183,
      icon: Briefcase,
      tags: ["#Microsoft", "#Interview"]
    },
    {
      author: "Anonymous User",
      verified: false,
      time: "an hour ago",
      title: "Need some real-world career advice — not about coding this time",
      content: "Hey everyone, this is kind of off-topic and doesn't exactly fit the usual leetcode theme, but I'm asking here because I truly believe people on this platform can give genuine, thoughtful advice since we all have once gone through this phase. So here's...",
      upvotes: 1,
      views: 80,
      icon: Briefcase,
      tags: ["#Career", "#Advice"]
    },
  ];

  const dsaTopicsPosts = [
    {
      author: "Algorithm Expert",
      verified: true,
      time: "2 hours ago",
      title: "Master Dynamic Programming in 30 Days",
      content: "A comprehensive roadmap to mastering dynamic programming. Start with basics like Fibonacci, move to 1D DP, then 2D DP, and finally tackle advanced problems. Includes practice problems for each level...",
      upvotes: 234,
      views: 12500,
      icon: Code2,
      tags: ["#DynamicProgramming", "#DSA"]
    },
    {
      author: "Data Structure Guru",
      verified: true,
      time: "5 hours ago",
      title: "Graph Algorithms: A Visual Guide",
      content: "Understanding graph algorithms through visualization. This post covers BFS, DFS, Dijkstra's, and more with interactive examples and real-world applications...",
      upvotes: 189,
      views: 8900,
      icon: BookOpen,
      tags: ["#Graphs", "#Algorithms"]
    },
    {
      author: "Tree Master",
      verified: false,
      time: "1 day ago",
      title: "Binary Trees: From Basics to Advanced",
      content: "Everything you need to know about binary trees, including traversals, BST operations, balanced trees, and common interview patterns...",
      upvotes: 156,
      views: 7200,
      icon: Code2,
      tags: ["#Trees", "#DataStructures"]
    },
  ];

  const languagesPosts = [
    {
      author: "Python Expert",
      verified: true,
      time: "3 hours ago",
      title: "Python vs C++ for Competitive Programming",
      content: "An in-depth comparison of Python and C++ for competitive programming. While Python offers cleaner syntax and faster development, C++ provides better performance for time-critical problems...",
      upvotes: 298,
      views: 15600,
      icon: Languages,
      tags: ["#Python", "#CPP", "#CompetitiveProgramming"]
    },
    {
      author: "JavaScript Ninja",
      verified: true,
      time: "6 hours ago",
      title: "Modern JavaScript Features for Coding Interviews",
      content: "Essential JavaScript features every developer should know for technical interviews: destructuring, spread operators, array methods, promises, and more...",
      upvotes: 167,
      views: 9300,
      icon: Code2,
      tags: ["#JavaScript", "#Interviews"]
    },
    {
      author: "Java Developer",
      verified: false,
      time: "1 day ago",
      title: "Why Java is Still Relevant in 2025",
      content: "Despite the rise of newer languages, Java remains a powerhouse for enterprise applications, Android development, and competitive programming. Here's why...",
      upvotes: 143,
      views: 6800,
      icon: Languages,
      tags: ["#Java", "#Programming"]
    },
  ];

  const getCurrentPosts = () => {
    switch (activeTab) {
      case "for-you":
        return forYouPosts;
      case "dsa":
        return dsaTopicsPosts;
      case "languages":
        return languagesPosts;
      default:
        return forYouPosts;
    }
  };

  const posts = getCurrentPosts();

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleCardView = (index: number) => {
    setViewCounts(prev => ({
      ...prev,
      [index]: (prev[index] || posts[index].views) + 1
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 py-6 mt-16">
        {/* Tabs Navigation */}
        <div className="mb-6 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-12 p-0 border-0">
              <TabsTrigger 
                value="for-you" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                <Flame className="h-4 w-4 mr-2" />
                For You
              </TabsTrigger>
              <TabsTrigger 
                value="career" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                Career
              </TabsTrigger>
              <TabsTrigger 
                value="contest" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                Contest
              </TabsTrigger>
              <TabsTrigger 
                value="dsa" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                DSA Topics
              </TabsTrigger>
              <TabsTrigger 
                value="languages" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
              >
                Languages
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Career Tab */}
        {activeTab === "career" && <CareerQuestions />}

        {/* Contest Tab */}
        {activeTab === "contest" && (
          userRole === "faculty" ? <ContestManager /> : <ContestList />
        )}

        {/* For You, DSA Topics, Languages Tabs */}
        {(activeTab === "for-you" || activeTab === "dsa" || activeTab === "languages") && (
          <>
            {/* Sort Options */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <Button variant="ghost" size="sm" className="gap-2">
                <Flame className="h-4 w-4" />
                Most Votes
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Newest
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post, index) => {
                const Icon = post.icon;
                const currentViews = viewCounts[index] || post.views;
                
                return (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow" onClick={() => handleCardView(index)}>
                    <div className="flex gap-4">
                      {/* Icon Section */}
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{post.author}</span>
                          {post.verified && <Verified className="h-4 w-4 text-primary fill-primary" />}
                          <span>·</span>
                          <span>{post.time}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{formatViews(currentViews)}</span>
                          </div>
                          <div className="flex gap-2">
                            {post.tags.map((tag, idx) => (
                              <span key={idx} className="text-primary hover:underline cursor-pointer">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Show More Button */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Show More
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;