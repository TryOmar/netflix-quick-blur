import React, { useState, useEffect } from 'react';
import {
  DEFAULT_SETTINGS,
  PRESETS,
  type BlurSettings,
  type PresetName,
  STORAGE_KEY_SETTINGS,
} from '@netflix-blur/core';
import { ChromeStorageAdapter } from '../../src/adapters/chromeStorage';

const storage = new ChromeStorageAdapter();

export default function App() {
  const [settings, setSettings] = useState<BlurSettings>(DEFAULT_SETTINGS);
  const [isNetflixActive, setIsNetflixActive] = useState<boolean>(false);
  const [isRecordingKey, setIsRecordingKey] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PresetName | null>('standard');

  useEffect(() => {
    storage.get<BlurSettings>(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS).then((saved) => {
      setSettings(saved);
      checkActivePreset(saved);
    });

    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || '';
        setIsNetflixActive(url.includes('netflix.com'));
      });
    }
  }, []);

  const checkActivePreset = (s: BlurSettings) => {
    for (const [name, config] of Object.entries(PRESETS) as [PresetName, typeof PRESETS.light][]) {
      const match = Object.entries(config.settings).every(
        ([key, val]) => (s as Record<string, unknown>)[key] === val
      );
      if (match) {
        setActivePreset(name);
        return;
      }
    }
    setActivePreset(null);
  };

  const updateSetting = <K extends keyof BlurSettings>(key: K, value: BlurSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    checkActivePreset(updated);
    storage.set(STORAGE_KEY_SETTINGS, updated);
  };

  const applyPreset = (presetName: PresetName) => {
    const preset = PRESETS[presetName];
    const updated = { ...settings, ...preset.settings };
    setSettings(updated);
    setActivePreset(presetName);
    storage.set(STORAGE_KEY_SETTINGS, updated);
  };

  useEffect(() => {
    if (!isRecordingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        return;
      }

      const parts: string[] = [];
      if (e.ctrlKey) parts.push('Ctrl');
      if (e.altKey) parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      if (e.metaKey) parts.push('Cmd');
      parts.push(e.key.toUpperCase());

      const shortcut = parts.join('+');
      updateSetting('shortcutKey', shortcut);
      setIsRecordingKey(false);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isRecordingKey]);

  return (
    <div className="w-[360px] min-h-[520px] bg-[#0c0c10] text-[#ededed] p-4 flex flex-col justify-between font-mono text-xs select-none">
      <div>
        {/* Header (100% Icon-Free) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs tracking-wider text-white bg-netflix-red px-1.5 py-0.5 rounded">
                NQB
              </span>
              <span className="font-bold text-xs tracking-tight text-white font-sans">
                QUICK BLUR
              </span>
              <span className="text-[10px] text-zinc-500">v1.0</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isNetflixActive ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
              <span className="text-[10px] text-zinc-400">
                {isNetflixActive ? 'TAB: NETFLIX SYNCED' : 'TAB: STANDBY'}
              </span>
            </div>
          </div>

          {/* Master Toggle */}
          <button
            type="button"
            onClick={() => updateSetting('enabled', !settings.enabled)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
              settings.enabled
                ? 'bg-netflix-red text-white border-red-500 shadow-md shadow-red-950/50'
                : 'bg-zinc-800 text-zinc-400 border-white/10'
            }`}
          >
            {settings.enabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {/* Presets Row (100% Icon-Free) */}
        <div className="mt-3">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1.5">
            TACTILE PRESETS
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['light', 'standard', 'blackout'] as PresetName[]).map((pName) => {
              const preset = PRESETS[pName];
              const isSelected = activePreset === pName;
              return (
                <button
                  key={pName}
                  type="button"
                  onClick={() => applyPreset(pName)}
                  className={`p-2 rounded text-left transition-all border ${
                    isSelected
                      ? 'bg-white/[0.08] border-netflix-red text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[10px] truncate">
                    {preset.label.toUpperCase()}
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">
                    {preset.settings.blurAmount}PX • {preset.settings.brightness}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-3 space-y-2.5 bg-white/[0.02] p-2.5 rounded border border-white/[0.06]">
          <div>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-zinc-400">BLUR STRENGTH</span>
              <span className="text-white font-bold bg-white/10 px-1 py-0.2 rounded">
                {settings.blurAmount}PX
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={settings.blurAmount}
              onChange={(e) => updateSetting('blurAmount', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-zinc-400">DIMMER BRIGHTNESS</span>
              <span className="text-white font-bold bg-white/10 px-1 py-0.2 rounded">
                {settings.brightness}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.brightness}
              onChange={(e) => updateSetting('brightness', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Behaviors */}
        <div className="mt-3 space-y-1.5 text-[11px]">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
            SHIELD BEHAVIORS
          </span>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-white/[0.04]">
            <span className="text-zinc-300">Conceal Subtitles</span>
            <input
              type="checkbox"
              checked={settings.hideSubtitlesOnBlur}
              onChange={(e) => updateSetting('hideSubtitlesOnBlur', e.target.checked)}
              className="accent-netflix-red w-3.5 h-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-white/[0.04]">
            <span className="text-zinc-300">Mute Audio</span>
            <input
              type="checkbox"
              checked={settings.muteOnBlur}
              onChange={(e) => updateSetting('muteOnBlur', e.target.checked)}
              className="accent-netflix-red w-3.5 h-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-white/[0.04]">
            <span className="text-zinc-300">Pause Playback</span>
            <input
              type="checkbox"
              checked={settings.pauseOnBlur}
              onChange={(e) => updateSetting('pauseOnBlur', e.target.checked)}
              className="accent-netflix-red w-3.5 h-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-white/[0.04]">
            <span className="text-zinc-300">Auto-Blur on Tab Switch</span>
            <input
              type="checkbox"
              checked={settings.autoBlurOnTabSwitch}
              onChange={(e) => updateSetting('autoBlurOnTabSwitch', e.target.checked)}
              className="accent-netflix-red w-3.5 h-3.5 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-white/[0.04]">
            <span className="text-zinc-300">Show Control Bar Button</span>
            <input
              type="checkbox"
              checked={settings.showNativeButton}
              onChange={(e) => updateSetting('showNativeButton', e.target.checked)}
              className="accent-netflix-red w-3.5 h-3.5 cursor-pointer"
            />
          </label>
        </div>

        {/* Shortcut Box */}
        <div className="mt-3 bg-white/[0.02] p-2 rounded border border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-zinc-300 font-bold block text-[10px]">HOTKEY TRIGGER</span>
            <span className="text-[9px] text-zinc-500">PLAYBACK SCOPE</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsRecordingKey(!isRecordingKey)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                isRecordingKey
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse'
                  : 'bg-white/10 text-white border-white/10'
              }`}
            >
              {isRecordingKey ? 'PRESS KEY...' : `KEY [${settings.shortcutKey.toUpperCase()}]`}
            </button>

            {settings.shortcutKey.toLowerCase() !== 'b' && (
              <button
                type="button"
                onClick={() => updateSetting('shortcutKey', 'b')}
                className="text-[10px] text-zinc-500 hover:text-white px-1"
                title="Reset to B"
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-zinc-500">
        <a
          href="https://tryomar.github.io/netflix-quick-blur/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-zinc-300 transition-colors"
        >
          DOCUMENTATION
        </a>
        <a
          href="https://discord.gg/placeholder"
          target="_blank"
          rel="noreferrer"
          className="hover:text-zinc-300 transition-colors"
        >
          DISCORD
        </a>
        <a
          href="https://github.com/TryOmar/netflix-quick-blur"
          target="_blank"
          rel="noreferrer"
          className="hover:text-zinc-300 transition-colors"
        >
          GITHUB [SRC]
        </a>
      </div>
    </div>
  );
}
