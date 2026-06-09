export function getContrastYIQ(hexcolor: string): 'black' | 'white' {
  if (!hexcolor) return 'white';
  
  // Remove hash if present
  hexcolor = hexcolor.replace('#', '');
  
  // Convert 3-char hex to 6-char
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(c => c + c).join('');
  }
  
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  
  // YIQ formula
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return (yiq >= 128) ? 'black' : 'white';
}
