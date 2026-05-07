"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavItem from "./NavbarItem";
import Image from "next/image";
import tslhLogo from "@/assets/images/tslhlogo.png";

const Navbar = ({ navLinks = [], currentLocale = "en", onLocaleChange = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 lg:px-16 py-7 text-[10px] z-[100] pointer-events-none">
                {/* Desktop Left - Hidden below LG */}
                <div className="hidden lg:flex items-center gap-5 tracking-tight pointer-events-auto">
                    <a href="#" aria-label="TSLH AI" className="flex h-12 w-12 items-center justify-center bg-white/10 p-1.5 backdrop-blur-md">
                        <Image src={tslhLogo} alt="TSLH AI" width={36} height={36} className="h-full w-full object-contain" priority />
                    </a>
                    <div className="flex items-center gap-2 xl:gap-4">
                        {navLinks.map((link) => (
                            <NavItem key={link[0]} text={link[0]} href={link[1]} />
                        ))}
                    </div>
                </div>

                {/* Empty space in middle for the animated logo to land */}
                <div className="w-[150px] hidden lg:block" />

                {/* Desktop Right - Hidden below LG */}
                <div className="hidden lg:flex items-center gap-2 tracking-tight pointer-events-auto">
                    <div className="flex rounded-full border border-white/15 bg-black/20 p-1 text-white backdrop-blur-md">
                        {["en", "zh"].map((locale) => (
                            <button
                                key={locale}
                                type="button"
                                onClick={() => onLocaleChange(locale)}
                                className={`rounded-full px-3 py-1 uppercase transition ${currentLocale === locale ? "bg-white text-black" : "text-white/65 hover:text-white"}`}
                            >
                                {locale === "en" ? "EN" : "中文"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Icon - Only visible below LG at the right corner */}
                <div className="lg:hidden flex w-full items-center justify-between pointer-events-auto">
                    <a href="#" aria-label="TSLH AI" className="flex h-12 w-12 items-center justify-center bg-white/10 p-1.5 backdrop-blur-md">
                        <Image src={tslhLogo} alt="TSLH AI" width={36} height={36} className="h-full w-full object-contain" priority />
                    </a>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-white p-2 hover:bg-white/10 rounded-sm transition-all duration-300 cursor-pointer"
                    >
                        <Menu size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[300] transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto backdrop-blur-sm" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            >
                {/* Black Overlay Tint */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Sidebar Content */}
                <div
                    className={`absolute right-0 top-0 h-screen w-3/4 sm:w-1/2 bg-[#0a0a0a] transition-transform duration-500 ease-in-out flex flex-col px-6 pt-8 pb-10 ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sidebar Header: Logo & Close Icon */}
                    <div className="flex items-center justify-between mb-20">
                        <Image
                            src={tslhLogo}
                            alt="TSLH AI"
                            width={44}
                            height={44}
                            className="h-11 w-11 object-contain"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white p-2 hover:bg-white/10 transition-all duration-300 rounded-sm cursor-pointer mt-4"
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Sidebar Menu Items */}
                    <div className="flex flex-col gap-4 items-start">
                        {navLinks.map(([text, href]) => ({ text, href })).map((link) => (
                            <div key={link.text} className="text-base" onClick={() => setIsOpen(false)}>
                                <NavItem text={link.text} href={link.href} />
                            </div>
                        ))}
                        <div className="mt-8 flex rounded-full border border-white/15 p-1 text-xs text-white">
                            {["en", "zh"].map((locale) => (
                                <button
                                    key={locale}
                                    type="button"
                                    onClick={() => {
                                        onLocaleChange(locale);
                                        setIsOpen(false);
                                    }}
                                    className={`rounded-full px-4 py-2 uppercase ${currentLocale === locale ? "bg-white text-black" : "text-white/60"}`}
                                >
                                    {locale === "en" ? "EN" : "中文"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
