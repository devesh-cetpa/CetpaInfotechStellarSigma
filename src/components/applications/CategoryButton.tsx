import React from 'react';

interface CategoryButtonProps {
  category: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  };
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isActive, onClick }) => {
  return (
    <button
      className={`px-5 py-2.5 rounded-full flex items-center space-x-2 whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
        isActive ? `${category.color} text-white shadow-md` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <span>{category.icon}</span>
      <span className="font-medium">{category.name}</span>
    </button>
  );
};

export default CategoryButton;
