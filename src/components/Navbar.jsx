"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import NavItem from "./NavbarItem";
import Image from "next/image";
import tslhLogo from "@/assets/images/tslhlogo.png";

const SOURCE_PLATFORMS = [
    { label: "GitHub", href: "https://github.com/GeneralLibrary/GeneralUpdate" },
    { label: "Gitee", href: "https://gitee.com/GeneralLibrary/GeneralUpdate" },
    { label: "GitCode", href: "https://gitcode.com/GeneralLibrary/GeneralUpdate" },
];

const Navbar = ({ navLinks = [], currentLocale = "en", onLocaleChange = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    // Close source dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setSourceDropdownOpen(false);
            }
        };
        if (sourceDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sourceDropdownOpen]);

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
                    {/* Source Platform Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
                            className={`flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white backdrop-blur-md transition hover:bg-white/10 ${sourceDropdownOpen ? "bg-white/10" : ""}`}
                        >
                            <span className="text-[10px]">{currentLocale === "zh" ? "源码平台" : "Source"}</span>
                            <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform duration-200 ${sourceDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {sourceDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 min-w-[120px] overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/50">
                                {SOURCE_PLATFORMS.map((platform) => (
                                    <a
                                        key={platform.label}
                                        href={platform.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => setSourceDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-[10px] text-white/70 transition hover:bg-white/10 hover:text-white"
                                    >
                                        {platform.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
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
                        <div className="mt-8 flex flex-col gap-3">
                            {/* Mobile Source Platform Links */}
                            <div className="border-t border-white/10 pt-4">
                                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">{currentLocale === "zh" ? "源码平台" : "Source Platform"}</p>
                                <div className="flex flex-col gap-1">
                                    {SOURCE_PLATFORMS.map((platform) => (
                                        <a
                                            key={platform.label}
                                            href={platform.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm text-white/60 transition hover:text-white py-1"
                                        >
                                            {platform.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="flex rounded-full border border-white/15 p-1 text-xs text-white">
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
            </div>
        </>
    );
};

export default Navbar;
