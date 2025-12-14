
import { NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export async function POST() {
    try {
        const directory = path.join(process.cwd(), 'public', 'cnn', 'outputs');

        // Read all files in the directory
        const files = await readdir(directory);

        // Delete all files
        const deletePromises = files.map(file =>
            unlink(path.join(directory, file)).catch(err => {
                console.error(`Failed to delete ${file}:`, err);
            })
        );

        await Promise.all(deletePromises);

        return NextResponse.json({ success: true, count: files.length });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Cleanup failed' },
            { status: 500 }
        );
    }
}
