
import { NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST() {
    try {
        const directory = path.join(process.cwd(), 'public', 'cnn', 'outputs');

        // Check if directory exists and is writable
        // On Vercel, this will likely fail or find no files to delete
        try {
            const files = await readdir(directory);
            const deletePromises = files.map(file =>
                unlink(path.join(directory, file)).catch(() => { })
            );
            await Promise.all(deletePromises);
            return NextResponse.json({ success: true, count: files.length });
        } catch (e) {
            // If directory doesn't exist or isn't readable, just return success
            return NextResponse.json({ success: true, count: 0 });
        }
    } catch (error) {
        return NextResponse.json({ success: true, info: 'Cleanup skipped or handled elsewhere' });
    }
}
