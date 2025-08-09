import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { Code2, Github, Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [accountType, setAccountType] = useState<"student" | "faculty">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { ...formData, accountType });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <Code2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your coding journey</p>
          </div>

          <Card className="bg-gradient-card border-primary/10 shadow-medium">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center">Login to CodeNova</CardTitle>
              <CardDescription className="text-center">
                {accountType === "student" ? "Join contests and solve challenges" : "Set contests and manage participants"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Tabs value={accountType} onValueChange={(v) => setAccountType(v as "student" | "faculty")} className="animate-fade-in">
                  <TabsList className="grid grid-cols-2 w-full max-w-xs">
                    <TabsTrigger value="student" className="hover-scale">Student</TabsTrigger>
                    <TabsTrigger value="faculty" className="hover-scale">Faculty</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="accountType" value={accountType} />
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background/50 border-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-background/50 border-primary/20 focus:border-primary pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary-glow transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Sign In
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:text-primary-glow transition-colors font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:text-primary-glow transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:text-primary-glow transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;