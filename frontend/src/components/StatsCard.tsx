import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeText: string;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-500",
  yellow: "bg-yellow-50 text-yellow-500",
  green: "bg-green-50 text-green-500",
  purple: "bg-purple-50 text-purple-500",
};

const changeColorClasses = {
  blue: "text-blue-600",
  yellow: "text-yellow-600", 
  green: "text-green-600",
  purple: "text-purple-600",
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeText, 
  icon: Icon, 
  color 
}: StatsCardProps) {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-title`}>
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          {change && (
            <span className={`font-medium ${changeColorClasses[color]}`} data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-change`}>
              {change}
            </span>
          )}
          <span className={`text-gray-600 ${change ? 'ml-1' : ''}`} data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-change-text`}>
            {changeText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
