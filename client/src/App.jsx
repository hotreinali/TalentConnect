import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import JobSearch from './pages/JobSearch'
import Profile from './pages/Profile'
import Applicants from './pages/Applicants'
import PostJob from './pages/PostJob'
import Navbar from './components/Navbar'
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/Footer'

const App = () => {
  return (

    <>
      <div className="App">
        <Navbar />
        <main className="h-screen pt-10">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/job-search' element={<JobSearch />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/applicants' element={<Applicants />} />
            <Route path='/post-job' element={<PostJob />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Routes>
          <ToastContainer />
        </main>
      </div>
      <Footer />

    </>
  )
}

export default App