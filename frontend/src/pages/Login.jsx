import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "@/entities/User";
import { Dumbbell, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { isGoogleAuthEnabled, GOOGLE_AUTH_MODE } from "@/config/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gymsystem.com");
  const [password, setPassword] = useState("12345");
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
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[360px]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center mb-6">
            <Dumbbell className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight leading-tight">
            Gym Management<br/>System
          </h1>
          <p className="text-slate-400 text-[15px] mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-300 text-sm font-normal">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gymsystem.com"
              className="h-12 bg-[#121A2F] border-slate-800 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 text-sm font-normal">
                Password
              </Label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-500 text-xs hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="........"
                className="h-12 pl-10 bg-[#121A2F] border-slate-800 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full border-2 border-slate-500"></div> {/* Eye icon placeholder */}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-none transition-all flex items-center justify-center gap-2 mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="relative my-6 flex items-center py-2">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">OR</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {isMockMode && (
            <Button
              type="button"
              onClick={handleMockGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-[#121A2F] border border-slate-800 hover:bg-[#1A233A] text-white font-medium transition-all flex items-center justify-center gap-3 relative"
              variant="outline"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 absolute left-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          )}

          {!isMockMode && googleEnabled && (
            <div className="w-full h-12 flex items-center justify-center bg-[#121A2F] border border-slate-800 rounded-md px-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                theme="outline"
                size="large"
                width="280"
              />
            </div>
          )}

          {/* Just hide standard google button to use our custom styled one via mock for visual match */}
          
          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-4 justify-center text-blue-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Demo Credentials</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <div>
                <span className="uppercase text-[10px] tracking-wider text-slate-600 block mb-1">Manager Access</span>
                <span className="text-white">admin@gymsystem.com / 12345</span>
              </div>
              <div className="text-right">
                <span className="uppercase text-[10px] tracking-wider text-slate-600 block mb-1">Trainer Access</span>
                <span className="text-white">trainer@gym.com / 12345</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-6">
              By signing in, you agree to our <a href="/terms-of-service" className="text-blue-500 hover:underline">Terms of Service</a>. For security, we monitor active sessions and IP addresses.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
