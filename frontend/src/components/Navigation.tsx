import { Button } from "@/components/ui/button";
import { Code2, Menu, X, Moon, Sun, User, LogOut, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUnreadCount, markAllNotificationsAsRead } from "@/utils/contestNotifications";

interface Notification {
  id: string;
  type: string;
  contestName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedUsername = localStorage.getItem("username") || "";
    setIsAuthenticated(authStatus);
    setUsername(storedUsername);
    
    // Load notifications
    loadNotifications();
    
    // Listen for storage changes to update notifications in real-time
    const handleStorageChange = () => {
      loadNotifications();
    };
    window.addEventListener("storage", handleStorageChange);
    
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loadNotifications = () => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const allNotifications = JSON.parse(stored);
      setNotifications(allNotifications.slice(0, 5)); // Show last 5
      setUnreadCount(getUnreadCount());
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accountType");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CodeNova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
                <Link to="/#about" className="text-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {isAuthenticated ? (
              <>
                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between p-2 border-b">
                      <span className="font-semibold">Notifications</span>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto py-1 px-2 text-xs"
                          onClick={handleMarkAllRead}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-center text-muted-foreground">
                        No notifications yet
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer">
                            <div className="flex gap-2 w-full">
                              <Bell className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-tight">
                                  {notif.contestName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatNotificationTime(notif.timestamp)}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
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
            {isAuthenticated ? (
              <>
                <Link
                  to="/#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/#about"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary transition-colors"
                >
                  Profile
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;