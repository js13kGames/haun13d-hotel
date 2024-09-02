#version 300 es
precision highp float;                  // Set default float precision
in vec4 v_pos, v_col, v_uv, v_normal;   // Varyings received from the vertex shader: position, color, texture coordinates, normal (if any)
uniform vec3 light_pos[10];                 // Uniform: light position for omnidirectional light
uniform vec4 light_col[10];                 // Uniform: light color
uniform int num_lights;                 // Uniform: number of lights
uniform vec4 o;                         // options [smooth, shading enabled, ambient, mix]
uniform sampler2D sampler;              // Uniform: 2D texture
out vec4 c;                             // Output: final fragment color
void main() {
    vec3 frag_pos = v_pos.xyz;                // Fragment position
    vec3 total_diffuse = vec3(0.0f);           // Total diffuse color
    vec3 ambient = o[2] * c.rgb;              // Ambient light

    // Base color (mix of texture and rgba)
    c = mix(texture(sampler, v_uv.xy), v_col, o[3]);

    if(o[1] > 0.0f) {                          // If lighting/shading is enabled:
        vec3 normal = o[0] > 0.0f              // If smooth shading is enabled:
        ? normalize(v_normal.xyz)         // Use smooth normals passed as varying
        : normalize(cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)));  // Else, compute flat normal

        // Iterate over each light and calculate the contribution
        for(int i = 0; i < num_lights; i++) {
            vec3 light_dir = normalize(light_pos[i] - frag_pos);  // Compute light direction from light position to fragment position
            float distance = length(light_pos[i] - frag_pos);     // Distance from light to fragment
            float falloff = 1.0f / (distance * distance);          // Inverse square falloff
            float diff = max(dot(normal, light_dir), 0.0f);        // Compute dot product for directional shading
            total_diffuse += diff * light_col[i].rgb * c.rgb * falloff;              // Accumulate diffuse light with falloff
        }

        c.rgb = ambient + total_diffuse;  // Output combined ambient and diffuse light
    }
}