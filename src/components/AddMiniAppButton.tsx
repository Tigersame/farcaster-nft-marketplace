"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddMiniAppButton() {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddMiniApp = useCallback(async () => {
    setIsLoading(true);
    setResult("");

    try {
      const response = await sdk.actions.addMiniApp();

      if (response.notificationDetails) {
        setResult("🎉 Mini App added with notifications enabled!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      } else {
        setResult("✅ Mini App added (notifications not enabled)");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setResult(`❌ Error: ${errorMessage}`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative">
      <motion.button
        onClick={handleAddMiniApp}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          relative overflow-hidden
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-700 hover:to-blue-700
          text-white font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        "
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Mini App</span>
          </>
        )}
      </motion.button>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && result && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute top-full mt-3 left-1/2 transform -translate-x-1/2
              px-4 py-3 rounded-lg
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-lg
              min-w-[300px] max-w-[400px]
              text-sm text-gray-800 dark:text-gray-200
              z-50
            "
          >
            {result}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
