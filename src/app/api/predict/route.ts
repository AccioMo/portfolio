
import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import sharp from 'sharp';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
	let processedFilePath: string | null = null;

	try {
		const { image } = await request.json();

		if (!image) {
			return NextResponse.json({ error: 'No image provided' }, { status: 400 });
		}

		const base64Data = image.replace(/^data:image\/png;base64,/, '');
		const inputBuffer = Buffer.from(base64Data, 'base64');
		const timestamp = Date.now();
		processedFilePath = path.join(process.cwd(), 'public', 'cnn', `proc_${timestamp}.png`);

		// Image processing pipeline
		const trimmed = await sharp(inputBuffer)
			.flatten({ background: '#000000' })
			.trim({ threshold: 50 })
			.resize(18, 18, { fit: 'inside' })
			.toBuffer();

		await sharp({
			create: { width: 28, height: 28, channels: 3, background: '#000000' }
		})
			.composite([{ input: trimmed, gravity: 'center' }])
			.grayscale()
			.removeAlpha()
			.toFile(processedFilePath);

		const cnnExecutable = path.join(process.cwd(), 'public', 'cnn', 'cnn.exe');
		const dialsBinPath = path.join(process.cwd(), 'public', 'cnn', 'dials.bin');

		const { stdout, stderr } = await execAsync(`"${cnnExecutable}" "${processedFilePath}" "${dialsBinPath}"`, {
			cwd: path.join(process.cwd(), 'public', 'cnn')
		});

		// Read the processed file to return it back to client
		const processedImageBuffer = await sharp(processedFilePath).toBuffer();
		const processedImageBase64 = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;

		return NextResponse.json({
			output: stdout || stderr,
			inputImage: processedImageBase64,
			success: true
		});

	} catch (error) {
		console.error('Prediction error:', error);
		return NextResponse.json(
			{
				error: 'Processing failed',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	} finally {
		if (processedFilePath) {
			try {
				await unlink(processedFilePath).catch(() => { });
			} catch (e) {
				// Ignore cleanup errors
			}
		}
	}
}
