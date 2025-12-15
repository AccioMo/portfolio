"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function NavBar({ logo }: { logo: boolean | false }) {
    const pathname = usePathname() ?? '';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute font-sans w-full justify-center m-auto px-8 lg:px-16 py-8 lg:py-12 z-40 text-sm lg:text-base text-primary">
                <div className="flex justify-between min-w-56 gap-4 lg:gap-6">
                    <Link href="/" className={`flex items-center group transition-all duration-300 ${pathname === '/' ? 'text-primary' : 'text-secondary group-hover:text-primary'
                        }`}>
                        <span>home</span>
                    </Link>

                    <Link href="/works" className={`flex items-center group transition-all duration-300 ${pathname === '/works' ? 'text-primary' : 'text-secondary group-hover:text-primary'
                        }`}>
                        <span>stuff</span>
                    </Link>

                    <Link href="/about" className={`flex items-center group transition-all duration-300 ${pathname === '/about' ? 'text-primary' : 'text-secondary group-hover:text-primary'
                        }`}>
                        <span>me</span>
                    </Link>

                    <Link href="/contact" className={`flex items-center group transition-all duration-300 ${pathname === '/contact' ? 'text-primary' : 'text-secondary group-hover:text-primary'
                        }`}>
                        <span>talk</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation - Sliding Animation */}
            <div className="md:hidden absolute top-6 right-0 z-40 font-sans">
                <div className={`flex items-center gap-4 pr-6 transition-transform duration-400 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'
                    }`}>
                    {/* Triangle Toggle Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`text-primary hover:text-secondary transition-all flex-shrink-0 ${isMenuOpen ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
                            }`}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>

                    {/* Navigation Items - Appear with container */}
                    <nav className="flex items-center gap-4 text-base whitespace-nowrap">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-3 py-2 rounded transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                                } ${pathname === '/' ? 'text-primary' : 'text-secondary hover:text-primary'
                                }`}
                        >
                            home
                        </Link>
                        <Link
                            href="/works"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-3 py-2 rounded transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                                } ${pathname === '/works' ? 'text-primary' : 'text-secondary hover:text-primary'
                                }`}
                        >
                            stuff
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-3 py-2 rounded transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                                } ${pathname === '/about' ? 'text-primary' : 'text-secondary hover:text-primary'
                                }`}
                        >
                            me
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-3 py-2 rounded transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                                } ${pathname === '/contact' ? 'text-primary' : 'text-secondary hover:text-primary'
                                }`}
                        >
                            talk
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}