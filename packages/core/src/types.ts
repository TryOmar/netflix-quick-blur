export interface BlurSettings {
  enabled: boolean;
  blurAmount: number; // 0 - 80 px
  brightness: number; // 0 - 100 %
  shortcutKey: string; // 'b', 'Alt+B', etc.
  muteOnBlur: boolean;
  pauseOnBlur: boolean;
  hideSubtitlesOnBlur: boolean;
  autoBlurOnTabSwitch: boolean;
  showNativeButton: boolean;
}

export type PresetName = 'light' | 'standard' | 'blackout';

export interface PresetConfig {
  name: PresetName;
  label: string;
  description: string;
  settings: Partial<BlurSettings>;
}

export const DEFAULT_SETTINGS: BlurSettings = {
  enabled: true,
  blurAmount: 40,
  brightness: 35,
  shortcutKey: 'b',
  muteOnBlur: false,
  pauseOnBlur: false,
  hideSubtitlesOnBlur: true,
  autoBlurOnTabSwitch: false,
  showNativeButton: true,
};

export const PRESETS: Record<PresetName, PresetConfig> = {
  light: {
    name: 'light',
    label: 'Light Haze',
    description: 'Subtle privacy layer preserving colors and context',
    settings: {
      blurAmount: 16,
      brightness: 70,
      hideSubtitlesOnBlur: false,
      muteOnBlur: false,
      pauseOnBlur: false,
    },
  },
  standard: {
    name: 'standard',
    label: 'Standard Veil',
    description: 'Balanced visual shroud with subtitle concealment',
    settings: {
      blurAmount: 40,
      brightness: 35,
      hideSubtitlesOnBlur: true,
      muteOnBlur: false,
      pauseOnBlur: false,
    },
  },
  blackout: {
    name: 'blackout',
    label: 'Total Blackout',
    description: 'Maximum concealment with audio mute and playback pause',
    settings: {
      blurAmount: 64,
      brightness: 5,
      hideSubtitlesOnBlur: true,
      muteOnBlur: true,
      pauseOnBlur: true,
    },
  },
};
