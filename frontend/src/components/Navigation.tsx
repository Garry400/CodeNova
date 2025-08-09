import { Button } from "@/components/ui/button";
import { Code2, Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CodeNova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
              Working
            </Link>
            <Link to="/#contests" className="text-foreground hover:text-primary transition-colors">
              Contests
            </Link>
            <Link to="/#about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#how-it-works"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              Working
            </Link>
            <Link
              to="/#contests"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              Contests
            </Link>
            <Link
              to="/#about"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="self-start"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;