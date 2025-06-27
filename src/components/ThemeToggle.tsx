
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`relative transition-all duration-300 ${
        theme === 'dark' 
          ? 'text-white hover:text-galaxy-gold hover:bg-galaxy-purple/20' 
          : 'text-gray-900 hover:text-primary hover:bg-gray-100'
      }`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
      <span className="ml-2 hidden sm:inline">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </Button>
  );
};
