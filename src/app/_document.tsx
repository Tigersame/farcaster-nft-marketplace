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
        
        {/* Favicon - Multiple formats for compatibility */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.svg" />
        <link rel="mask-icon" href="/icon.svg" color="#0f1f3d" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0f1f3d" />
        <meta name="theme-color" content="#0f1f3d" />
        
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