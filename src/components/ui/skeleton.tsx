import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'md' 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div 
      className={`${width} ${height} ${roundedClasses[rounded]} bg-gray-200 animate-pulse ${className}`}
    />
  );
};

export const QuestionSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4 animate-pulse">
    <div className="flex items-start space-x-3 mb-4">
      <Skeleton width="w-8" height="h-8" rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton height="h-4" />
        <Skeleton height="h-4" width="w-3/4" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton height="h-3" />
      <Skeleton height="h-3" width="w-5/6" />
      <Skeleton height="h-3" width="w-4/6" />
    </div>
  </div>
);

export const ConfigurationSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 animate-pulse">
    <Skeleton height="h-6" width="w-1/3" className="mb-4" />
    <div className="grid grid-cols-2 gap-4 mb-4">
      <Skeleton height="h-10" />
      <Skeleton height="h-10" />
    </div>
    <div className="space-y-3">
      <Skeleton height="h-4" />
      <Skeleton height="h-4" width="w-3/4" />
      <Skeleton height="h-4" width="w-1/2" />
    </div>
  </div>
);

export const SectionSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton height="h-6" width="w-1/4" />
      <Skeleton width="w-8" height="h-8" rounded="full" />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Skeleton height="h-12" />
      <Skeleton height="h-12" />
      <Skeleton height="h-12" />
    </div>
    <div className="space-y-3">
      <Skeleton height="h-4" />
      <Skeleton height="h-4" width="w-3/4" />
    </div>
  </div>
);

export const FileUploadSkeleton: React.FC = () => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center animate-pulse">
    <Skeleton width="w-16" height="h-16" rounded="full" className="mx-auto mb-4" />
    <Skeleton height="h-5" width="w-1/2" className="mx-auto mb-2" />
    <Skeleton height="h-4" width="w-3/4" className="mx-auto" />
  </div>
); 