import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiWifi, 
  FiSettings, 
  FiCheck, 
  FiX, 
  FiAlertTriangle, 
  FiRefreshCw,
  FiExternalLink,
  FiCopy,
  FiInfo
} from 'react-icons/fi';
import { 
  FARCASTER_HUB_PROVIDERS, 
  getCurrentHubConfig, 
  testHubConnection, 
  validateHubConfig,
  getProviderComparison,
  getMigrationGuide,
  getRecommendedProvider,
  HubConfig
} from '@/lib/farcaster-hubs';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'react-hot-toast';

export const HubProviderManager: React.FC = () => {
  const { isLoggedIn, hasPermission } = useAdmin();
  const [currentConfig, setCurrentConfig] = useState<HubConfig | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showMigrationGuide, setShowMigrationGuide] = useState(false);

  useEffect(() => {
    try {
      const config = getCurrentHubConfig();
      setCurrentConfig(config);
      setSelectedProvider(config.provider);
    } catch (error) {
      toast.error('Failed to load hub configuration');
    }
  }, []);

  const testProvider = async (providerId: string) => {
    setTesting(providerId);
    
    try {
      const provider = FARCASTER_HUB_PROVIDERS[providerId];
      const config: HubConfig = {
        provider: providerId as keyof typeof FARCASTER_HUB_PROVIDERS,
        url: provider.url,
        // Use current API key if available
        apiKey: currentConfig?.apiKey
      };

      const result = await testHubConnection(config);
      setTestResults(prev => ({
        ...prev,
        [providerId]: result
      }));

      if (result.success) {
        toast.success(`${provider.name} connection successful! (${result.latency}ms)`);
      } else {
        toast.error(`${provider.name} connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(null);
    }
  };

  const copyConfiguration = (provider: any) => {
    const envConfig = `# Farcaster Hub Configuration
NEXT_PUBLIC_FARCASTER_HUB_URL=${provider.url}${provider.requiresAuth ? '\nNEXT_PUBLIC_FARCASTER_API_KEY=your_api_key_here' : ''}`;
    
    navigator.clipboard.writeText(envConfig);
    toast.success('Configuration copied to clipboard!');
  };

  if (!isLoggedIn || !hasPermission('canManageSettings')) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">Admin access required</p>
      </div>
    );
  }

  const providers = getProviderComparison();
  const validation = currentConfig ? validateHubConfig(currentConfig) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Farcaster Hub Providers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure and manage your Farcaster Hub connection
          </p>
        </div>
        <button
          onClick={() => setShowMigrationGuide(!showMigrationGuide)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FiInfo className="w-4 h-4" />
          <span>Migration Guide</span>
        </button>
      </div>

      {/* Current Configuration Status */}
      {currentConfig && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Configuration
            </h3>
            <button
              onClick={() => testProvider(currentConfig.provider)}
              disabled={testing === currentConfig.provider}
              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 flex items-center space-x-1"
            >
              {testing === currentConfig.provider ? (
                <FiRefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FiWifi className="w-4 h-4" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Provider:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {FARCASTER_HUB_PROVIDERS[currentConfig.provider]?.name || 'Unknown'}
                  </span>
                  {FARCASTER_HUB_PROVIDERS[currentConfig.provider]?.status === 'deprecated' && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs">
                      Deprecated
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">URL:</span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {currentConfig.url}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Auth:</span>
                  <span className={`text-sm ${currentConfig.apiKey ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {currentConfig.apiKey ? 'Configured' : 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              {/* Validation Status */}
              {validation && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {validation.valid ? (
                      <>
                        <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400">Configuration Valid</span>
                      </>
                    ) : (
                      <>
                        <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400">Configuration Issues</span>
                      </>
                    )}
                  </div>
                  {!validation.valid && (
                    <ul className="space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                          <FiAlertTriangle className="w-3 h-3" />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Test Results */}
              {testResults[currentConfig.provider] && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {testResults[currentConfig.provider].success ? (
                      <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="text-sm font-medium">
                      {testResults[currentConfig.provider].success ? 'Connected' : 'Connection Failed'}
                    </span>
                    {testResults[currentConfig.provider].latency && (
                      <span className="text-xs text-gray-500">
                        ({testResults[currentConfig.provider].latency}ms)
                      </span>
                    )}
                  </div>
                  {testResults[currentConfig.provider].error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {testResults[currentConfig.provider].error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Migration Guide */}
      {showMigrationGuide && currentConfig && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        >
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
            Migration Guide: {FARCASTER_HUB_PROVIDERS[currentConfig.provider]?.name} → Recommended Provider
          </h4>
          <div className="space-y-2">
            {getMigrationGuide(currentConfig.provider, getRecommendedProvider()).map((step, index) => (
              <div key={index} className="text-sm text-blue-800 dark:text-blue-300">
                {step}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Provider Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Hub Providers
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {provider.name}
                        </span>
                        {provider.id === currentConfig?.provider && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                            Current
                          </span>
                        )}
                        {provider.recommended.includes('⚠️') && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs">
                            {provider.recommended}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {provider.description}
                      </p>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
                        {provider.url}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {provider.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                          <FiCheck className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {provider.features.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{provider.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        provider.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        provider.status === 'deprecated' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {provider.status}
                      </span>
                      <div className="flex space-x-1">
                        {!provider.isPaid && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                            Free
                          </span>
                        )}
                        {provider.requiresAuth && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs">
                            Auth Required
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => testProvider(provider.id)}
                        disabled={testing === provider.id}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {testing === provider.id ? (
                          <FiRefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <FiWifi className="w-3 h-3" />
                        )}
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => copyConfiguration(provider)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-1"
                      >
                        <FiCopy className="w-3 h-3" />
                        <span>Copy Config</span>
                      </button>
                    </div>
                    {testResults[provider.id] && (
                      <div className={`mt-2 text-xs ${
                        testResults[provider.id].success 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {testResults[provider.id].success 
                          ? `✓ Connected (${testResults[provider.id].latency}ms)`
                          : `✗ ${testResults[provider.id].error}`
                        }
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          🎯 Recommendations
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">For Getting Started:</h5>
            <p className="text-gray-600 dark:text-gray-400">
              Use <strong>Pinata Hub</strong> for free, reliable access with no authentication required.
              Perfect for development and small-scale production.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">For Production Apps:</h5>
            <p className="text-gray-600 dark:text-gray-400">
              Consider <strong>Neynar Hub</strong> for advanced features, higher rate limits, 
              and professional support with rich API capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubProviderManager;