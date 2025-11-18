"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({logo}: {logo: boolean}) {
    const pathname = usePathname() ?? '';

    return (
        <div className="absolute m-auto justify-between px-16 py-12 z-40 font-mono text-sm text-primary" data-project-area="true">
        <div className="flex">
            <Link href="/" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span>~</span>
                <span className={`${
                  pathname === '/' ? 'opacity-100' : 'opacity-0'
                } transition-all duration-300`}>/</span>
            </Link>

            <Link href="/works" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/works' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span className={`${
                  pathname === '/works' ? 'opacity-100' : 'opacity-0'
                } transition-all duration-300`}>/</span>
                <span>works</span>
            </Link>

            <Link href="/about" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/about' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span className={`${
                  pathname === '/about' ? 'opacity-100' : 'opacity-0'
                } transition-all duration-300`}>/</span>
                <span>about</span>
            </Link>

            <Link href="/contact" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/contact' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span className={`${
                  pathname === '/contact' ? 'opacity-100' : 'opacity-0'
                } transition-all duration-300`}>/</span>
                <span>contact</span>
            </Link>
        </div>
      </div>
    );
}