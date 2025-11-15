import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Code2, Target } from "lucide-react";

const Profile = () => {
  // Get user data from localStorage
  const username = localStorage.getItem("username") || "guest";
  const userRole = localStorage.getItem("userRole") || "student";
  
  // Get or initialize user progress data
  const getUserData = () => {
    const stored = localStorage.getItem(`userData_${username}`);
    if (stored) return JSON.parse(stored);
    
    const defaultData = {
      username,
      role: userRole,
      rank: "250,000",
      easyCompleted: 0,
      easyTotal: 735,
      mediumCompleted: 0,
      mediumTotal: 1544,
      hardCompleted: 0,
      hardTotal: 681,
      badges: 0,
      streak: 0,
    };
    localStorage.setItem(`userData_${username}`, JSON.stringify(defaultData));
    return defaultData;
  };

  const userData = getUserData();

  const getRecentActivity = () => {
    const stored = localStorage.getItem(`activity_${username}`);
    if (stored) return JSON.parse(stored);
    return [
      { date: "Nov 5", problems: 0 },
      { date: "Nov 4", problems: 0 },
      { date: "Nov 3", problems: 0 },
      { date: "Nov 2", problems: 0 },
      { date: "Nov 1", problems: 0 },
    ];
  };

  const recentActivity = getRecentActivity();

  const getSkills = () => {
    const stored = localStorage.getItem(`skills_${username}`);
    if (stored) return JSON.parse(stored);
    return [];
  };

  const skills = getSkills();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">
                    {userData.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.username}</h2>
                <p className="text-sm text-muted-foreground">
                  Rank: ~{userData.rank}
                </p>
                <Button className="mt-4 w-full">Edit Profile</Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Badges</span>
                  </div>
                  <span className="font-bold">{userData.badges}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Streak</span>
                  </div>
                  <span className="font-bold">{userData.streak} days</span>
                </div>
              </div>

              {/* Community Stats */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold mb-3">Community Stats</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Views</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Solutions</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discuss</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reputation</span>
                  <span>0</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Solving Stats */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="h-5 w-5" />
                <h2 className="text-xl font-bold">Solved Problems</h2>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${(userData.easyCompleted + userData.mediumCompleted + userData.hardCompleted) * 1.5} 440`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold">
                      {userData.easyCompleted + userData.mediumCompleted + userData.hardCompleted}
                    </p>
                    <p className="text-sm text-muted-foreground">Solved</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Easy */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Easy</span>
                    <span className="text-sm text-muted-foreground">
                      {userData.easyCompleted}/{userData.easyTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(userData.easyCompleted / userData.easyTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Medium</span>
                    <span className="text-sm text-muted-foreground">
                      {userData.mediumCompleted}/{userData.mediumTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${(userData.mediumCompleted / userData.mediumTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hard</span>
                    <span className="text-sm text-muted-foreground">
                      {userData.hardCompleted}/{userData.hardTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(userData.hardCompleted / userData.hardTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Heatmap */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {recentActivity.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day.date}</div>
                    <div
                      className={`h-12 rounded flex items-center justify-center font-semibold ${
                        day.problems > 3
                          ? "bg-primary text-primary-foreground"
                          : day.problems > 1
                          ? "bg-primary/50"
                          : "bg-muted"
                      }`}
                    >
                      {day.problems}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Total active days: 45 | Max streak: {userData.streak} days
              </p>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill.name} • {skill.level}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Not enough data</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;