"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AddMiniAppButton from "./AddMiniAppButton";

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function NotificationManager() {
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    {
      id: "new_listing",
      title: "New Listings",
      description: "Get notified when new NFTs are listed",
      icon: "🎨",
      enabled: true,
    },
    {
      id: "price_drops",
      title: "Price Drops",
      description: "Alert me when NFT prices decrease",
      icon: "💰",
      enabled: true,
    },
    {
      id: "offers",
      title: "Offers Received",
      description: "Notify when someone makes an offer on your NFTs",
      icon: "💎",
      enabled: true,
    },
    {
      id: "sales",
      title: "Sales Updates",
      description: "Get notified when your NFTs sell",
      icon: "✨",
      enabled: true,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotificationOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Enable Notifications
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with real-time alerts about your NFT activity
        </p>
      </div>

      {/* Add Mini App Button */}
      <div className="flex justify-center">
        <AddMiniAppButton />
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        
        <div className="space-y-3">
          {notificationOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              className="
                flex items-center justify-between
                p-4 rounded-xl
                bg-gray-50 dark:bg-gray-700/50
                border border-gray-100 dark:border-gray-600
                transition-all duration-200
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleNotification(option.id)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${
                    option.enabled
                      ? "bg-purple-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full
                    bg-white shadow-lg transition-transform duration-200 ease-in-out
                    ${option.enabled ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="
        bg-gradient-to-r from-purple-50 to-blue-50
        dark:from-purple-900/20 dark:to-blue-900/20
        border border-purple-100 dark:border-purple-800
        rounded-xl p-4
      ">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              How Notifications Work
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              After adding the Mini App, you'll receive in-app notifications directly in your Farcaster client. 
              You can manage preferences anytime from your client's settings.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-3xl mb-2">⚡</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Instant Updates
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get notified immediately when something happens
          </p>
        </div>

        <div className="text-center p-4">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Personalized
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Only receive notifications you care about
          </p>
        </div>

        <div className="text-center p-4">
          <div className="text-3xl mb-2">🔒</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            Secure & Private
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your notification preferences stay private
          </p>
        </div>
      </div>
    </div>
  );
}
