import React from 'react';

interface SkeletonBoxProps {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
  );
};

export default SkeletonBox;