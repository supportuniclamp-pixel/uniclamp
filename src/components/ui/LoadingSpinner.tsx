"use client";
import React from 'react';

export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  fullScreen = false
}: {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-primary/20 border-t-primary border-r-primary animate-spin`}
          style={{ animationDuration: '0.85s' }}
        />
        {/* Inner reverse spinner with brand gold accent */}
        <div
          className={`absolute rounded-full border-2 border-transparent border-b-secondary border-l-secondary animate-spin ${
            size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'
          }`}
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        />
        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
      </div>
      {label && (
        <p className="text-xs uppercase tracking-wider font-semibold text-primary/80 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm transition-all duration-300">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex justify-center items-center w-full">{spinner}</div>;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-200 h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
