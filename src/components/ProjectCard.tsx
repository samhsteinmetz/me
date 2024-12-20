import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  para: string;
  title: string;
  baseColor: string; // e.g. "#3498db" or "purple"
}

const Card: React.FC<CardProps> = ({ para, title, baseColor }) => {
  // Example gradients and colors derived from the base color
  // You can adjust these as needed.
  const navigate = useNavigate();
  const cardBackground = {
    background: `linear-gradient(135deg, ${baseColor} 30%, #000 100%)`,
  };

  const shapeOneStyle = {
    background: `linear-gradient(135deg, ${baseColor} 0%, #000 90%)`,
  };

  const shapeTwoStyle = {
    background: `linear-gradient(135deg, ${baseColor}, ${baseColor}AA)`,
  };

  const shapeThreeStyle = {
    background: `linear-gradient(135deg, ${baseColor}, #ffffff33)`,
  };

  const shapeFourStyle = {
    background: `linear-gradient(135deg, ${baseColor}, transparent)`,
  };

  return (
    <div 
      className="w-56 h-32 duration-500 group overflow-hidden relative rounded text-neutral-50 p-4 flex flex-col justify-evenly"
      style={cardBackground}
    >
      {/* These shapes now use inline styles derived from the baseColor */}
      <div 
        className="absolute blur duration-500 group-hover:blur-none w-72 h-72 rounded-full group-hover:translate-x-12 group-hover:translate-y-12 right-1 -bottom-24"
        style={shapeOneStyle}
      />
      <div 
        className="absolute blur duration-500 group-hover:blur-none w-12 h-12 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 right-12 bottom-12"
        style={shapeTwoStyle}
      />
      <div 
        className="absolute blur duration-500 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 right-1 -top-12"
        style={shapeThreeStyle}
      />
      <div 
        className="absolute blur duration-500 group-hover:blur-none w-24 h-24 rounded-full group-hover:-translate-x-12"
        style={shapeFourStyle}
      />

      <div className="z-10 flex flex-col justify-evenly w-full h-full">
        <span className="text-2xl font-bold">{title}</span>
        <p>{para}</p>
        <button className="hover:bg-green-200 bg-neutral-300 rounded text-neutral-800 font-extrabold w-1/3 h-1/3 text-xs p" onClick={
            () => {
                navigate('/projects');
            }
        }>
          More
        </button>
      </div>
    </div>
  );
}

export default Card;
