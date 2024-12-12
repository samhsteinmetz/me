import { ReactNode } from 'react';
import NavBar from './NavBar';
import HackerBackground from '../shared/HackerBackground';
import { cn } from '../../utils/classes';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "flex flex-col",
      "bg-gradient-to-b from-background to-background/80",
      "overflow-hidden",
      "relative"
    )}>
      <HackerBackground color="#0F0" fontSize={14} speed={1} />
      <NavBar />

      <main className={cn(
        "flex-1 w-full",
        "flex flex-col items-center",
        "px-4 sm:px-6 lg:px-12",
        "pt-24 pb-12",
        "text-green-500",
        "relative z-10",
      )}>
        <div className={cn(
          "w-full max-w-5xl mx-auto",
          "backdrop-blur-sm", // Add backdrop blur
          "bg-stone-900/50" // Add semi-transparent background
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;