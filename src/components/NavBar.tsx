"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({logo}: {logo: boolean | false}) {
    const pathname = usePathname() ?? '';

    return (
        <div className="absolute font-sans w-full flex justify-center m-auto px-16 py-12 z-40 text-base text-primary" data-project-area="true">
        <div className="flex justify-between min-w-56">
            <Link href="/" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span>home</span>
            </Link>

            <Link href="/works" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/works' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span>stuff</span>
            </Link>

            <Link href="/about" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/about' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span>me</span>
            </Link>

            <Link href="/contact" className={`flex px-3 items-center group transition-all duration-300 ${
              pathname === '/contact' ? 'text-primary' : 'text-secondary group-hover:text-primary'
            }`}>
                <span>talk</span>
            </Link>
        </div>
      </div>
    );
}