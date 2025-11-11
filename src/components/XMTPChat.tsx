'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuickActions, createNFTQuickActions, ActionsContent, IntentContent } from './QuickActions'
import { useNotifications } from './NotificationSystem'
import { FiMessageSquare, FiX, FiSend, FiUser, FiZap } from 'react-icons/fi'

interface ChatMessage {
  id: string
  type: 'text' | 'actions' | 'intent' | 'system'
  content: string | ActionsContent
  sender: 'user' | 'agent' | 'system'
  timestamp: Date
  metadata?: any
}

interface XMTPChatProps {
  nftId?: string
  nftName?: string
  isOpen?: boolean
  onClose?: () => void
}

export function XMTPChat({ nftId, nftName, isOpen = false, onClose }: XMTPChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { addNotification } = useNotifications()

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages: ChatMessage[] = [
        {
          id: '1',
          type: 'system',
          content: 'Connected to Base App chat via XMTP',
          sender: 'system',
          timestamp: new Date()
        },
        {
          id: '2', 
          type: 'text',
          content: `hey there! 👋 interested in ${nftName ? `"${nftName}"` : 'this nft'}? i can help you with anything you need!`,
          sender: 'agent',
          timestamp: new Date()
        }
      ]
      
      setMessages(welcomeMessages)
      setIsConnected(true)

      // Show Quick Actions after welcome
      setTimeout(() => {
        if (nftId && nftName) {
          addQuickActions(createNFTQuickActions.purchase(nftId, nftName))
        } else {
          addQuickActions(createNFTQuickActions.onboarding('welcome'))
        }
      }, 1500)
    }
  }, [isOpen, nftId, nftName])

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addQuickActions = (actions: ActionsContent) => {
    addMessage({
      type: 'actions',
      content: actions,
      sender: 'agent'
    })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    addMessage({
      type: 'text',
      content: inputValue,
      sender: 'user'
    })

    const userMessage = inputValue.toLowerCase()
    setInputValue('')

    // Simulate agent typing
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      
      // Simple intent recognition for demo
      if (userMessage.includes('buy') || userMessage.includes('purchase')) {
        addMessage({
          type: 'text', 
          content: 'great choice! let me help you with the purchase process 💎',
          sender: 'agent'
        })
        
        if (nftId && nftName) {
          setTimeout(() => {
            addQuickActions(createNFTQuickActions.purchase(nftId, nftName))
          }, 1000)
        }
      } else if (userMessage.includes('sell') || userMessage.includes('list')) {
        addMessage({
          type: 'text',
          content: 'ready to list your nft? i\'ll walk you through the options! 📈',
          sender: 'agent'
        })
        
        if (nftId) {
          setTimeout(() => {
            addQuickActions(createNFTQuickActions.listing(nftId))
          }, 1000)
        }
      } else if (userMessage.includes('share') || userMessage.includes('cast')) {
        addMessage({
          type: 'text',
          content: 'awesome! sharing nfts helps grow the community 🚀',
          sender: 'agent'
        })
        
        if (nftId && nftName) {
          setTimeout(() => {
            addQuickActions(createNFTQuickActions.social(nftId, nftName))
          }, 1000)
        }
      } else {
        addMessage({
          type: 'text',
          content: 'i can help you buy, sell, or share nfts. what would you like to do? ✨',
          sender: 'agent'
        })
      }
    }, 1500)
  }

  const handleQuickAction = async (intent: IntentContent) => {
    // Add user intent message
    addMessage({
      type: 'intent',
      content: `Selected: ${intent.metadata?.actionLabel}`,
      sender: 'user',
      metadata: intent
    })

    // Process the intent
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      
      switch (intent.actionId) {
        case 'buy_eth':
          addMessage({
            type: 'text',
            content: 'perfect! initiating eth payment on base network. this will be fast and cheap! ⚡',
            sender: 'agent'
          })
          addNotification({
            type: 'success',
            title: 'payment initiated! 💎',
            message: 'processing eth transaction on base network'
          })
          break
          
        case 'buy_usdc':
          addMessage({
            type: 'text', 
            content: 'great choice! usdc payments are super stable. preparing the transaction... 💵',
            sender: 'agent'
          })
          break
          
        case 'make_offer':
          addMessage({
            type: 'text',
            content: 'smart move! what\'s your offer amount? the seller will be notified instantly 📝',
            sender: 'agent'
          })
          break
          
        case 'cast_share':
          addMessage({
            type: 'text',
            content: 'casting to your timeline now! your followers will love this nft 📱',
            sender: 'agent'
          })
          addNotification({
            type: 'success',
            title: 'shared on farcaster! 🎉',
            message: 'your nft post is now live on your timeline'
          })
          break
          
        case 'connect_wallet':
          addMessage({
            type: 'text',
            content: 'let\'s get you connected! click the connect button in the top right corner 🔗',
            sender: 'agent'
          })
          break
          
        default:
          addMessage({
            type: 'text',
            content: 'processing your request... one moment! ⏳',
            sender: 'agent'
          })
      }
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FiZap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">NFT Assistant</h3>
              <p className="text-xs text-blue-100">
                {isConnected ? 'Connected via XMTP' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              {message.type === 'actions' ? (
                <div className="flex justify-start">
                  <QuickActions
                    content={message.content as ActionsContent}
                    onActionSelect={handleQuickAction}
                  />
                </div>
              ) : (
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.sender === 'system'
                        ? 'bg-gray-100 text-gray-600 text-xs text-center'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'intent' && (
                      <div className="text-xs opacity-70 mb-1">Action selected:</div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content as string}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ 
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="ask about this nft..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Chat launcher button
export function ChatLauncher({ nftId, nftName }: { nftId?: string; nftName?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
      >
        <FiMessageSquare className="w-6 h-6" />
      </motion.button>

      <XMTPChat
        nftId={nftId}
        nftName={nftName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}