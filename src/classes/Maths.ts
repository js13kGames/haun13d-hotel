export class vec2 {
    x: number = 0;
    y: number = 0;
}

/**
 * simple linear interpolation
 */
export function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
}
