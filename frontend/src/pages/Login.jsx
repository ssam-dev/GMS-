import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "@/entities/User";
import { Dumbbell, Mail, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { isGoogleAuthEnabled, GOOGLE_AUTH_MODE } from "@/config/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gym.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Check if Google OAuth is configured
  const googleEnabled = isGoogleAuthEnabled();
  const isMockMode = GOOGLE_AUTH_MODE === 'mock';

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (User.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await User.login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsLoading(true);
    try {
      await User.loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to login with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  const handleMockGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      // Simulate Google user data
      const mockCredential = btoa(JSON.stringify({
        sub: "mock-google-id-123",
        email: "user@gmail.com",
        name: "Google User",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c"
      }));
      
      await User.loginWithGoogle(mockCredential);
      navigate("/");
    } catch (error) {
      console.error("Mock Google login error:", error);
      setError("Failed to login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">
              Gym Management System
            </CardTitle>
            <p className="text-slate-600 mt-2">Sign in to your account</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gym.com"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 text-slate-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Google Sign In - Only show if configured */}
              {googleEnabled && (
                <>
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <div className="flex justify-center">
                    {isMockMode ? (
                      <Button
                        type="button"
                        onClick={handleMockGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-12 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-900 font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <text x="0" y="20" fontSize="20" fill="currentColor">G</text>
                        </svg>
                        Continue with Google (Test Mode)
                      </Button>
                    ) : (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        width="100%"
                      />
                    )}
                  </div>
                </>
              )}

              <div className="text-center text-sm text-slate-600 mt-6">
                <p>Demo Credentials:</p>
                <p className="text-slate-500 mt-1">
                  Email: <span className="font-mono text-blue-600">admin@gym.com</span>
                </p>
                <p className="text-slate-500">
                  Password: <span className="font-mono text-blue-600">admin123</span>
                </p>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-xs font-medium">
                    🔒 Your login session will remain active permanently until you log out
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
