import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ChevronRight, Briefcase } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  designation: string;
  image: string;
  bio: string;
}

interface LeaderCardProps {
  leader: Leader;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all duration-500 ${
        animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } hover:shadow-lg bg-white border-none h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative overflow-hidden">
          <div className="relative pt-[75%] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-700 opacity-20"></div>
            <img
              src={leader.image}
              alt={leader.name}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>

          {/* Hover overlay - simpler */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-700 transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-0'
            } flex flex-col justify-end p-4`}
          >
            <div
              className={`transform transition-transform duration-500 ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <Sparkles className="text-white mb-2" size={20} />
              <p className="text-white font-medium">View Profile</p>
            </div>
          </div>

          {/* Designation badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full shadow-md text-xs font-medium flex items-center">
            <Briefcase size={12} className="mr-1" />
            {leader.designation}
          </div>
        </div>

        {/* Card content - more compact */}
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{leader.name}</h3>
          <div
            className={`w-12 h-1 rounded-full mb-3 transition-all duration-300 ${
              isHovered ? 'bg-gradient-to-r from-blue-500 to-blue-600 w-16' : 'bg-blue-600'
            }`}
          ></div>
          <p className="text-gray-600 line-clamp-2 text-sm">{leader.bio.substring(0, 80)}...</p>

          {/* Simple view more link */}
          <div
            className={`mt-3 text-sm font-medium flex items-center ${isHovered ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <span>View Details</span>
            <ChevronRight
              size={14}
              className={`ml-1 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderCard;
