import { Link } from 'react-router-dom';
import thisImage from './this.jpeg';

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm text-green-500 shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/me" className="flex items-center text-xl font-bold hover:text-green-400">
            Sam Steinmetz
            <div className='px-4'>
                <img
                src={thisImage}
                alt="Logo"
                className="w-8 h-8 mr-2"
                />
            </div>
          </Link>
          <div className="flex gap-6">
            <Link to="/me" className="text-[#858BF9] font-bold hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-[#858BF9] font-bold hover:text-green-400 transition-colors">
              About
            </Link>
            <Link to="/projects" className="text-[#858BF9] font-bold hover:text-green-400 transition-colors">
              Projects
            </Link>
            <Link to="/contact" className="text-[#858BF9] font-bold hover:text-green-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
