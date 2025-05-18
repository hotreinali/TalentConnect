import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"
import { FaRegUserCircle } from "react-icons/fa"
import { AuthContext } from '../Contexts/AuthContext'
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, authUser, setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const employerLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/applicants', label: 'Manage Applicants' },
    { path: '/post-job', label: 'Post Jobs' },
  ];

  const jobSeekerLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/job-search', label: 'Search For Jobs' },
    { path: '/application-progress', label: 'My Applications' },
  ];

  const userLinks = authUser?.role === 'Employer'
    ? employerLinks.slice(1)
    : jobSeekerLinks.slice(1);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
    navigate('/login');
  };

  const toggleNavMenu = () => setIsNavMenuOpen(prev => !prev);

  const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 px-6 py-4 shadow-md">
      <div className="flex items-center justify-between text-black">
        <div className="flex items-center gap-4">
          {/* Hamburger icon for small screens */}
          <button
            className="sm:hidden text-2xl cursor-pointer"
            onClick={toggleNavMenu}
          >
            <GiHamburgerMenu />
          </button>

          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-[50px]" />
          </Link>

          {/* Navigation links for medium+ screens */}
          {isLoggedIn && (
            <div className="hidden sm:flex gap-6">
              {userLinks.map(({ path, label }) => (
                <Link key={path} to={path} className="hover:bg-blue-200 p-2">
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Avatar and dropdown menu */}
        {isLoggedIn ? (
          <div className="relative">
            <button className="text-4xl cursor-pointer" onClick={toggleProfileMenu}>
              <FaRegUserCircle />
            </button>
            {isProfileMenuOpen && (
              <div className="z-20 absolute right-0 top-9 mt-1 w-40 bg-white shadow-lg rounded-md border">
                <div className="p-2 text-black">
                  <Link
                    to="/profile"
                    className="block p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block p-2 hover:bg-gray-200 cursor-pointer w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:block">
            <Link to="/login" className="p-2">LOGIN</Link>
          </div>
        )}
      </div>

      {/* Nav menu for small screens */}
      {isNavMenuOpen && isLoggedIn && (
        <div className="sm:hidden mt-4 flex flex-col text-black text-center">
          {userLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsNavMenuOpen(false)}
              className="hover:bg-blue-200 p-2"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block p-2 hover:bg-blue-200 cursor-pointer w-full"
          >
            Logout
          </button>
        </div>
      )}

      {/* Show Login for small screen if not logged in */}
      {!isLoggedIn && isNavMenuOpen && (
        <div className="sm:hidden mt-4 flex flex-col text-black text-center">
          <Link
            to="/login"
            className="block p-2 hover:bg-blue-200 cursor-pointer"
            onClick={() => setIsNavMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
