"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({logo}: {logo: boolean}) {
    const pathname = usePathname() ?? '';

    return (
        <div className="absolute m-auto justify-between p-8 z-40 font-mono text-sm text-site-text/80" data-project-area="true">
        {/* <div>
          {logo && <span className="text-white">Logo</span>}
        </div> */}
        <div className="flex">
            <Link href="/" className={`flex px-3 items-center group transition-all duration-300 ${pathname === '/' ? 'opacity-100' : 'opacity-50'}`}>
                <span className={`${pathname === '/' ? 'opacity-100' : ' opacity-70'} cursor-none group-hover:opacity-80`}>~</span>
                <span className={`${pathname === '/' ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>/</span>
            </Link>

            <Link href="/works" className={`flex px-3 items-center group transition-all duration-300 ${pathname === '/works' ? 'opacity-100' : 'opacity-50'}`}>
                <span className={`${pathname === '/works' ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>/</span>
                <span className={`${pathname === '/works' ? 'opacity-100' : ' opacity-70'} cursor-none group-hover:opacity-80`}>works</span>
            </Link>

            <Link href="/about" className={`flex px-3 items-center group transition-all duration-300 ${pathname === '/about' ? 'opacity-100' : 'opacity-50'}`}>
                <span className={`${pathname === '/about' ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>/</span>
                <span className={`${pathname === '/about' ? 'opacity-100' : ' opacity-70'} cursor-none group-hover:opacity-80`}>about</span>
            </Link>

            <Link href="/contact" className={`flex px-3 items-center group transition-all duration-300 ${pathname === '/contact' ? 'opacity-100' : 'opacity-50'}`}>
                <span className={`${pathname === '/contact' ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>/</span>
                <span className={`${pathname === '/contact' ? 'opacity-100' : ' opacity-70'} cursor-none group-hover:opacity-80`}>contact</span>
            </Link>
        </div>
      </div>
    )
}