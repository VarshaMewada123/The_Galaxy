import { useState, useEffect, } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname ==="/admin";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 70;
      setScrolled(isScrolled);
    };

    window.removeEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldShowSolid = scrolled || isAuthPage;

   const handleadmin = () => {
    console.log("heloo varsha")
    

    // simple navigate
     window.location.href = "https://the-galaxy-dashboard.vercel.app/"
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        shouldShowSolid ? "bg-white shadow-md py-4" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        
        <Link 
          to="/" 
          className="text-2xl font-serif tracking-wide cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <span
            className={`${shouldShowSolid ? "text-black" : "text-white"} transition-colors duration-300`}
          >
            The
          </span>
          <span className="text-[#C6A45C]">Galaxy</span>
        </Link>

        <ul
          className={`hidden md:flex gap-8 text-sm uppercase tracking-wider font-medium ${
            shouldShowSolid ? "text-gray-800" : "text-white"
          } transition-colors duration-300`}
        >
          <li className="hover:text-[#C6A45C] transition-colors">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-[#C6A45C] transition-colors">
            <Link to="/rooms">Rooms</Link>
          </li>
          <li className="hover:text-[#C6A45C] transition-colors">
            <Link to="/dining">Dining</Link>
          </li>
          <li className="hover:text-[#C6A45C] transition-colors">
            <Link to="/offers">Offers</Link>
          </li>
          <li className="hover:text-[#C6A45C] transition-colors">
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className={`text-sm font-medium ${shouldShowSolid ? "text-black" : "text-white"} hover:text-[#C6A45C] transition-colors`}
          >
            Login
          </Link>
          <button
            onClick={handleadmin}
            className={`px-5 py-2 rounded-sm text-sm font-bold tracking-wide transition-all duration-300 ${
              shouldShowSolid
                ? "bg-[#C6A45C] text-white hover:bg-black"
                : "bg-white text-black hover:bg-[#C6A45C] hover:text-white"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}
