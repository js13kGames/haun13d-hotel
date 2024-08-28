export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static subtract(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static add(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static scale(a: Vec3, scalar: number): Vec3 {
        return new Vec3(a.x * scalar, a.y * scalar, a.z * scalar);
    }

    static distanceSquared(a: Vec3, b: Vec3): number {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
    }

    static normalize(a: Vec3): Vec3 {
        const length = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
        return new Vec3(a.x / length, a.y / length, a.z / length);
    }

    /**
 * calculate the distance of the intersection between a ray and a (infinite) plane
 * @param rayOrigin The origin of the ray 
 * @param rayDirection The direction of the ray (must be normalized) 
 * @param planeOrigin The origin of the plane 
 * @param planeNormal The normal of the plane 
 * @returns The distance along the ray to the intersection point, or -1 if no intersection.
 * 
 * @example
```ts
const rayOrigin = {x: 0, y: 0, z: 0};
const rayDirection = {x: 1, y: 0, z: 0};
const planeOrigin = {x: 5, y: 0, z: 0};
const planeNormal = {x: -1, y: 0, z: 0};

const hitDistance = {};
if (rayPlaneIntersection(rayOrigin, rayDirection, planeOrigin, planeNormal, hitDistance)) {
    console.log(`Hit at distance: ${hitDistance.value}`);
} else {
    console.log('No intersection');
}
```
 */
    static rayPlaneIntersection(
        rayOrigin: Vec3,
        rayDirection: Vec3, // must be normalized
        planeOrigin: Vec3,
        planeNormal: Vec3,
        radius: number | undefined
    ): number {
        const EPSILON = 1e-8;

        const denom = Vec3.dot(planeNormal, rayDirection);

        // Non-zero check (accounting for floating-point imprecision)
        if (denom > EPSILON || denom < -EPSILON) {
            const Hd = Vec3.dot(Vec3.subtract(planeOrigin, rayOrigin), planeNormal) / denom;
            if (Hd >= 0) {
                if (radius) {
                    const hitPoint = Vec3.add(rayOrigin, Vec3.scale(rayDirection, Hd));
                    const distanceToCenter = Vec3.distanceSquared(hitPoint, planeOrigin);

                    // Check if the hit point is within the radius, if not, it's a miss and return -1
                    if (distanceToCenter > radius ** 2) {
                        return -1;
                    }
                }
                return Hd;
            }
        }
        return -1;
    }
}