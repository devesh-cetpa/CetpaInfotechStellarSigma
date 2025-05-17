import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
  count?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  iconBgColor = 'bg-gray-100',
  iconColor = 'text-gray-500',
  count,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className={`${iconBgColor} p-2.5 rounded-full mr-4`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {count !== undefined && (
        <div className="flex items-center">
          <span className="text-sm text-gray-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
            {count} {count === 1 ? 'app' : 'apps'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
