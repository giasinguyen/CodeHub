import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Github, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear general submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await login({ 
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe 
      });
      
      if (result.success) {
        // Save remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedUsername', formData.username.trim());
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedUsername');
        }
        
        // Navigate after successful login
        navigate(from, { replace: true });
      } else {
        // Handle specific error types and display them under appropriate fields
        const errorMessage = result.error?.toLowerCase() || '';
        
        if (errorMessage.includes('username') || errorMessage.includes('user not found') || errorMessage.includes('user does not exist')) {
          setErrors({
            username: 'Username does not exist'
          });
        } else if (errorMessage.includes('password') || errorMessage.includes('invalid credentials') || errorMessage.includes('incorrect password')) {
          setErrors({
            password: 'Incorrect password'
          });
        } else if (errorMessage.includes('account') && errorMessage.includes('locked')) {
          setErrors({
            submit: 'Account has been locked. Please contact administrator.'
          });
        } else if (errorMessage.includes('verification') || errorMessage.includes('verify') || errorMessage.includes('not verified')) {
          setErrors({
            submit: 'Account not verified. Please check your email to verify your account.'
          });        } else if (errorMessage.includes('credentials') || (errorMessage.includes('invalid') && (errorMessage.includes('login') || errorMessage.includes('auth')))) {
          // For general invalid credentials, show error under password field
          setErrors({
            password: 'Invalid username or password'
          });
        } else {
          setErrors({
            submit: result.error || 'Login failed. Please check your credentials and try again.'
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: 'An error occurred during login. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved credentials on component mount
  React.useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('savedUsername');
    
    if (rememberMe && savedUsername) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CodeHub</span>
          </Link>          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-slate-400">
            Sign in to your account to continue
          </p>
        </div>        {/* Login Form */}
        <div>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">{/* Username */}              <div>
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  icon={User}
                  error={errors.username}
                  disabled={isLoading}
                  autoFocus
                />
              </div>              {/* Password */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  disabled={isLoading}
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>              {/* Submit Error - Only show for general errors */}
              {errors.submit && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-400">
                        Login Failed
                      </h3>
                      <p className="text-sm text-red-300 mt-1">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6">              <Button
                variant="outline"
                size="lg"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  // TODO: Implement GitHub OAuth
                  console.log('GitHub login not implemented yet');
                }}
              >
                <Github className="w-5 h-5 mr-2" />
                Sign in with GitHub
              </Button>
            </div>

            {/* Sign up link */}            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div></Card>
        </div>

        {/* Demo Credentials */}        <div className="text-center">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Demo Credentials</h3>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Username: john_doe</p>
              <p>Password: password123</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Use these credentials to test the system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
