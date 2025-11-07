import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { LiveNFTManager } from './LiveNFTManager';
import { LiveNFTData } from '@/lib/alchemy';

interface LiveNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveNFTModal: React.FC<LiveNFTModalProps> = ({ isOpen, onClose }) => {
  const [selectedNFT, setSelectedNFT] = useState<LiveNFTData | null>(null);

  const handleNFTSelect = (nft: LiveNFTData) => {
    setSelectedNFT(nft);
    // Could integrate with marketplace here - add to mock data, feature in ads, etc.
    console.log('Selected NFT for integration:', nft);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Live NFT Data Manager</h2>
                <p className="text-blue-100 mt-1">
                  Powered by Alchemy API • Real-time Ethereum NFT data
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <LiveNFTManager onNFTSelect={handleNFTSelect} />
              
              {/* Integration Status */}
              {selectedNFT && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        NFT Ready for Integration
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {selectedNFT.title} from {selectedNFT.contract.name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                        Add to Marketplace
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                        <FiExternalLink className="w-4 h-4" />
                        <span>Feature in Ads</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveNFTModal;