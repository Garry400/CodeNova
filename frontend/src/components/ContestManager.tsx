import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus, Edit, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Contest {
  id: string;
  name: string;
  description: string;
  creator: string;
  startTime: string;
  endTime: string;
  questions: Question[];
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
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

const ContestManager = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "recents">("ongoing");
  const username = localStorage.getItem("username") || "guest";
  const { toast } = useToast();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = () => {
    const stored = localStorage.getItem("contests");
    if (stored) {
      const allContests = JSON.parse(stored);
      setContests(allContests);
    }
  };

  const getContestStatus = (startTime: string, endTime: string): "upcoming" | "ongoing" | "completed" => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "ongoing";
  };

  const filteredContests = contests.filter(contest => {
    const status = getContestStatus(contest.startTime, contest.endTime);
    if (activeTab === "ongoing") return status === "ongoing";
    if (activeTab === "upcoming") return status === "upcoming";
    if (activeTab === "recents") return status === "completed" && contest.creator === username;
    return false;
  });

  const myContests = contests.filter(c => c.creator === username);

  const handleCreateContest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newContest: Contest = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      creator: username,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      questions: [],
      participants: 0,
      status: "upcoming"
    };

    const allContests = [...contests, newContest];
    localStorage.setItem("contests", JSON.stringify(allContests));
    setContests(allContests);
    setIsCreateOpen(false);
    
    toast({
      title: "Contest Created",
      description: "Your contest has been created successfully!",
    });
  };

  const handleDeleteContest = (contestId: string) => {
    const updatedContests = contests.filter(c => c.id !== contestId);
    localStorage.setItem("contests", JSON.stringify(updatedContests));
    setContests(updatedContests);
    
    toast({
      title: "Contest Deleted",
      description: "Contest has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contest Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Contest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Contest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateContest} className="space-y-4">
              <div>
                <Label htmlFor="name">Contest Name</Label>
                <Input id="name" name="name" required placeholder="e.g., Weekly Contest 123" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required placeholder="Contest description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" required />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" required />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: You can add questions after creating the contest
              </p>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Contest</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === "ongoing" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === "upcoming" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("recents")}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === "recents" 
              ? "border-b-2 border-primary text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Recents
        </button>
      </div>

      {/* Contest Cards */}
      <div className="grid gap-4">
        {filteredContests.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No contests found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "recents" 
                ? "You haven't hosted any completed contests yet." 
                : `There are no ${activeTab} contests at the moment.`}
            </p>
            {activeTab !== "recents" && (
              <Button onClick={() => setIsCreateOpen(true)}>Create Your First Contest</Button>
            )}
          </Card>
        ) : (
          filteredContests.map((contest) => {
            const isOwner = contest.creator === username;
            const status = getContestStatus(contest.startTime, contest.endTime);
            
            return (
              <Card key={contest.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{contest.name}</h3>
                      <Badge variant={status === "ongoing" ? "default" : "secondary"}>
                        {status}
                      </Badge>
                      {isOwner && <Badge variant="outline">Your Contest</Badge>}
                    </div>
                    <p className="text-muted-foreground">{contest.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(contest.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{contest.participants} participants</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isOwner && status !== "completed" && (
                    <>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Contest
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteContest(contest.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {status === "completed" && (
                    <Button variant="outline" size="sm">
                      View Leaderboard
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContestManager;