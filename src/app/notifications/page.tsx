import NotificationManager from "@/components/NotificationManager";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <NotificationManager />
      </div>
    </div>
  );
}
