import React from 'react';
import Link from 'next/link';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-primary p-4">
            <h1 className="text-8xl md:text-9xl font-light mb-4 opacity-20 select-none">404</h1>
            <div className="absolute flex flex-col items-center gap-6 z-10">
                <p className="text-xl md:text-2xl font-light tracking-wide text-center">
                    Page Not Found
                </p>
                <div className="w-16 h-px bg-secondary/50" />
                <Link
                    href="/"
                    className="px-6 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-background transition-all duration-300 rounded-full text-sm font-medium tracking-wider uppercase"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;