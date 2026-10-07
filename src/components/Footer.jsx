import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-200">EventHub Management System</span>
        </div>

        {/* Note */}
        <p className="text-slate-500 text-xs text-center">
          Comprehensive event registration & QR attendance verification platform.
        </p>

        {/* Copyright */}
        <div className="text-slate-500 text-xs flex items-center gap-1">
          <span>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
