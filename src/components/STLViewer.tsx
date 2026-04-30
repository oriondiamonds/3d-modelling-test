"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center, Bounds } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { MetalPreset } from "./presets";

function STLModel({ url, metal }: { url: string; metal: MetalPreset }) {
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    geometry.computeVertexNormals();
  }, [geometry]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        color={metal.color}
        metalness={metal.metalness}
        roughness={metal.roughness}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

export default function STLViewer({ modelUrl, metal }: { modelUrl: string; metal: MetalPreset }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Bounds fit clip observe>
          <Center>
            <STLModel url={modelUrl} metal={metal} />
          </Center>
        </Bounds>
        <Environment preset="studio" />
        <ContactShadows opacity={0.3} blur={2} position={[0, -2, 0]} />
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom enablePan={false} />
    </Canvas>
  );
}
