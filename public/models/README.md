# 3D Models

Drop your Draco-compressed `.glb` files here.

## Usage

1. Place your model at `public/models/hero.glb`
2. Update `src/data/config.ts` → `heroModelPath: "/models/hero.glb"`
3. The `HeroScene` component will automatically load it via `useGLTF` with Draco decompression

## Recommended Export Settings (Blender)

- Format: glTF 2.0 (.glb)
- Compression: Enable Draco compression (ratio ≈ 90%)
- Apply Transforms: Yes
- Include: Meshes, Materials, Textures, Camera

## ZBrush Workflow

1. Export from ZBrush as OBJ/FBX
2. Import into Blender
3. Apply materials, lighting bake
4. Export as `.glb` with Draco enabled
