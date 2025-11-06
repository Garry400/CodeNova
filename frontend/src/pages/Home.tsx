import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Code2, TrendingUp, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const topics = [
    { name: "Array", link: "#", icon: "📊" },
    { name: "String", link: "#", icon: "📝" },
    { name: "Linked List", link: "#", icon: "🔗" },
    { name: "Stack", link: "#", icon: "📚" },
    { name: "Queue", link: "#", icon: "🎯" },
    { name: "Tree", link: "#", icon: "🌳" },
    { name: "Graph", link: "#", icon: "🕸️" },
    { name: "Dynamic Programming", link: "#", icon: "💡" },
    { name: "Greedy", link: "#", icon: "🎲" },
    { name: "Backtracking", link: "#", icon: "🔄" },
    { name: "Binary Search", link: "#", icon: "🔍" },
    { name: "Sorting", link: "#", icon: "📈" },
  ];

  const contests = [
    { title: "Weekly Contest 421", date: "In 3 days", badge: "New" },
    { title: "Biweekly Contest 143", date: "In 5 days", badge: "New" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to CodeNova</h1>
          <p className="text-muted-foreground">
            Master Data Structures and Algorithms through practice and contests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,500+</p>
                <p className="text-sm text-muted-foreground">Problems</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Weekly</p>
                <p className="text-sm text-muted-foreground">Contests</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">100K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Contests */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Upcoming Contests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.map((contest, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{contest.title}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {contest.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{contest.date}</p>
                <Button size="sm" className="w-full">Register Now</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* DSA Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Explore Topics</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Master fundamental data structures and algorithms. Each topic contains curated problems from easy to advanced level.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <a
                key={index}
                href={topic.link}
                className="group"
              >
                <Card className="p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-3">{topic.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {topic.name}
                    </h3>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;