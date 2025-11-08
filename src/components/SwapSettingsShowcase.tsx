'use client'

import { useState } from 'react'
import { BaseSvg, OnchainkitSvg } from './svg'
import { motion } from 'framer-motion'

// Custom SwapSettings components implementation to match OnchainKit patterns
interface SwapSettingsProps {
  children: React.ReactNode
  icon?: React.ReactNode
  text?: string
  className?: string
}

interface SwapSettingsSlippageTitleProps {
  children: React.ReactNode
  className?: string
}

interface SwapSettingsSlippageDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface SwapSettingsSlippageInputProps {
  className?: string
}

const SwapSettings = ({ children, icon, text, className = '' }: SwapSettingsProps) => (
  <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 ${className}`}>
    {(icon || text) && (
      <div className="flex items-center gap-2">
        {icon}
        {text && <span className="text-sm font-medium text-gray-900 dark:text-white">{text}</span>}
      </div>
    )}
    {children}
  </div>
)

const SwapSettingsSlippageTitle = ({ children, className = '' }: SwapSettingsSlippageTitleProps) => (
  <h4 className={`text-sm font-medium text-gray-900 dark:text-white ${className}`}>
    {children}
  </h4>
)

const SwapSettingsSlippageDescription = ({ children, className = '' }: SwapSettingsSlippageDescriptionProps) => (
  <p className={`text-xs text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </p>
)

const SwapSettingsSlippageInput = ({ className = '' }: SwapSettingsSlippageInputProps) => {
  const [slippage, setSlippage] = useState('0.5')
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        {['0.1', '0.5', '1.0'].map((value) => (
          <button
            key={value}
            onClick={() => setSlippage(value)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              slippage === value
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {value}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.5"
          step="0.1"
          min="0.1"
          max="50"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">%</span>
      </div>
    </div>
  )
}

export function SwapSettingsShowcase() {
  const [selectedDemo, setSelectedDemo] = useState<'default' | 'styled' | 'withIcon' | 'withText' | 'custom'>('default')

  // Custom Base icon for demonstration
  const baseIcon = <BaseSvg className="w-5 h-5 text-blue-600" />

  const demoModes = [
    {
      id: 'default',
      title: 'Default Settings',
      description: 'Standard slippage configuration',
      color: 'blue'
    },
    {
      id: 'styled',
      title: 'Custom Styled',
      description: 'Override styles with className',
      color: 'orange'
    },
    {
      id: 'withIcon',
      title: 'With Icon',
      description: 'Custom icon override',
      color: 'purple'
    },
    {
      id: 'withText',
      title: 'With Text',
      description: 'Settings label text',
      color: 'green'
    },
    {
      id: 'custom',
      title: 'Custom Content',
      description: 'Override title and description',
      color: 'red'
    }
  ]

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700',
      orange: isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700',
      purple: isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700',
      green: isSelected ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700',
      red: isSelected ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
    }
    return colors[color as keyof typeof colors]
  }

  const renderSwapSettings = () => {
    switch (selectedDemo) {
      case 'default':
        return (
          <SwapSettings>
            <SwapSettingsSlippageTitle>
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription>
              Your swap will revert if the prices change by more than the selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput />
          </SwapSettings>
        )

      case 'styled':
        return (
          <SwapSettings>
            <SwapSettingsSlippageTitle className="text-[#EA580C] font-bold">
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription className="text-[#EA580C] italic">
              Your swap will revert if the prices change by more than the selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput />
          </SwapSettings>
        )

      case 'withIcon':
        return (
          <SwapSettings icon={baseIcon}>
            <SwapSettingsSlippageTitle>
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription>
              Your swap will revert if the prices change by more than the selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput />
          </SwapSettings>
        )

      case 'withText':
        return (
          <SwapSettings text="Settings">
            <SwapSettingsSlippageTitle>
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription>
              Your swap will revert if the prices change by more than the selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput />
          </SwapSettings>
        )

      case 'custom':
        return (
          <SwapSettings>
            <SwapSettingsSlippageTitle>
              Slippage Settings
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription>
              Set a max slippage you are willing to accept.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput />
          </SwapSettings>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <OnchainkitSvg className="w-8 h-8" />
          SwapSettings Components
          <BaseSvg className="w-8 h-8" />
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Customizable slippage configuration components for token swaps
        </p>
      </div>

      {/* Demo Mode Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedDemo(mode.id as any)}
              className={`p-4 rounded-xl border transition-all text-left ${getColorClasses(mode.color, selectedDemo === mode.id)}`}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{mode.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Demo */}
      <div className="flex justify-center mb-8">
        <motion.div
          key={selectedDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 w-full max-w-md"
        >
          {renderSwapSettings()}
        </motion.div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Implementation Examples</h3>
        
        <div className="space-y-6">
          {/* Default Example */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Default Configuration</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
{`<SwapSettings>
  <SwapSettingsSlippageTitle>
    Max. slippage
  </SwapSettingsSlippageTitle>
  <SwapSettingsSlippageDescription>
    Your swap will revert if the prices change by more than the selected percentage.
  </SwapSettingsSlippageDescription>
  <SwapSettingsSlippageInput />
</SwapSettings>`}
              </pre>
            </div>
          </div>

          {/* Styled Example */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Custom Styling</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
{`<SwapSettings>
  <SwapSettingsSlippageTitle className="text-[#EA580C]">
    Max. slippage
  </SwapSettingsSlippageTitle>
  <SwapSettingsSlippageDescription className="text-[#EA580C]">
    Your swap will revert if the prices change by more than the selected percentage.
  </SwapSettingsSlippageDescription>
  <SwapSettingsSlippageInput />
</SwapSettings>`}
              </pre>
            </div>
          </div>

          {/* Icon Example */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">With Custom Icon</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
{`<SwapSettings icon={baseIcon}>
  <SwapSettingsSlippageTitle>
    Max. slippage
  </SwapSettingsSlippageTitle>
  <SwapSettingsSlippageDescription>
    Your swap will revert if the prices change by more than the selected percentage.
  </SwapSettingsSlippageDescription>
  <SwapSettingsSlippageInput />
</SwapSettings>`}
              </pre>
            </div>
          </div>

          {/* Text Example */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">With Text Label</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm">
              <pre className="text-gray-800 dark:text-gray-200">
{`<SwapSettings text="Settings">
  <SwapSettingsSlippageTitle>
    Max. slippage
  </SwapSettingsSlippageTitle>
  <SwapSettingsSlippageDescription>
    Your swap will revert if the prices change by more than the selected percentage.
  </SwapSettingsSlippageDescription>
  <SwapSettingsSlippageInput />
</SwapSettings>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Component Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Components</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">SwapSettings</code> - Container component for swap slippage settings</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">SwapSettingsSlippageTitle</code> - Title for the slippage settings section</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">SwapSettingsSlippageDescription</code> - Description text explaining slippage</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">SwapSettingsSlippageInput</code> - Input field for slippage percentage</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• Customizable styling with className props</li>
              <li>• Custom icon support via icon prop</li>
              <li>• Text label configuration</li>
              <li>• Override title and description content</li>
              <li>• OnchainKit design system integration</li>
              <li>• Dark mode support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}