import { ReactNode } from "react";
import NavBar from "./NavBar";
import VitalsPanel from "../VitalsPanel";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:text-ink focus:px-3 focus:py-1 focus:border focus:border-rule focus:no-underline"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="pt-24 pb-24 md:pt-28 md:pb-32">
        {children}
      </main>
      <VitalsPanel />
    </div>
  );
};

export default Layout;
