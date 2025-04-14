import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"
import { FaRegUserCircle } from "react-icons/fa"
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  // ************* temp user auth  *****************
  const [isAuth, setIsAuth] = useState(true)

  // navbar links
  const navbarLinks = [
    { path: '/job-search', label: 'Search For Jobs' },
    { path: '/about-us', label: 'About' },
  ]

  // user menu links
  const userLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
  ]

  // logout handler
  const handleLogout = () => {
    setIsAuth(false);
  }

  const toggleNavMenu = () => setIsNavMenuOpen(prev => !prev)

  const logoStyle = {
    height: '50px'
  };

  return (
    <nav className="px-6 py-4 bg-300">
      <div className="flex items-center justify-between text-black">
        <div className="flex items-center gap-4">
          {/* humbuger icon (small screens only)*/}
          <button
            className="sm:hidden text-2xl cursor-pointer"
            onClick={toggleNavMenu}
          >
            <GiHamburgerMenu />
          </button>

          {/* Logo */}
          <Link to="/">
            {/* <h1 className="text-3xl font-bold mr-3">TalentConnect</h1> */}
            <img src={logo} alt="Logo" style={logoStyle}/>
          </Link>

          {/* nav links for medium+ screens */}
          <div className="hidden sm:flex gap-6">
            {navbarLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="hover:bg-blue-200 p-1"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* if logged in, display menu on hover*/}
        {isAuth ? (
          <div className="relative group">
            {/* User avatar with dropdown */}
            <button className="text-4xl cursor-pointer">
              <FaRegUserCircle />
            </button>

            {/* dropdown menu */}
            <div className="absolute right-0 top-9 mt-1 w-48 bg-white shadow-lg rounded-md border invisible group-hover:visible">
              <div className="p-2 text-black">
                {userLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className="block p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="block p-2 hover:bg-gray-200 cursor-pointer w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:block">
            <Link to="/login" className="p-2">LOGIN</Link>
          </div>
        )}
      </div>

      {/* dropdown for small screens */}
      {isNavMenuOpen && (
        <div className="sm:hidden mt-4 flex flex-col text-white text-center">
          {navbarLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsNavMenuOpen(false)}
              className="hover:bg-blue-200 p-2"
            >
              {label}
            </Link>
          ))}
          {/* display login button if not logged in */}
          {!isAuth && (
            <Link
              to="/login"
              className="block p-2 hover:bg-blue-200 cursor-pointer w-full text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )

  
}

export default Navbar;
