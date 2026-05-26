export type Gender = 'female' | 'male' | 'trans';
export type Style = 'realistic' | 'anime';

export interface FunnelCState {
  style: Style;
  gender: Gender;
  ethnicity: string;
  bodyType: string;
  name: string;
}

export interface FunnelDState {
  style: Style;
  gender: Gender;
  ethnicity: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  bodyType: string;
  breastSize: string;
  buttSize: string;
  name: string;
  age: number;
  voice: string;
  personality: string;
  occupation: string;
  relationship: string;
  hobby: string;
  fetish: string;
}

export const DEFAULT_FUNNEL_C: FunnelCState = {
  style: 'realistic',
  gender: 'female',
  ethnicity: '',
  bodyType: '',
  name: '',
};

export const DEFAULT_FUNNEL_D: FunnelDState = {
  style: 'realistic',
  gender: 'female',
  ethnicity: '',
  skinTone: '#F2C4B0',
  eyeColor: 'Blue',
  hairColor: 'Black',
  hairStyle: 'long',
  bodyType: '',
  breastSize: 'medium',
  buttSize: 'medium',
  name: '',
  age: 23,
  voice: 'Avery',
  personality: 'Shy',
  occupation: 'Stripper',
  relationship: 'Crush',
  hobby: '',
  fetish: '',
};
