
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl aspect-[16/9] mb-8">
                <Image
                    src="/404.jpg"
                    fill
                    alt="404 Not Found"
                    className="object-contain"
                    priority
                />
            </div>
            <Link href="/" className="font-sans text-[var(--secondary)] hover:text-[var(--primary)] text-sm uppercase tracking-widest transition-colors z-10">
                Return Home
            </Link>
        </div>
    );
}
