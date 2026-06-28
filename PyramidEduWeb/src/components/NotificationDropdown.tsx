"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Megaphone,
  Users,
  FileText,
  BookOpen,
  Calendar,
  CreditCard,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  senderId: string | null;
  receiverId: string;
  title: string;
  message: string;
  notificationType: string;
  type: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string | null;
  } | null;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export const NotificationDropdown = () => {
  const { user, accessToken } = useAuth();
  const isAuthenticated = !!user && !!accessToken;
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const role = user?.role?.toLowerCase() || "student";

  // Fetch notifications list
  const fetchNotifications = async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) setLoading(true);
    try {
      const response = await api.get("/notifications?limit=20");
      if (response.data?.success) {
        setNotifications(response.data.data || []);
      }
      
      const countResponse = await api.get("/notifications/unread-count");
      if (countResponse.data?.success) {
        setUnreadCount(countResponse.data.data.count || 0);
      }
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error("Failed to fetch notifications:", error);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll for new notifications every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Mark single notification as read
  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await api.patch(`/notifications/${id}/read`);
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error("Failed to mark notification as read:", error);
      }
      fetchNotifications(true);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await api.patch("/notifications/read-all");
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error("Failed to mark all as read:", error);
      }
      fetchNotifications(true);
    }
  };

  // Delete notification
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const isUnread = notifications.find((n) => n.id === id && !n.isRead);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (isUnread) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }

      await api.delete(`/notifications/${id}`);
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error("Failed to delete notification:", error);
      }
      fetchNotifications(true);
    }
  };

  // Get matching icon and color for notification type
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return {
          icon: Megaphone,
          colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        };
      case "USER_REGISTRATION":
        return {
          icon: Users,
          colorClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        };
      case "REPORT_REMINDER":
        return {
          icon: FileText,
          colorClass: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
        };
      case "STUDENT_ENROLLMENT":
        return {
          icon: BookOpen,
          colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        };
      case "EXAM":
        return {
          icon: Calendar,
          colorClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
        };
      case "ASSIGNMENT":
        return {
          icon: FileText,
          colorClass: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        };
      case "PAYMENT":
        return {
          icon: CreditCard,
          colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        };
      case "SYSTEM":
      case "SECURITY":
        return {
          icon: Settings,
          colorClass: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
        };
      default:
        return {
          icon: Bell,
          colorClass: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
        };
    }
  };

  // Build routing link for Open Related Item
  const getRelatedItemRoute = (referenceType: string | null, referenceId: string | null) => {
    if (!referenceType) return null;
    
    switch (referenceType) {
      case "ANNOUNCEMENT":
        return `/${role}/announcements`;
      case "EXAM":
        return `/${role}/exams`;
      case "USER":
      case "STUDENT":
        return role === "admin" ? `/admin/users` : `/${role}/students`;
      case "ENROLLMENT":
        return role === "manager" ? `/manager/students` : `/${role}/students`;
      default:
        return null;
    }
  };

  const handleOpenRelatedItem = (refType: string | null, refId: string | null) => {
    const route = getRelatedItemRoute(refType, refId);
    if (route) {
      router.push(route);
      setSelectedNotification(null);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="View notifications"
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full border border-border/40 hover:bg-muted/50 transition-base"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-[10px] font-bold border-2 border-background animate-pulse"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-80 md:w-96 p-0 shadow-2xl rounded-2xl border border-border bg-popover text-popover-foreground overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/20">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:text-primary-hover font-semibold p-0 h-auto cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="mt-2 text-xs">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Bell className="h-8 w-8 opacity-40 mb-2" />
                <span className="text-xs font-medium">No Notifications</span>
              </div>
            ) : (
              notifications.map((n) => {
                const config = getTypeConfig(n.type);
                const IconComponent = config.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNotification(n);
                      setIsOpen(false);
                      if (!n.isRead) {
                        api.patch(`/notifications/${n.id}/read`).catch(console.error);
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
                        );
                        setUnreadCount((c) => Math.max(0, c - 1));
                      }
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 hover:bg-muted/40 transition-colors cursor-pointer relative",
                      !n.isRead && "bg-muted/15"
                    )}
                  >
                    {/* Unread indicator */}
                    {!n.isRead && (
                      <span className="absolute top-4 left-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    )}

                    {/* Icon */}
                    <div className={cn("rounded-xl p-2 shrink-0", config.colorClass)}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={cn("text-xs font-bold truncate text-foreground", !n.isRead && "text-blue-600 dark:text-blue-400")}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-center shrink-0">
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(e, n.id)}
                          title="Mark as Read"
                          className="h-7 w-7 flex items-center justify-center rounded-lg border border-border hover:bg-green-500/15 hover:text-green-500 dark:hover:text-green-400 transition-colors text-muted-foreground"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, n.id)}
                        title="Delete"
                        className="h-7 w-7 flex items-center justify-center rounded-lg border border-border hover:bg-red-500/15 hover:text-red-500 dark:hover:text-red-400 transition-colors text-muted-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/20 text-foreground bg-white/95 dark:bg-gray-900 animate-float-fast relative">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className={cn("rounded-xl p-2.5", getTypeConfig(selectedNotification.type).colorClass)}>
                {React.createElement(getTypeConfig(selectedNotification.type).icon, { className: "h-5 w-5" })}
              </div>
              <div>
                <h3 className="text-base font-bold">{selectedNotification.title}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
            </div>

            {selectedNotification.sender && (
              <div className="mt-4 bg-muted/30 rounded-xl p-3 text-xs flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {selectedNotification.sender.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold">{selectedNotification.sender.fullName}</span>
                  <span className="text-[10px] text-muted-foreground block">{selectedNotification.sender.email}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Type: {selectedNotification.type.replace("_", " ")}
              </span>
              <div className="flex gap-2">
                {getRelatedItemRoute(selectedNotification.referenceType, selectedNotification.referenceId) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleOpenRelatedItem(
                        selectedNotification.referenceType,
                        selectedNotification.referenceId
                      )
                    }
                    className="text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open Item
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setSelectedNotification(null)}
                  className="text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
