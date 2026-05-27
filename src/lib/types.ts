export type Gender = 'female' | 'male' | 'trans';
export type Style = 'realistic' | 'anime';

export interface FunnelCState {
  style: Style;
  gender: Gender;
  ethnicity: string;
  bodyType: string;
  name: string;
}

export type ControlDynamic = 'dom' | 'sub' | 'both' | '';

export interface FunnelDState {
  kinks: string[];
  control: ControlDynamic;
  ethnicity: string;
}

export const DEFAULT_FUNNEL_C: FunnelCState = {
  style: 'realistic',
  gender: 'female',
  ethnicity: '',
  bodyType: '',
  name: '',
};

export const DEFAULT_FUNNEL_D: FunnelDState = {
  kinks: [],
  control: '',
  ethnicity: '',
};
