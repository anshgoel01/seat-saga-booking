
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

const Login = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col sm:flex-row">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 animate-fade-in">
          <div className="w-full max-w-md">
            <AuthForm type="login" />
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden sm:block sm:flex-1 bg-gradient-to-r from-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Cinema" 
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-sm text-center">
              <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
              <p className="text-lg text-gray-300 mb-8">
                Sign in to access your account, manage your bookings, and enjoy a seamless movie experience.
              </p>
              <div className="inline-flex items-center">
                <span className="text-gray-400 mr-2">Don't have an account yet?</span>
                <Link to="/register" className="text-white hover:underline font-medium">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
