import React from 'react'

const CoinCardSkeleton = () => (
  <div className="linear-card p-3 animate-pulse">
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center space-x-2.5 flex-1">
        <div className="w-8 h-8 rounded-full skeleton" />
        <div className="flex-1">
          <div className="h-4 skeleton rounded w-24 mb-1" />
          <div className="h-3 skeleton rounded w-16" />
        </div>
      </div>
      <div className="w-4 h-4 skeleton rounded" />
    </div>
    <div className="flex items-end justify-between">
      <div className="flex-1">
        <div className="h-5 skeleton rounded w-20 mb-1" />
        <div className="h-3 skeleton rounded w-16" />
      </div>
      <div className="h-6 skeleton rounded w-16" />
    </div>
  </div>
)

export const GridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {[...Array(count)].map((_, i) => (
      <CoinCardSkeleton key={i} />
    ))}
  </div>
)

export default CoinCardSkeleton
