const namesByEthnicity: Record<string, string[]> = {
  white: ['Scarlett Vixen', 'Britney Rose', 'Ashley Blaze', 'Kayla Storm', 'Tiffany Wilde'],
  black: ['Destiny Rain', 'Jasmine Fire', 'Ebony Storm', 'Naomi Blaze', 'Simone Wilde'],
  asian: ['Yuki Hana', 'Mei Lin', 'Sakura Storm', 'Akari Blaze', 'Nami Wilde'],
  latina: ['Sofia Fuego', 'Valentina Cruz', 'Isabella Storm', 'Camila Blaze', 'Daniela Wilde'],
  arab: ['Layla Nour', 'Yasmine Fire', 'Amira Storm', 'Nadia Blaze', 'Fatima Wilde'],
  indian: ['Priya Storm', 'Ananya Blaze', 'Kavya Wilde', 'Divya Fire', 'Meera Rose'],
  default: ['Monica Mystique', 'Crystal Rose', 'Jade Storm', 'Ruby Blaze', 'Luna Wilde'],
};

export function getAutoName(ethnicity: string): string {
  const pool = namesByEthnicity[ethnicity.toLowerCase()] ?? namesByEthnicity.default;
  return pool[Math.floor(Math.random() * pool.length)];
}
