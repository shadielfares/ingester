import {App, FileSystemAdapter, Notice, TFile} from 'obsidian';
import {execFile} from 'child_process';
import {promisify} from 'util';
import {checkProgramAvailability, shellQuote} from './utils';

const execFileAsync = promisify(execFile);

export class ClippingService {
	available = false;
	tmuxPath = '';

	constructor(private app: App) {}

	async checkAvailability(): Promise<void> {
		try {
			this.tmuxPath = await checkProgramAvailability('tmux');
			const claudePath = await checkProgramAvailability('claude');
			if (!this.tmuxPath || !claudePath) throw new Error('missing');
			this.available = true;
		} catch {
			this.available = false;
			new Notice('Could not find claude or tmux command');
		}
	}

	async handle(file: TFile): Promise<void> {
		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) return;
		const vaultPath = adapter.getBasePath();

		new Notice(`Ingesting: ${file.name}`);

		try {
			await execFileAsync(this.tmuxPath, ['new-window', '-n', 'ingest', '-c', vaultPath]);
			await execFileAsync(this.tmuxPath, ['send-keys', `claude ${shellQuote('/ingest ' + file.path)}`, 'Enter']);
		} catch (error) {
			new Notice(`Ingest failed: ${file.name}\n${(error as Error).message}`);
		}
	}
}
