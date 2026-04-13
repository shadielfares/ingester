import {Plugin, TFile, TAbstractFile, Notice, FileSystemAdapter} from 'obsidian';
import {exec} from 'child_process';
import {promisify} from 'util';
import {DEFAULT_SETTINGS, VaultyIngestSettings, VaultyIngestSettingTab} from "./settings";

const execAsync = promisify(exec);

export default class VaultyIngestPlugin extends Plugin {
	settings: VaultyIngestSettings;
	claudeAvailable: boolean = false;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new VaultyIngestSettingTab(this.app, this));

		await this.checkClaudeAvailability();

		this.registerEvent(
			this.app.vault.on('create', (file: TAbstractFile) => {
				if (!(file instanceof TFile)) return;
				if (!file.path.startsWith(this.settings.watchFolder)) return;
				if (!this.claudeAvailable) return;
				if (!this.settings.autoIngest) return;

				void this.onNewClipping(file);
			})
		);
	}

	async checkClaudeAvailability(): Promise<void> {
		try {
			await execAsync('zsh -l -c "claude -v"');
			this.claudeAvailable = true;
		} catch {
			this.claudeAvailable = false;
			new Notice('Could not find claude command');
		}
	}

	async onNewClipping(file: TFile) {
		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) return;
		const vaultPath = adapter.getBasePath();

		new Notice(`Ingesting: ${file.name}`);

		try {
			await execAsync(`zsh -l -c 'tmux new-window -n "ingest" -c "${vaultPath}"'`);
			await execAsync(`zsh -l -c 'tmux send-keys "claude \\"/ingest ${file.path}\\"" Enter'`);
		} catch (error) {
			new Notice(`Ingest failed: ${file.name}\n${(error as Error).message}`);
		}
	}

	async loadSettings() {
		const data = await this.loadData() as VaultyIngestSettings | null;
		this.settings = { ...DEFAULT_SETTINGS, ...(data ?? {}) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
