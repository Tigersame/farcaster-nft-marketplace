import { FiTwitter, FiGithub, FiMessageCircle, FiMail, FiExternalLink } from 'react-icons/fi'
import { BRANDING } from '@/config/branding'

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
            {BRANDING.footer.copyright}. Built on <a href={BRANDING.links.base} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{BRANDING.footer.builtOn}</a> • Powered by <a href={BRANDING.links.tamber} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">{BRANDING.footer.poweredBy}</a> • Author: <a href={BRANDING.links.github} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">{BRANDING.footer.author}</a>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <a 
              href="https://www.base.org/privacy-policy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://www.base.org/terms-of-service" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="https://www.coinbase.com/legal/cookie" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}