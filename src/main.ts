import {Plugin, TFile, TAbstractFile, Notice} from 'obsidian';
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

				this.onNewClipping(file);
			})
		);
	}

	async checkClaudeAvailability(): Promise<void> {
		try {
			await execAsync('zsh -l -c "claude -v"');
			this.claudeAvailable = true;
		} catch {
			this.claudeAvailable = false;
			new Notice('Vaulty Ingest: Claude Code CLI not found');
		}
	}

	async onNewClipping(file: TFile) {
		const vaultPath = (this.app.vault.adapter as any).basePath;

		new Notice(`Ingesting: ${file.name}`);

		try {
			await execAsync(`zsh -l -c 'tmux new-window -n "ingest" -c "${vaultPath}"'`);
			await execAsync(`zsh -l -c 'tmux send-keys "claude \\"/ingest ${file.path}\\"" Enter'`);
		} catch (error) {
			new Notice(`Ingest failed: ${file.name}\n${(error as Error).message}`);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<VaultyIngestSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
