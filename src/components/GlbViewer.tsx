"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const GOLD_COLORS: Record<string, string> = {
  rose:   "#B76E79",
  yellow: "#FFD700",
  white:  "#E5E4E2",
};

function JewelryModel({ url, color }: { url: string; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const scene = gltf.scene;
      if (!ref.current) return;
      ref.current.clear();

      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const isDiamond = child.name.toLowerCase().includes("diamond");

        if (isDiamond) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.03,
            transmission: 1.0,
            ior: 2.417,
            thickness: 2.5,
            envMapIntensity: 4.5,
            specularIntensity: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            attenuationColor: new THREE.Color("#bfdfff"),
            attenuationDistance: 0.25,
            flatShading: true,
          });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(GOLD_COLORS[color] ?? GOLD_COLORS.yellow),
            metalness: 1,
            roughness: 0.2,
          });
        }

        child.castShadow = true;
        child.receiveShadow = true;
      });

      // Auto-scale and center via Box3 (from glb.jsx)
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = 1.5 / Math.max(size.x, size.y, size.z);
      scene.scale.setScalar(scale);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center.multiplyScalar(scale));

      ref.current.add(scene);
    });
  }, [url, color]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.005;
  });

  return <group ref={ref} />;
}

interface Props {
  modelUrl: string;
  color: string;
}

export default function GlbViewer({ modelUrl, color }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      shadows
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMappingExposure: 1.2,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} color="#d6eaff" />
      <directionalLight position={[5, 5, 5]} intensity={3} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={2} color="#a8cfff" />
      <Suspense fallback={null}>
        <JewelryModel url={modelUrl} color={color} />
        <Environment preset="apartment" background={false} />
      </Suspense>
    </Canvas>
  );
}
