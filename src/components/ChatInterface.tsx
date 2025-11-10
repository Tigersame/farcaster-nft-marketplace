'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiCpu, FiCheck, FiExternalLink } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  toolCall?: boolean;
  functionName?: string;
  details?: any;
  transactionHash?: string;
}

interface ChatInterfaceProps {
  userAddress: string;
  hasPermission: boolean;
}

export default function ChatInterface({ userAddress, hasPermission }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: hasPermission
        ? "Hi! I'm your AI agent. I can help you buy Zora creator coins. Just tell me the creator's handle and how much you'd like to spend! For example: 'Buy $1.50 of @vitalik's creator coin'"
        : "Hi! Please set up a spend permission first to enable me to make purchases for you.",
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!hasPermission) {
      alert('Please set up a spend permission first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          userAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'Sorry, I could not process that request.',
        sender: 'agent',
        timestamp: new Date(),
        toolCall: data.toolCall,
        functionName: data.functionName,
        details: data.details,
        transactionHash: data.transactionHash,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}`,
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}
              >
                {message.sender === 'user' ? <FiUser /> : <FiCpu />}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Transaction Details */}
                  {message.toolCall && message.details && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <FiCheck className="text-green-400" />
                        <span className="opacity-90">Transaction Complete</span>
                      </div>
                      
                      {message.transactionHash && (
                        <a
                          href={`https://basescan.org/tx/${message.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          <span>View on BaseScan</span>
                          <FiExternalLink />
                        </a>
                      )}

                      {message.details.gasSponsored && (
                        <div className="text-xs opacity-75">
                          ⛽ Gas fees sponsored
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div
                  className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
              <FiCpu />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-end gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              hasPermission
                ? "Type your message... (e.g., 'Buy $1.50 of @vitalik's coin')"
                : 'Set up spend permission first...'
            }
            disabled={!hasPermission || isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <motion.button
            onClick={sendMessage}
            disabled={!inputValue.trim() || !hasPermission || isLoading}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: isLoading || !inputValue.trim() ? 1 : 1.05 }}
            whileTap={{ scale: isLoading || !inputValue.trim() ? 1 : 0.95 }}
          >
            <FiSend />
          </motion.button>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {hasPermission
            ? 'AI agent can autonomously purchase creator coins within your daily limit'
            : 'Enable spend permissions to start chatting'}
        </p>
      </div>
    </div>
  );
}
