const CDN = 'https://imagedelivery.net/xg10iEye-7DbtieyqvXeQg';

export const cdnUrl = (id: string) => `${CDN}/${id}/medium`;

// Logo
export const LOGO_URL = 'https://dondi.ai/wp-content/uploads/2025/05/dondi.ai_.png';

// Style
export const STYLE_IMAGES = {
  realistic: cdnUrl('c697a675-e928-48c7-7b09-1ef6398a4d00'),
  anime: cdnUrl('eeb796e8-022e-4ceb-61ce-aabd8da4ca00'),
} as const;

// Ethnicity
export const ETHNICITY_IMAGES = {
  white:   cdnUrl('8784d47d-c508-4581-c9f7-2864d8769b00'),
  black:   cdnUrl('05d37450-6686-410a-5f5a-6713187a1b00'),
  asian:   cdnUrl('2d669731-63a1-4964-31a8-d22ce491d100'),
  latina:  cdnUrl('ab67c4d9-a601-412a-b18a-53e9b2e4a500'),
  arab:    cdnUrl('86c2d78a-97a6-491d-1956-e115a504ec00'),
  indian:  cdnUrl('dab77c81-2736-4824-da6c-b313db971f00'),
} as const;

// Hair Style
export const HAIR_STYLE_IMAGES = {
  braided:  cdnUrl('89b08911-fca6-4644-1420-2e7602600700'),
  long:     cdnUrl('ee97fbdd-58d0-42c3-67e1-449eba4b5800'),
  bangs:    cdnUrl('67cb0210-b717-4114-6c80-9576dd3d9500'),
  ponytail: cdnUrl('81ddf149-2994-4633-5bf8-4d8674936e00'),
  short:    cdnUrl('4a06605c-6a2f-44f9-7c5d-186b18257600'),
  bun:      cdnUrl('bd64559e-34f0-4434-d558-48796accce00'),
  buns:     cdnUrl('9ee9f426-eb65-4113-8603-14f43edafc00'),
  wavy:     cdnUrl('40d3bdc2-3456-49f5-9321-30dc08168900'),
  pixie:    cdnUrl('d5d3fdab-6331-43ee-54fe-6a0924bf4100'),
  curly:    cdnUrl('bf4dcd6a-a79b-4adc-9b4c-aea03a83f300'),
} as const;

// Body Type
export const BODY_TYPE_IMAGES = {
  slim:        cdnUrl('0c8b3351-1dba-46ca-4054-6849fd927400'),
  athletic:    cdnUrl('4bc86263-e8da-4b0d-98a7-2ce059a11500'),
  voluptuous:  cdnUrl('ce3d5d02-695e-4a4e-06d8-7c3afbc29600'),
  curvy:       cdnUrl('60085766-8ab8-4fbb-e105-f71f02d9a800'),
  muscular:    cdnUrl('0756fd37-ff64-495d-519c-c75d665b2f00'),
} as const;

// Breast Size
export const BREAST_SIZE_IMAGES = {
  flat:   cdnUrl('f1563ece-2b62-42be-eea5-9ba5b5416300'),
  small:  cdnUrl('58307677-cb51-477e-7ea1-db999e00e000'),
  medium: cdnUrl('324750d0-bca7-4284-d717-800114528e00'),
  large:  cdnUrl('94d3c046-5d34-4e83-5ece-812097390a00'),
  xl:     cdnUrl('9051b0cf-64c1-4a03-d780-93bef4e67600'),
} as const;

// Butt Size
export const BUTT_SIZE_IMAGES = {
  small:    cdnUrl('e50befed-9d97-40c3-d3e1-ff294efa5000'),
  skinny:   cdnUrl('4156ea36-e396-4910-4df2-37b93cf6ab00'),
  athletic: cdnUrl('6acb04f5-7caf-44e3-68aa-670198813700'),
  medium:   cdnUrl('071dc102-19c8-4462-44aa-0f7334b19a00'),
  large:    cdnUrl('7de1dd13-6c06-4791-e072-27dde5857f00'),
} as const;

// Colour palettes
export const EYE_COLORS = [
  { label: 'Black',  hex: '#1a1a2e' },
  { label: 'Brown',  hex: '#8B4513' },
  { label: 'Red',    hex: '#DC143C' },
  { label: 'Blonde', hex: '#FFD700' },
  { label: 'Green',  hex: '#228B22' },
  { label: 'Blue',   hex: '#4169E1' },
  { label: 'Purple', hex: '#9370DB' },
  { label: 'Pink',   hex: '#FF69B4' },
  { label: 'White',  hex: '#F5F5F5' },
] as const;

export const HAIR_COLORS = EYE_COLORS; // same palette

export const SKIN_TONES = [
  { label: 'Very Pale', hex: '#F5E4D4' },
  { label: 'Fair',      hex: '#F2C4B0' },
  { label: 'Light',     hex: '#E8A888' },
  { label: 'Tan',       hex: '#C48060' },
  { label: 'Olive',     hex: '#B89040' },
  { label: 'Brown',     hex: '#9A6842' },
  { label: 'Dark',      hex: '#7A4028' },
] as const;
