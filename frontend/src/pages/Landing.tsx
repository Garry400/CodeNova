import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Brain, 
  Trophy, 
  Shield, 
  Code2, 
  Zap, 
  Users, 
  ArrowRight, 
  Star,
  CheckCircle,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Feedback",
      description: "Get instant, intelligent feedback on your code with our advanced ML algorithms that understand your programming style and suggest optimizations."
    },
    {
      icon: Trophy,
      title: "Contest Mode",
      description: "Participate in real-time competitive programming contests with global rankings, live leaderboards, and exciting prizes."
    },
    {
      icon: Shield,
      title: "Plagiarism Detection",
      description: "Advanced plagiarism detection ensures fair play and helps maintain the integrity of competitions and practice sessions."
    },
    {
      icon: Code2,
      title: "Multi-Language Support",
      description: "Code in your preferred language with support for C++, Python, Java, JavaScript, and many more programming languages."
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description: "Experience lightning-fast code execution with our optimized judging system and instant feedback on test cases."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow programmers, share solutions, and learn from the global competitive programming community."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Sign Up",
      description: "Create your free account and set up your coding profile with your preferred programming languages."
    },
    {
      step: "02", 
      title: "Practice",
      description: "Start with beginner-friendly problems and gradually work your way up to advanced algorithmic challenges."
    },
    {
      step: "03",
      title: "Get Feedback",
      description: "Receive instant AI-powered feedback on your solutions, including time complexity analysis and optimization suggestions."
    },
    {
      step: "04",
      title: "Compete",
      description: "Join live contests and compete with programmers worldwide to earn rankings and showcase your skills."
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer at Google",
      content: "CodeNova's AI feedback helped me improve my problem-solving speed by 40%. The contest environment is incredibly realistic.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "CS Student at MIT",
      content: "The plagiarism detection gives me confidence that competitions are fair. The community aspect is fantastic for learning.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Full Stack Developer",
      content: "Best competitive programming platform I've used. The interface is clean and the AI feedback is surprisingly accurate.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-fade-in-up">
                Level Up Your Coding Skills
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
                Practice. Compete. Learn with AI Feedback.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
                Join thousands of developers mastering competitive programming with our intelligent platform that provides real-time feedback and fair competition.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/login">
                  <Play className="mr-2 h-5 w-5" /> Watch Demo
                </Link>
              </Button>
            </div>
            
            <div className="mt-12">
              <div className="relative bg-gradient-card rounded-2xl p-8 shadow-strong animate-float">
                <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl"></div>
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary">10K+</div>
                      <div className="text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-muted-foreground">Programming Challenges</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-muted-foreground">Live Contests Monthly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Powerful Features for Modern Coders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to excel in competitive programming, powered by cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-primary/10 hover:shadow-medium transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              How CodeNova Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in minutes and begin your journey to competitive programming mastery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                  <span className="text-xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of developers who have transformed their coding skills with CodeNova.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-primary/10 hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                About CodeNova
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  CodeNova was born from the vision of making competitive programming more accessible, engaging, and effective for developers worldwide. Our platform combines the latest in artificial intelligence with proven pedagogical approaches to create an unparalleled learning experience.
                </p>
                <p>
                  Founded by former competitive programming champions and AI researchers, we understand the challenges developers face when trying to improve their algorithmic thinking and coding skills. That's why we've built a platform that not only tests your abilities but actively helps you grow.
                </p>
                <p>
                  With our advanced ML algorithms providing personalized feedback, fair competition environments, and a supportive community, CodeNova is more than just a practice platform—it's your partner in achieving coding excellence.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">AI-Powered Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">Global Community</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">Fair Competition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-strong">
                <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl"></div>
                <div className="relative space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Ready to Start Your Journey?</h3>
                  <p className="text-muted-foreground">
                    Join our growing community of developers and take your coding skills to the next level with personalized AI feedback and competitive challenges.
                  </p>
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/signup">
                      Start Coding Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;