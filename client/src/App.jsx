import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
 import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import JobSearch from './pages/JobSearch'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/job-search' element={<JobSearch/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      <ToastContainer/>
    </div>
  )
}

export default App