'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialMode]);

  const toggleMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]  flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
            className="relative w-full max-w-[1050px] bg-[#FFFFFF] rounded-[40px]  shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden z-10 mx-4 flex flex-col min-h-[auto] max-h-[95vh]"
          >
            {/* Close Button (Left Side) */}
            <button 
              onClick={onClose}
              className="absolute top-10 left-10 p-3 rounded-full hover:bg-slate-50 transition-all text-slate-800 border border-transparent hover:border-slate-100 shadow-sm group z-30"
            >
              <ChevronLeft className="w-8 h-8 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="p-8 md:p-14 overflow-y-auto">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm 
                      onSwitch={() => toggleMode('signup')} 
                      onForgotPassword={() => toggleMode('forgot')}
                      isModal={true} 
                    />
                  </motion.div>
                ) : mode === 'signup' ? (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SignupForm onSwitch={() => toggleMode('login')} isModal={true} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ForgotPasswordForm 
                      onBack={() => toggleMode('login')} 
                      isModal={true} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
