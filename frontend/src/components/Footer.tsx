import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CodeNova
              </span>
            </div>
            <p className="text-muted-foreground">
              Empowering developers to excel in competitive programming with AI-powered feedback and modern tools.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Platform</h3>
            <div className="space-y-2">
              <Link to="/practice" className="block text-muted-foreground hover:text-primary transition-colors">
                Practice Problems
              </Link>
              <Link to="/contests" className="block text-muted-foreground hover:text-primary transition-colors">
                Contests
              </Link>
              <Link to="/leaderboard" className="block text-muted-foreground hover:text-primary transition-colors">
                Leaderboard
              </Link>
              <Link to="/tutorials" className="block text-muted-foreground hover:text-primary transition-colors">
                Tutorials
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link to="/docs" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gradient-card rounded-lg hover:shadow-soft transition-all duration-300">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 bg-gradient-card rounded-lg hover:shadow-soft transition-all duration-300">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 bg-gradient-card rounded-lg hover:shadow-soft transition-all duration-300">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="mailto:contact@codenova.dev" className="p-2 bg-gradient-card rounded-lg hover:shadow-soft transition-all duration-300">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>contact@codenova.dev</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 CodeNova. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;