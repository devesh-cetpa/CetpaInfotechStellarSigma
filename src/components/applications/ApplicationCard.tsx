import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

interface ApplicationCardProps {
  app: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    route: string;
    description: string;
  };
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenApp: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, isFavorite, onToggleFavorite, onOpenApp }) => {
  return (
    <a
      href={app.route}
      onClick={(e) => {
        e.preventDefault();
        onOpenApp(app.id);
      }}
      className="group flex items-start p-4 rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
      >
        {app.icon}
      </div>
      <div className="ml-3 flex-1">
        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {app.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{app.description}</p>
        <div className="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-blue-500 font-medium">Open App</span>
          <ChevronRight className="h-3 w-3 text-blue-500 ml-1" />
        </div>
      </div>
      <button
        onClick={(e) => onToggleFavorite(app.id, e)}
        className="ml-2 p-1.5 rounded-md hover:bg-gray-100 flex-shrink-0 transition-all duration-200 hover:rotate-12"
      >
        <Star className={`h-5 w-5 text-amber-500 ${isFavorite ? 'fill-amber-500' : ''}`} />
      </button>
    </a>
  );
};

export default ApplicationCard;
