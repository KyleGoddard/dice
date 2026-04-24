import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "../glass/albedo.jpg";
import normal from "../glass/normal.jpg";
import mask from "../glass/mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

const sheenColor = new THREE.Color("#ff6600");
const attenuationColor = new THREE.Color(0.8, 0.1, 0.0);

export function BladeRunnerMaterial(
  props: JSX.IntrinsicElements["meshPhysicalMaterial"]
) {
  const [albedoMap, maskMap, normalMap] = useTexture(
    [albedo, mask, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      sheenColor={sheenColor}
      sheen={1}
      roughness={0.3}
      metalness={0}
      normalMap={normalMap}
      transmission={1}
      transmissionMap={maskMap}
      thickness={2}
      envMapIntensity={1}
      attenuationColor={attenuationColor}
      attenuationDistance={0.1}
      {...props}
    />
  );
}
