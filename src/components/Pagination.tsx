'use client'

import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showItemsInfo?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 12,
  totalItems = 0,
  showItemsInfo = true
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = typeof window !== 'undefined' && window.innerWidth < 500 ? 5 : 7 // Fewer pages on mobile

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-4 sm:py-6 px-2 sm:px-4">
      {/* Items info - desktop */}
      {showItemsInfo && totalItems > 0 && (
        <div className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> items
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* First page button - hide on very small screens */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`hidden sm:flex p-2 rounded-lg border transition-colors min-h-[44px] min-w-[44px] items-center justify-center ${
            currentPage === 1
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="First page"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </motion.button>

        {/* Previous page button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === 1
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Previous page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 sm:px-3 py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] px-2 sm:px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {pageNum}
              </motion.button>
            )
          })}
        </div>

        {/* Next page button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === totalPages
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Next page"
        >
          <FiChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last page button - hide on very small screens */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`hidden sm:flex p-2 rounded-lg border transition-colors min-h-[44px] min-w-[44px] items-center justify-center ${
            currentPage === totalPages
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Last page"
        >
          <FiChevronsRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Items per page info (mobile) */}
      {showItemsInfo && totalItems > 0 && (
        <div className="sm:hidden text-xs text-gray-600 dark:text-gray-400">
          Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        </div>
      )}
    </div>
  )
}
