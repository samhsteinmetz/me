import React, { CSSProperties } from 'react';

interface GradientParagraphProps {
  text: string;
  baseColor: string;  // e.g. "#ff0000" or "purple"
  longTextThreshold?: number; // optional threshold to control animation
}

const GradientParagraph: React.FC<GradientParagraphProps> = ({
  text,
  baseColor,
  longTextThreshold = 50,
}) => {
  // If the text is longer than the threshold, we animate. Otherwise, it's static.
  const shouldAnimate = text.length > longTextThreshold;

  const paragraphStyle: CSSProperties = {
    display: 'inline-block',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: `linear-gradient(90deg, ${baseColor}, #fff, ${baseColor})`,
    backgroundSize: shouldAnimate ? '200% auto' : '100% auto',
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    // If we decide to animate only when text is long
    animation: shouldAnimate ? 'gradient-slide 3s linear infinite' : 'none',
    whiteSpace: 'pre-wrap', // allow line breaks if the text is long
  };

  return <p style={paragraphStyle}>{text}</p>;
};

export default GradientParagraph;
