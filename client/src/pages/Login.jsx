import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import login_img from '../assets/login_bg.webp'
import AuthForm from '../components/AuthForm'

const Login = () => {
  const navigate = useNavigate();
  const [isSignin, setIsSignin] = useState(false);
  const [formData, setFormData] = useState({ role: 'JobSeeker', name: '', email: '', password: '', confirmPassword: '' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }))
  }

  const formValidation = () => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast.error('The passwords you entered does not match!')
      return false;
    }
    return true;
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formValidation()) return;
    // clear form data
    setFormData({ role: '', name: '', email: '', password: '', confirmPassword: '' })
    toast.success("Your account has been created!")
    console.log(formData);
    // navigate to home page on success
    navigate('/')
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="z-10 h-[80%] w-[90%] max-w-5xl flex shadow-lg rounded-lg">
        {/* left */}
        <div className="hidden md:flex w-1/2">
          <img src={login_img} alt="form background image" className="object-cover" />
        </div>
        {/* right */}
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-start gap-5 mt-6">

          <div className="flex text-sm gap-5 mt-8 mb-5">
            <button
              onClick={() => handleRoleChange('JobSeeker')}
              className={`px-3 py-2 rounded-full cursor-pointer transition 
      ${formData.role === 'JobSeeker' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-black'} 
      hover:bg-blue-400 hover:text-white`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => handleRoleChange('Employer')}
              className={`px-3 py-2 rounded-full cursor-pointer transition 
      ${formData.role === 'Employer' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-black'} 
      hover:bg-blue-400 hover:text-white`}
            >
              Employer
            </button>
          </div>
          {isSignin ? (
            <h2 className="text-2xl">Sign In</h2>
          ) : (
            <h2 className="text-2xl">Sign Up</h2>
          )}
          <AuthForm
            isSignin={isSignin}
            setIsSignin={setIsSignin}
            formData={formData}
            handleFormChange={handleFormChange}
            handleSubmit={handleRegisterSubmit} />
        </div>
      </div>
    </section>
  )
}

export default Login