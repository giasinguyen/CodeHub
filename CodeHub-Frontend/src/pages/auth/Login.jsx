import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Eye, EyeOff, Github, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
    const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
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
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        // Navigate after successful login
        navigate(from, { replace: true });
      } else {
        setErrors({
          submit: result.error || 'Login failed. Please try again.'
        });
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CodeHub</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-slate-400">
            Sign in to your account to continue
          </p>
        </div>        {/* Login Form */}
        <div>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">{/* Username */}
              <div>
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
                />
              </div>

              {/* Password */}
              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={errors.password}
                  disabled={isLoading}
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-300">Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  // TODO: Implement GitHub OAuth
                  console.log('GitHub login not implemented yet');
                }}
              >
                <Github className="w-5 h-5 mr-2" />
                Sign in with GitHub
              </Button>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>          </Card>
        </div>

        {/* Demo Credentials */}
        <div className="text-center">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Demo Credentials</h3>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Username: john_doe</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
