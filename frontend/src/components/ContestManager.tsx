import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus, Edit, Trophy, FileQuestion } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionManager from "./QuestionManager";
import Leaderboard from "./Leaderboard";
import { createContestNotification, addNotification } from "@/utils/contestNotifications";

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "recents">("ongoing");
  const [questionManagerOpen, setQuestionManagerOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboardContest, setLeaderboardContest] = useState<{ id: string; name: string } | null>(null);
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
    
    // Send notification to all students
    const notification = createContestNotification(newContest.id, newContest.name);
    addNotification(notification);
    
    toast({
      title: "Contest Created",
      description: "Your contest has been created and students have been notified!",
    });
  };

  const handleEditContest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedContests = contests.map(c =>
      c.id === editingContest?.id ? {
        ...c,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
      } : c
    );
    
    localStorage.setItem("contests", JSON.stringify(updatedContests));
    setContests(updatedContests);
    setIsEditOpen(false);
    setEditingContest(null);
    
    toast({
      title: "Contest Updated",
      description: "Your contest has been updated successfully!",
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

  const openQuestionManager = (contestId: string) => {
    setSelectedContestId(contestId);
    setQuestionManagerOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contest Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Contest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateContest} className="space-y-4">
              <div>
                <Label htmlFor="name">Contest Name</Label>
                <Input id="name" name="name" required placeholder="e.g., Weekly Challenge #42" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe the contest..."
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" name="startTime" type="datetime-local" required />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" name="endTime" type="datetime-local" required />
              </div>
              <Button type="submit" className="w-full">Create Contest</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="recents">My Recents</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Contests Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContests.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No contests found in this category.
          </div>
        ) : (
          filteredContests.map((contest) => {
            const status = getContestStatus(contest.startTime, contest.endTime);
            const isOwner = contest.creator === username;
            
            return (
              <Card key={contest.id} className="p-4 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{contest.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {contest.description}
                    </p>
                  </div>
                  {status === "completed" && (
                    <Badge variant="secondary" className="ml-2">
                      <Trophy className="h-3 w-3 mr-1" />
                      Ended
                    </Badge>
                  )}
                  {status === "ongoing" && (
                    <Badge className="ml-2 bg-success">
                      Live
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(contest.startTime)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    Ends: {formatDate(contest.endTime)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {contest.participants} participants
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <FileQuestion className="h-4 w-4 mr-2 text-primary" />
                    {contest.questions?.length || 0} question{contest.questions?.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {isOwner && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openQuestionManager(contest.id)}
                    >
                      <FileQuestion className="h-4 w-4 mr-1" />
                      Questions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingContest(contest);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteContest(contest.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}

                {status === "completed" && isOwner && (
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => {
                      setLeaderboardContest({ id: contest.id, name: contest.name });
                      setLeaderboardOpen(true);
                    }}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Button>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Contest Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contest</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditContest} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Contest Name</Label>
              <Input
                id="edit-name"
                name="name"
                required
                defaultValue={editingContest?.name}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                required
                defaultValue={editingContest?.description}
              />
            </div>
            <div>
              <Label htmlFor="edit-startTime">Start Time</Label>
              <Input
                id="edit-startTime"
                name="startTime"
                type="datetime-local"
                required
                defaultValue={editingContest?.startTime}
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">End Time</Label>
              <Input
                id="edit-endTime"
                name="endTime"
                type="datetime-local"
                required
                defaultValue={editingContest?.endTime}
              />
            </div>
            <Button type="submit" className="w-full">Update Contest</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Question Manager */}
      <QuestionManager
        contestId={selectedContestId}
        isOpen={questionManagerOpen}
        onClose={() => {
          setQuestionManagerOpen(false);
          loadContests(); // Reload to show updated question count
        }}
      />

      {/* Leaderboard Dialog */}
      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contest Results</DialogTitle>
          </DialogHeader>
          {leaderboardContest && (
            <Leaderboard
              contestId={leaderboardContest.id}
              contestName={leaderboardContest.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContestManager;