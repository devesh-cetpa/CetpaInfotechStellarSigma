import React from 'react';

const AppHeading = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
      <div className="w-48 h-1 bg-blue-600 mb-2"></div>
      {description && <p className="mt-2 text-xl">{description}</p>}
    </div>
  );
};

export default AppHeading;
