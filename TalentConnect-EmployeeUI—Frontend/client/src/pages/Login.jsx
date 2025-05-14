import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import login_img from "../../assets/login_bg.webp";
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../Contexts/AuthContext';
import { registerUser, loginUser } from '../api/authApi';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setAuthUser } = useContext(AuthContext);
  const [formPage, setFormPage] = useState('login');
  const [formData, setFormData] = useState({
    role: 'JobSeeker',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const registerFormValidation = () => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast.error('The passwords you entered do not match!');
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerFormValidation()) return;

    try {
      const data = await registerUser(formData);
      toast.success("Your account has been created!");
      localStorage.setItem("authToken", data.token);
      setFormData({ role: 'JobSeeker', name: '', email: '', password: '', confirmPassword: '' });
      setFormPage('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      const token = data.token;
      toast.success('Welcome back!');
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode(token);
      setAuthUser({
        email: decoded.sub,
        role: decoded.roles?.[0] || "Unknown"
      });
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }

    setFormData({ role: 'JobSeeker', email: '', password: '', confirmPassword: '' });
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="z-10 h-[80%] w-[90%] max-w-5xl flex shadow-lg rounded-lg">
        <div className="hidden md:flex w-1/2">
          <img src={login_img} alt="form background image" className="object-cover" />
        </div>
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-start gap-5 mt-6">
          <div className="flex text-sm gap-5 mt-8 mb-5">
            {formPage === 'register' && (
              <>
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
              </>
            )}
          </div>
          <h2 className="text-2xl">{formPage === 'login' ? 'Sign In' : 'Sign Up'}</h2>
          <AuthForm
            formPage={formPage}
            setFormPage={setFormPage}
            formData={formData}
            setFormData={setFormData}
            handleFormChange={handleFormChange}
            handleRegisterSubmit={handleRegisterSubmit}
            handleLoginSubmit={handleLoginSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
