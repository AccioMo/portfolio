
import { NextRequest, NextResponse } from 'next/server';
import { unlink, chmod, readdir, readFile, mkdir, rm } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import sharp from 'sharp';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
	let processedFilePath: string | null = null;
	let tempOutputsDir: string | null = null;

	try {
		const { image } = await request.json();

		if (!image) {
			return NextResponse.json({ error: 'No image provided' }, { status: 400 });
		}

		const base64Data = image.replace(/^data:image\/png;base64,/, '');
		const inputBuffer = Buffer.from(base64Data, 'base64');
		const timestamp = Date.now();
		const tempDir = os.tmpdir();
		processedFilePath = path.join(tempDir, `proc_${timestamp}.png`);
		tempOutputsDir = path.join(tempDir, `outputs_${timestamp}`);

		// Create temp outputs directory
		await mkdir(tempOutputsDir, { recursive: true });

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

		const cnnExecutable = path.join(process.cwd(), 'public', 'cnn', 'cnn');
		const dialsBinPath = path.join(process.cwd(), 'public', 'cnn', 'dials.bin');

		// Ensure the binary is executable on Linux (Vercel)
		if (process.platform !== 'win32') {
			try {
				await chmod(cnnExecutable, 0o755);
			} catch (e) {
				console.warn('Could not chmod binary:', e);
			}
		}

		const { stdout, stderr } = await execAsync(`"${cnnExecutable}" "${processedFilePath}" "${dialsBinPath}"`, {
			cwd: tempOutputsDir
		});

		// Read the processed input file to return it back to client
		const processedImageBuffer = await sharp(processedFilePath).toBuffer();
		const processedImageBase64 = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;

		// Read all activation maps from the outputs directory
		const activations: Record<string, string> = {};
		try {
			const files = await readdir(tempOutputsDir);
			for (const file of files) {
				if (file.endsWith('.png')) {
					const filePath = path.join(tempOutputsDir, file);
					const buffer = await readFile(filePath);
					activations[file] = `data:image/png;base64,${buffer.toString('base64')}`;
				}
			}
		} catch (e) {
			console.error('Error reading activations:', e);
		}

		return NextResponse.json({
			output: stdout || stderr,
			inputImage: processedImageBase64,
			activations: activations,
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
		// Cleanup
		if (processedFilePath) {
			await unlink(processedFilePath).catch(() => { });
		}
		if (tempOutputsDir) {
			await rm(tempOutputsDir, { recursive: true, force: true }).catch(() => { });
		}
	}
}
