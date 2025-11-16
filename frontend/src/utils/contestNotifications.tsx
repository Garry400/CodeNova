interface Notification {
  id: string;
  type: "contest_created" | "contest_starting" | "contest_started";
  contestId: string;
  contestName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export const addNotification = (notification: Notification) => {
  const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  localStorage.setItem("notifications", JSON.stringify([notification, ...existingNotifications]));
  
  // Trigger storage event for other tabs/components
  window.dispatchEvent(new Event("storage"));
};

export const createContestNotification = (contestId: string, contestName: string): Notification => {
  return {
    id: `create-${contestId}`,
    type: "contest_created",
    contestId,
    contestName,
    message: `New contest "${contestName}" has been scheduled!`,
    timestamp: new Date().toISOString(),
    read: false,
  };
};

export const checkAndSendContestNotifications = () => {
  const contests: Contest[] = JSON.parse(localStorage.getItem("contests") || "[]");
  const sentNotifications: string[] = JSON.parse(localStorage.getItem("sentNotificationIds") || "[]");
  const notifications: Notification[] = JSON.parse(localStorage.getItem("notifications") || "[]");
  
  const now = new Date();
  
  contests.forEach(contest => {
    const startTime = new Date(contest.startTime);
    const timeDiff = startTime.getTime() - now.getTime();
    const minutesUntilStart = Math.floor(timeDiff / (1000 * 60));
    
    // Check if contest is starting in 15 minutes (with 1-minute buffer)
    const startingSoonId = `starting-${contest.id}`;
    if (minutesUntilStart <= 15 && minutesUntilStart > 0 && !sentNotifications.includes(startingSoonId)) {
      const notification: Notification = {
        id: startingSoonId,
        type: "contest_starting",
        contestId: contest.id,
        contestName: contest.name,
        message: `Contest "${contest.name}" starts in ${minutesUntilStart} minute${minutesUntilStart !== 1 ? 's' : ''}!`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      notifications.unshift(notification);
      sentNotifications.push(startingSoonId);
    }
    
    // Check if contest has just started (within last 2 minutes)
    const startedId = `started-${contest.id}`;
    if (minutesUntilStart <= 0 && minutesUntilStart >= -2 && !sentNotifications.includes(startedId)) {
      const notification: Notification = {
        id: startedId,
        type: "contest_started",
        contestId: contest.id,
        contestName: contest.name,
        message: `Contest "${contest.name}" is now live! Join now!`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      notifications.unshift(notification);
      sentNotifications.push(startedId);
    }
  });
  
  localStorage.setItem("notifications", JSON.stringify(notifications));
  localStorage.setItem("sentNotificationIds", JSON.stringify(sentNotifications));
  
  // Trigger storage event
  window.dispatchEvent(new Event("storage"));
};

export const markAllNotificationsAsRead = () => {
  const notifications: Notification[] = JSON.parse(localStorage.getItem("notifications") || "[]");
  const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  window.dispatchEvent(new Event("storage"));
};

export const getUnreadCount = (): number => {
  const notifications: Notification[] = JSON.parse(localStorage.getItem("notifications") || "[]");
  return notifications.filter(n => !n.read).length;
};