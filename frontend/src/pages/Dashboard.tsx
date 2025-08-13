// src/pages/Dashboard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage / sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card className="bg-gradient-card border-primary/10 shadow-medium animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-foreground">
            <p>
              You are now logged in. 🎉
            </p>
            <p>
              From here, you can start exploring contests, solving challenges, or managing events.
            </p>
            <Button variant="destructive" onClick={handleLogout} className="mt-4">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
