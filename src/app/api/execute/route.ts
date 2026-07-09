import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    let fileName = '';
    let runCommand = '';
    
    // Choose appropriate file name and run command
    switch (language) {
      case 'javascript':
        fileName = `script_${timestamp}.js`;
        runCommand = `node ${fileName}`;
        break;
      case 'typescript':
        fileName = `script_${timestamp}.ts`;
        runCommand = `npx -y tsx ${fileName}`; 
        break;
      case 'python':
        fileName = `script_${timestamp}.py`;
        runCommand = `python ${fileName}`;
        break;
      case 'java':
        fileName = `Main.java`; 
        runCommand = `javac ${fileName} && java Main`;
        break;
      case 'cpp':
        fileName = `script_${timestamp}.cpp`;
        const outName = os.platform() === 'win32' ? `script_${timestamp}.exe` : `script_${timestamp}.out`;
        const runOut = os.platform() === 'win32' ? `.\\${outName}` : `./${outName}`;
        runCommand = `g++ ${fileName} -o ${outName} && ${runOut}`;
        break;
      default:
        return NextResponse.json({ error: `Language ${language} not supported` }, { status: 400 });
    }

    let executionDir = tempDir;
    // For languages that generate multiple files or need strict names, use a dedicated folder
    if (language === 'java' || language === 'cpp' || language === 'typescript') {
      executionDir = await fs.mkdtemp(path.join(/*turbopackIgnore: true*/ tempDir, 'code-exec-'));
      await fs.writeFile(path.join(/*turbopackIgnore: true*/ executionDir, fileName), code);
    } else {
      await fs.writeFile(path.join(/*turbopackIgnore: true*/ executionDir, fileName), code);
    }

    try {
      const { stdout, stderr } = await execAsync(runCommand, { 
        cwd: executionDir,
        timeout: 15000, // 15 seconds timeout
      });
      
      return NextResponse.json({ stdout, stderr });
    } catch (execError: any) {
      return NextResponse.json({ 
        error: execError.message,
        stderr: execError.stderr,
        stdout: execError.stdout
      });
    } finally {
      // Cleanup
      try {
        if (language === 'java' || language === 'cpp' || language === 'typescript') {
          await fs.rm(executionDir, { recursive: true, force: true });
        } else {
          await fs.unlink(path.join(/*turbopackIgnore: true*/ executionDir, fileName));
        }
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file', cleanupError);
      }
    }
  } catch (error: any) {
    console.error('Execution API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
