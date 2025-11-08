import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prevent wallet extension conflicts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent wallet provider conflicts
              if (typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  // Check for multiple Ethereum providers
                  if (window.ethereum && window.ethereum.providers) {
                    // Multiple providers detected - use the first one or MetaMask
                    const provider = window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum.providers[0];
                    window.ethereum = provider;
                  }
                });
                
                // Suppress certain console errors
                const originalError = console.error;
                console.error = (...args) => {
                  const message = args[0];
                  if (typeof message === 'string' && (
                    message.includes('MetaMask encountered an error setting the global Ethereum provider') ||
                    message.includes('Could not establish connection. Receiving end does not exist') ||
                    message.includes('TrustedScript') ||
                    message.includes('Function constructor')
                  )) {
                    return; // Suppress these specific errors
                  }
                  originalError.apply(console, args);
                };
              }
            `
          }}
        />
        
        {/* Meta tags for better SEO and security */}
        <meta name="description" content="Farcaster NFT Marketplace - Discover, collect, and sell extraordinary NFTs on Base" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Security headers as meta tags (fallback) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://mainnet.base.org" />
        <link rel="preconnect" href="https://gateway.pinata.cloud" />
        <link rel="preconnect" href="https://hub.pinata.cloud" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}