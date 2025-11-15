import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Flame, Sparkles, Eye, Verified, Code2, Briefcase, Trophy, BookOpen, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("for-you");

  const [viewCounts, setViewCounts] = useState<{[key: number]: number}>({});

  const posts = [
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
    {
      author: "Debmalya",
      verified: false,
      time: "2 hours ago",
      title: "Salesforce | SMTS | OA",
      content: "Has anyone received the Online Assessment for Salesforce SMTS role? Would love to connect and discuss the format and preparation strategies.",
      upvotes: 0,
      views: 45,
      icon: Code2,
      tags: ["#Salesforce", "#OA"]
    },
    {
      author: "Tech Learner",
      verified: false,
      time: "3 hours ago",
      title: "Google L4 role questions regarding — (comparison)",
      content: "I've been interviewing for Google L4 positions and wanted to compare experiences with others. How does the interview process compare to other FAANG companies?",
      upvotes: 3,
      views: 210,
      icon: Briefcase,
      tags: ["#Google", "#L4"]
    },
    {
      author: "DSA Master",
      verified: true,
      time: "5 hours ago",
      title: "Which Language to Choose for DSA?",
      content: "A comprehensive guide on choosing the right programming language for Data Structures and Algorithms. We'll cover Python, Java, C++, and JavaScript, discussing the pros and cons of each. Python offers simplicity and readability, making it great for beginners...",
      upvotes: 89,
      views: 5200,
      icon: Languages,
      tags: ["#DSA", "#Languages", "#Guide"]
    }
  ];

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
      </main>
    </div>
  );
};

export default Home;