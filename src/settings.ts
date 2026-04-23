import {App, normalizePath, PluginSettingTab, Setting} from "obsidian";
import IngesterPlugin from "./main";

export interface IngesterSettings {
	watchFolder: string;
	autoIngest: boolean;
}

export const DEFAULT_SETTINGS: IngesterSettings = {
	watchFolder: 'raw/clippings',
	autoIngest: true
}

export class IngesterSettingTab extends PluginSettingTab {
	plugin: IngesterPlugin;

	constructor(app: App, plugin: IngesterPlugin) {
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
					this.plugin.settings.watchFolder = normalizePath(value);
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
