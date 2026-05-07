import React from 'react'
import { Send } from 'lucide-react';

const FloatingButton = ({ label = "Online Inquiry" }) => {
    return (
        <div className="w-full flex justify-center fixed bottom-4 sm:bottom-8 z-[100] pointer-events-none">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm text-white px-2 py-1 rounded-full pointer-events-auto shadow-2xl shadow-black/30">
                <a href="#contact" className="text-[10px] bg-white text-black px-4 py-2.5 rounded-full cursor-pointer">
                    {label}
                </a>
                <a href="#contact" aria-label={label}>
                    <Send size={20} className='w-9 h-9 bg-white rounded-full text-black p-2 cursor-pointer' />
                </a>
            </div>
        </div>
    );
};

export default FloatingButton;
