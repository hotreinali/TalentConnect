import React from 'react'
<<<<<<< Updated upstream

const App = () => {
  return (
    <div>App</div>
=======
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import JobSearch from './pages/JobSearch'
import EmployerProfile from './pages/EmployerProfile'
import EmployeeProfile from './pages/EmployeeProfile'
import JobApplication from './pages/JobApplication'
import ApplicationProgress from './pages/ApplicationProgress'
import Applicants from './pages/Applicants'
import PostJob from './pages/PostJob'
import Navbar from './components/Navbar'
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/Footer'

const App = () => {
  return (

    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="pt-10 flex-glow">
          <Routes>
            <Route path='/' element={<JobSearch />} />
            <Route path='/login' element={<Login />} />
            <Route path='/job-search' element={<JobSearch />} />
            <Route path='/employer-profile' element={<EmployerProfile />} />
            <Route path='/applicants' element={<Applicants />} />
            <Route path='/post-job' element={<PostJob />} />
            <Route path='/apply/:jobId' element={<JobApplication />} />
             <Route path='/application-progress' element={<ApplicationProgress />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/employee-profile' element={<EmployeeProfile/>}/>
          </Routes>
          <ToastContainer />
        </main>
      </div>
      <Footer />

    </>
>>>>>>> Stashed changes
  )
}

export default App