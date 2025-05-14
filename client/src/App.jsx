import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import JobSearch from './pages/JobSearch'
import Profile from './pages/EmployeeProfile'
import Navbar from './components/Navbar'
import JobApplication from './pages/JobApplication'
import ApplicationProgress from './pages/ApplicationProgress'

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/job-search' element={<JobSearch/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/apply/:jobId' element={<JobApplication />} />
        <Route path='/application-progress' element={<ApplicationProgress />} />
      </Routes>
    </div>
  )
}

export default App