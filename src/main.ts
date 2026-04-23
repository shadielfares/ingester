import {Plugin, TFile, TAbstractFile} from 'obsidian';
import {DEFAULT_SETTINGS, IngesterSettings, IngesterSettingTab} from './settings';
import {ClippingService} from './clipping-service';

export default class IngesterPlugin extends Plugin {
	settings: IngesterSettings;
	clippingService: ClippingService;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new IngesterSettingTab(this.app, this));

		this.clippingService = new ClippingService(this.app);
		void this.clippingService.checkAvailability();

		this.registerEvent(
			this.app.vault.on('create', (file: TAbstractFile) => {
				if (!(file instanceof TFile)) return;
				if (!file.path.startsWith(this.settings.watchFolder)) return;
				if (!this.clippingService.available) return;
				if (!this.settings.autoIngest) return;

				void this.clippingService.handle(file);
			})
		);
	}

	async loadSettings() {
		const data = await this.loadData() as IngesterSettings | null;
		this.settings = { ...DEFAULT_SETTINGS, ...(data ?? {}) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
