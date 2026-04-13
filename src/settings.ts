import {App, PluginSettingTab, Setting} from "obsidian";
import VaultyIngestPlugin from "./main";

export interface VaultyIngestSettings {
	watchFolder: string;
	autoIngest: boolean;
}

export const DEFAULT_SETTINGS: VaultyIngestSettings = {
	watchFolder: 'raw/clippings',
	autoIngest: true
}

export class VaultyIngestSettingTab extends PluginSettingTab {
	plugin: VaultyIngestPlugin;

	constructor(app: App, plugin: VaultyIngestPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Watch folder')
			.setDesc('Folder to monitor for new clippings (relative to vault root)')
			.addText(text => text
				.setPlaceholder('Raw-clippings')
				.setValue(this.plugin.settings.watchFolder)
				.onChange(async (value) => {
					this.plugin.settings.watchFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Auto-ingest')
			.setDesc('Automatically run claude code /ingest when new files are detected')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoIngest)
				.onChange(async (value) => {
					this.plugin.settings.autoIngest = value;
					await this.plugin.saveSettings();
				}));
	}
}
