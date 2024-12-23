'use client';

interface QuickActionCardProps {
    title: string;
    description: string;
    onClick: () => void;
    className?: string;
  }
  
  export const QuickActionCard = ({ title, description, onClick, className }: QuickActionCardProps) => {
    return (
      <button 
        onClick={onClick}
        className={`card lg:p-6 p-3 cursor-pointer hover:-translate-y-0.5 transition-transform w-full text-left ${className}`}
      >
        <h3 className="text-sm lg:text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs lg:text-sm text-dark/70 mt-0.5 lg:mt-1">{description}</p>
      </button>
    );
  };