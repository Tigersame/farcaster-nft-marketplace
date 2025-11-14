'use client'

import React from 'react'

export function NFTCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="w-full bg-gray-800 skeleton" style={{ aspectRatio: '1 / 1.2' }} />
      
      {/* Footer Skeleton */}
      <div className="p-4 space-y-3">
        {/* Creator */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-700 skeleton" />
          <div className="h-3 w-20 bg-gray-700 rounded skeleton" />
        </div>
        
        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-700 rounded skeleton" />
        
        {/* Traits */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-700 rounded skeleton" />
          <div className="h-6 w-16 bg-gray-700 rounded skeleton" />
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-end">
          <div>
            <div className="h-3 w-12 bg-gray-700 rounded skeleton mb-2" />
            <div className="h-6 w-24 bg-gray-700 rounded skeleton" />
          </div>
          <div className="text-right">
            <div className="h-3 w-12 bg-gray-700 rounded skeleton mb-2" />
            <div className="h-4 w-16 bg-gray-700 rounded skeleton" />
          </div>
        </div>
        
        {/* Button */}
        <div className="h-12 w-full bg-gray-700 rounded-xl skeleton" />
      </div>
    </div>
  )
}

export function NFTGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NFTCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CollectionHeaderSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Avatar + Title */}
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-2xl bg-gray-700 skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 bg-gray-700 rounded skeleton" />
          <div className="h-4 w-40 bg-gray-700 rounded skeleton" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-700 rounded skeleton" />
            <div className="h-6 w-20 bg-gray-700 rounded skeleton" />
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 w-full bg-gray-700 rounded skeleton" />
            <div className="h-3 w-2/3 bg-gray-700 rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ModalSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Image */}
      <div className="w-full aspect-square rounded-2xl bg-gray-800 skeleton" />
      
      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 bg-gray-700 rounded skeleton" />
        <div className="h-4 w-1/2 bg-gray-700 rounded skeleton" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-700 rounded skeleton" />
        <div className="h-4 w-full bg-gray-700 rounded skeleton" />
        <div className="h-4 w-2/3 bg-gray-700 rounded skeleton" />
      </div>
      
      {/* Properties Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-lg p-3 space-y-2">
            <div className="h-3 w-16 bg-gray-700 rounded skeleton" />
            <div className="h-4 w-20 bg-gray-700 rounded skeleton" />
          </div>
        ))}
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3">
        <div className="flex-1 h-12 bg-gray-700 rounded-xl skeleton" />
        <div className="flex-1 h-12 bg-gray-700 rounded-xl skeleton" />
      </div>
    </div>
  )
}
