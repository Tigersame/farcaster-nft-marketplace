'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  change: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'pink'
  isLoading?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

export function StatsCard({ 
  icon, 
  label, 
  value, 
  change,
  color,
  isLoading = false,
  trend,
  onClick
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      shadow: 'shadow-blue-200/50'
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      shadow: 'shadow-green-200/50'
    },
    purple: {
      gradient: 'from-purple-500 to-violet-500',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      shadow: 'shadow-purple-200/50'
    },
    orange: {
      gradient: 'from-orange-500 to-red-500',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      shadow: 'shadow-orange-200/50'
    },
    indigo: {
      gradient: 'from-indigo-500 to-purple-500',
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      shadow: 'shadow-indigo-200/50'
    },
    pink: {
      gradient: 'from-pink-500 to-rose-500',
      text: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      shadow: 'shadow-pink-200/50'
    }
  }

  const colors = colorClasses[color]

  if (isLoading) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="text-right">
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              {trend && <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>}
            </div>
          </div>
          <div className="w-28 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-36 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M'
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K'
      }
      return val.toString()
    }
    return val
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300 group overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full blur-2xl`}></div>
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-full blur-xl`}></div>
      </div>

      <div className="relative z-10">
        {/* Header with Icon and Value */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg ${colors.shadow} group-hover:shadow-xl transition-all duration-300`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-7 h-7 text-white flex items-center justify-center">
              {icon}
            </div>
          </motion.div>
          
          <div className="text-right">
            <motion.div
              className={`text-3xl font-bold ${colors.text} mb-1`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {formatValue(value)}
            </motion.div>
            
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center justify-end space-x-1 text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-500'
                }`}
              >
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Label and Change */}
        <div className="space-y-2">
          <motion.h3 
            className="text-gray-900 dark:text-white font-bold text-lg leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.h3>
          <motion.p 
            className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {change}
          </motion.p>
        </div>

        {/* Progress Bar (Optional) */}
        {typeof value === 'number' && value <= 100 && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-2 bg-gradient-to-r ${colors.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-${color}-200 transition-all duration-300 pointer-events-none`}></div>
    </motion.div>
  )
}

// Mini Stats Card for smaller spaces
export function MiniStatsCard({
  icon: Icon,
  value,
  label,
  color = 'blue'
}: {
  icon: any
  value: string | number
  label: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500 text-blue-600',
    green: 'from-green-500 to-emerald-500 text-green-600',
    purple: 'from-purple-500 to-violet-500 text-purple-600',
    orange: 'from-orange-500 to-red-500 text-orange-600'
  }

  return (
    <motion.div
      className="bg-white/80 rounded-2xl p-4 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className={`text-xl font-bold ${colorClasses[color]}`}>
            {value}
          </div>
          <p className="text-gray-600 text-xs">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}