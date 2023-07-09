import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  static generateColorVariations(baseColor: string, variationAmount: number, numVariations: number): string[] {
    const baseHSL = ColorService.rgbToHsl(baseColor);

    const saturationVariation = variationAmount;
    const lightnessVariation = variationAmount;

    const saturationStep = saturationVariation / numVariations;
    const lightnessStep = lightnessVariation / numVariations;

    const colorVariations: string[] = [];
    for (let i = 0; i < numVariations; i++) {
      const saturation = baseHSL[1] + (i * saturationStep);
      const lightness = baseHSL[2] + (i * lightnessStep);

      const rgbColor = ColorService.hslToRgb(baseHSL[0], saturation, lightness);

      colorVariations.push(rgbColor);
    }

    return colorVariations;
  }

  static rgbToHsl(rgbColor: string): number[] {
    const r = parseInt(rgbColor.substring(1, 3), 16) / 255;
    const g = parseInt(rgbColor.substring(3, 5), 16) / 255;
    const b = parseInt(rgbColor.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      if (h != undefined)
        h /= 6;
    }

    return [h != undefined ? h : 0, s, l];
  }

  static hslToRgb(h: number, s: number, l: number): string {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      function hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return '#' + Math.round(r * 255).toString(16).padStart(2, '0') +
      Math.round(g * 255).toString(16).padStart(2, '0') +
      Math.round(b * 255).toString(16).padStart(2, '0');
  }
}
