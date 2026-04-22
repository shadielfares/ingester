import {execFile} from 'child_process';
import {promisify} from 'util';

const execFileAsync = promisify(execFile);

// POSIX single-quote safe-quote. Wraps s in '...' and rewrites each embedded ' as '\'' (4 chars:
// close-quote, backslash-escaped literal quote, open-quote).
//   a'b  ->  'a'\''b'
// Inside single quotes the shell performs no $, `, or \ expansion, so this neutralizes every
// metacharacter. Needed because file.path lands in a tmux send-keys payload that the pane's
// shell re-parses on Enter.
export function shellQuote(s: string): string {
	return `'${s.replace(/'/g, `'\\''`)}'`;
}

export async function checkProgramAvailability(program: string): Promise<string> {
	const {stdout} = await execFileAsync('zsh', ['-l', '-c', 'command -v "$1"', 'zsh', program]);
	return stdout.trim();
}
