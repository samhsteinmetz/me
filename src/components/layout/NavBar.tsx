// src/components/layout/NavBar.tsx
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm text-green-500 shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-green-400">
            Sam Steinmetz
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-green-400 transition-colors">
              About
            </Link>
            <Link to="/projects" className="hover:text-green-400 transition-colors">
              Projects
            </Link>
            <Link to="/contact" className="hover:text-green-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar