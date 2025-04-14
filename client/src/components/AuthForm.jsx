import React from 'react'
import { Link } from 'react-router-dom'

const AuthForm = ({ formData, handleFormChange, handleSubmit, isSignin, setIsSignin }) => {
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
      {!isSignin &&
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          required
          value={formData.confirmPassword}
          onChange={handleFormChange}
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400 text-black"
        />}
      <Link className="flex justify-end text-sm hover:underline hover:text-blue-400">{isSignin && 'Forgot Password?'}</Link>
      <button className="bg-black p-2 text-white rounded-lg cursor-pointer">{isSignin ? 'Sign In' : 'Sign Up'}</button>
      {isSignin ? (
        <p>
          Don't have an account?
          <button onClick={() => setIsSignin(false)} className="ml-2 hover:underline hover:text-blue-400">
            Sign Up
          </button>
        </p>
      ) : (
        <p>
          Already have an account?
          <button onClick={() => setIsSignin(true)} className="ml-2 hover:underline hover:text-blue-400">
            Sign In
          </button>
        </p>
      )}

    </form>
  )
}

export default AuthForm