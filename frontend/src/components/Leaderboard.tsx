import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaderboardEntry {
  username: string;
  score: number;
  totalQuestions: number;
  submissionTime: string;
  rank: number;
}

interface LeaderboardProps {
  contestId: string;
  contestName: string;
}

const Leaderboard = ({ contestId, contestName }: LeaderboardProps) => {
  const getLeaderboardData = (): LeaderboardEntry[] => {
    const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    const contestSubmissions = submissions.filter((s: any) => s.contestId === contestId);

    // Group by user and calculate scores
    const userScores: Record<string, { score: number; time: string; total: number }> = {};

    contestSubmissions.forEach((sub: any) => {
      if (!userScores[sub.username]) {
        userScores[sub.username] = { score: 0, time: sub.submittedAt, total: 0 };
      }
      
      const passedTests = sub.results.filter((r: any) => r.passed).length;
      const totalTests = sub.results.length;
      const questionScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      
      userScores[sub.username].score += questionScore;
      userScores[sub.username].total++;
      
      // Keep earliest submission time
      if (new Date(sub.submittedAt) < new Date(userScores[sub.username].time)) {
        userScores[sub.username].time = sub.submittedAt;
      }
    });

    // Convert to array and sort
    const leaderboard = Object.entries(userScores)
      .map(([username, data]) => ({
        username,
        score: Math.round(data.score),
        totalQuestions: data.total,
        submissionTime: data.time,
        rank: 0
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime();
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return leaderboard;
  };

  const leaderboard = getLeaderboardData();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="font-semibold">{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1st Place</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">2nd Place</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">3rd Place</Badge>;
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      <p className="text-muted-foreground mb-6">{contestName}</p>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No submissions yet for this contest.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead className="text-center">Questions Solved</TableHead>
              <TableHead className="text-center">Total Score</TableHead>
              <TableHead className="text-right">Submission Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.username} className={entry.rank <= 3 ? "bg-muted/50" : ""}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.username}</span>
                    {getRankBadge(entry.rank)}
                  </div>
                </TableCell>
                <TableCell className="text-center">{entry.totalQuestions}</TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-primary">{entry.score}</span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(entry.submissionTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default Leaderboard;