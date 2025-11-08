'use client';

import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBaseName, 
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';

interface WalletWrapperProps {
  text?: string;
  withWalletAggregator?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function WalletWrapper({
  text = 'Connect Wallet',
  withWalletAggregator = false,
  className = '',
  children,
}: WalletWrapperProps) {
  const { address } = useAccount();
  
  return (
    <div className={`flex justify-end ${className}`}>
      <Wallet>
        <ConnectWallet 
          withWalletAggregator={withWalletAggregator}
          text={text}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          <Avatar className="h-6 w-6" address={address} />
          <Name />
        </ConnectWallet>
        
        <WalletDropdown className="min-w-[300px]">
          <Identity 
            className="px-4 pt-3 pb-2" 
            hasCopyAddressOnClick
          >
            <Avatar address={address} />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          
          <WalletDropdownBaseName />
          
          <WalletDropdownLink
            href="/marketplace"
            rel="noopener noreferrer"
          >
            🎨 NFT Marketplace
          </WalletDropdownLink>
          
          <WalletDropdownLink
            href="/create"
            rel="noopener noreferrer"
          >
            🖼️ Create NFT
          </WalletDropdownLink>
          
          <WalletDropdownLink 
            href="https://wallet.coinbase.com/funding"
            rel="noopener noreferrer"
          >
            💳 Fund Wallet
          </WalletDropdownLink>
          
          <WalletDropdownDisconnect />
        </WalletDropdown>
        
        {children}
      </Wallet>
    </div>
  );
}