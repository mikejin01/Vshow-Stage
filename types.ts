export interface VibeConfig {
  primaryColor: string;
  secondaryColor: string;
  fogColor: string;
  strobeSpeed: number; // 0 to 10
  intensity: number; // 0 to 2
  description: string;
}

export interface CrowdMember {
  position: [number, number, number];
  height: number;
  offset: number; // For animation variety
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  hairStyle: number; // 0-3 for different hair styles
}