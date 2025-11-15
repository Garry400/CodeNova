import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Contest {
  id: string;
  name: string;
  description: string;
  creator: string;
  startTime: string;
  endTime: string;
  questions: any[];
  participants: number;
}

const ContestList = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");
  const { toast } = useToast();

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = () => {
    const stored = localStorage.getItem("contests");
    if (stored) {
      setContests(JSON.parse(stored));
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
    return status === activeTab;
  });

  const handleJoinContest = (contestId: string, contestName: string) => {
    toast({
      title: "Joining Contest",
      description: `Redirecting to ${contestName}... (Code editor integration pending)`,
    });
    // TODO: Navigate to code editor with contest questions
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold">Contests</h2>

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
      </div>

      {/* Contest Cards */}
      <div className="grid gap-4">
        {filteredContests.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No contests available</h3>
            <p className="text-muted-foreground">
              There are no {activeTab} contests at the moment. Check back later!
            </p>
          </Card>
        ) : (
          filteredContests.map((contest) => {
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
                    </div>
                    <p className="text-muted-foreground">{contest.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created by {contest.creator}
                    </p>
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
                  {status === "ongoing" ? (
                    <Button 
                      onClick={() => handleJoinContest(contest.id, contest.name)}
                      className="gap-2"
                    >
                      Join Contest
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Starts {new Date(contest.startTime).toLocaleString()}
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

export default ContestList;