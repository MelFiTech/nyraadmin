import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: React.ReactNode;
  type?: 'default' | 'wallet' | 'fees' | 'airtime' | 'usd';
  change?: number;
  className?: string;
}

export const StatsCard = ({ title, value, description, type = 'default', change, className = '' }: StatsCardProps) => {
  const isIncrease = change && change > 0;
  const isDecrease = change && change < 0;
  
  return (
    <div className={cn("card lg:p-6 p-3", {
      "bg-blue-50": type === 'wallet',
      "bg-green-50": type === 'fees', 
      "bg-orange-50": type === 'airtime',
      "bg-purple-50": type === 'usd'
    }, className)}>
      <h3 className="text-xs lg:text-sm font-medium text-gray-600">{title}</h3>
      <div className="flex items-center gap-2">
        <p className={cn("text-lg lg:text-xl font-bold mt-1 lg:mt-2", {
          "text-blue-600": type === 'wallet',
          "text-green-600": type === 'fees',
          "text-orange-600": type === 'airtime', 
          "text-purple-600": type === 'usd',
          "text-dark": type === 'default'
        })}>
          {value}
        </p>
        {change && (
          <div className={cn("flex items-center text-sm", {
            "text-green-600": isIncrease,
            "text-red-600": isDecrease
          })}>
            {isIncrease ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      {description && (
        <div className="mt-2">
          {description}
        </div>
      )}
    </div>
  );
};