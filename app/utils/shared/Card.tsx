import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // optional className
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc] ${className}`}>
      {children}
    </div>
  );
};

export default Card;
