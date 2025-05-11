import React from 'react'
import { Link } from 'react-router-dom'

const AuthForm = ({ formData, setFormData, handleFormChange, handleRegisterSubmit, handleLoginSubmit, formPage, setFormPage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formPage === 'login') {
      handleLoginSubmit(e);
    } else {
      handleRegisterSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-[70%]">
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        value={formData.email}
        onChange={handleFormChange}
        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400 text-black"
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        required
        value={formData.password}
        onChange={handleFormChange}
        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400 text-black"
      />
      {formPage === 'register' &&
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          required
          value={formData.confirmPassword}
          onChange={handleFormChange}
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400 text-black"
        />}
      <Link className="flex justify-end text-sm hover:underline hover:text-blue-400">{formPage === 'register' && 'Forgot Password?'}</Link>
      <button className="bg-black p-2 text-white rounded-lg cursor-pointer">{formPage === 'login' ? 'Sign In' : 'Sign Up'}</button>
      {formPage === 'login' ? (
        <p>
          Don't have an account?
          <button
            type="button"
            onClick={() => {
              setFormPage('register');
              setFormData({role: 'JobSeeker', name: '', email: '', password: '', confirmPassword: '' });
            }}
            className="ml-2 hover:underline hover:text-blue-400">
            Sign Up
          </button>
        </p>
      ) : (
        <p>
          Already have an account?
          <button
            type="button"
            onClick={() => {
              setFormPage('login');
              setFormData({role: '', name: '', email: '', password: '', confirmPassword: '' });
            }}
            className="ml-2 hover:underline hover:text-blue-400">
            Sign In
          </button>
        </p>
      )}

    </form>
  )
}

export default AuthForm