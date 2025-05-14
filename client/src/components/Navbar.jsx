import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"
import { FaRegUserCircle } from "react-icons/fa"
import { AuthContext } from '../Contexts/AuthContext'
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isLoggedIn,setIsLoggedIn,authUser,setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // navbar links
  const navbarLinks = [
    { path: '/about-us', label: 'About' },
  ]

  // user menu links
  const jobSeekerLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/job-search', label: 'Search For Jobs' },
    { path: '/application-progress', label: 'My Applications' },
  ]

  const employerLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/applicants', label: 'Manage Applicants' },
  ]

  // const logoStyle = {
  //   height: '50px'
  // };

  // logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
    // redirect to login
    navigate('/login')
  }

  const toggleNavMenu = () => setIsNavMenuOpen(prev => !prev)

  return (
    <nav className="px-6 py-4">
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
            <img src={logo} alt="Logo" className="h-[50px]"/>
          </Link>

          {/* nav links for medium+ screens */}
          <div className="hidden sm:flex gap-6">
            {navbarLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="hover:bg-blue-200 p-2"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* if logged in, display menu on hover*/}
        { isLoggedIn? (
          <div className="relative group">
            {/* User avatar with dropdown */}
            <button className="text-4xl cursor-pointer">
              <FaRegUserCircle />
            </button>

            {/* dropdown menu */}
            <div className="z-20 absolute right-0 top-9 mt-1 w-48 bg-white shadow-lg rounded-md border invisible group-hover:visible">
              <div className="p-2 text-black">
                {(authUser?.role === 'Employer' ? employerLinks:jobSeekerLinks).map(({ path, label }) => (
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
        <div className="sm:hidden mt-4 flex flex-col text-black text-center">
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
          {!isLoggedIn && (
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
