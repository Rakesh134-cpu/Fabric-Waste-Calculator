import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DEFAULT_BLUE = '#587a9c';
const VIEW_POSITIONS = {
  front: [0, 0.05, 4.9],
  back: [0, 0.05, -4.9],
  side: [4.9, 0.05, 0],
};

function createBodyGeometry() {
  const rows = 30;
  const columns = 48;
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const y = -1.72 + t * 3.44;
    const shoulderCurve = Math.sin(Math.min(t * 2.2, 1) * Math.PI / 2) * 0.1;
    const waistTaper = 0.92 + Math.sin(t * Math.PI) * 0.08;
    const width = (1.28 * waistTaper) + (t > 0.78 ? (t - 0.78) * 0.28 : 0);
    const depth = 0.34 + Math.sin(t * Math.PI) * 0.08;

    for (let column = 0; column <= columns; column += 1) {
      const angle = (column / columns) * Math.PI * 2;
      const fold = Math.sin(angle * 5 + t * 8) * 0.012 * Math.sin(t * Math.PI);
      const x = Math.cos(angle) * width + fold;
      const z = Math.sin(angle) * depth;
      positions.push(x, y + shoulderCurve, z);
      uvs.push(column / columns * 3.2, t * 4.1);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 2;
      const d = a + columns + 1;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createSleeveCurve(side) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 1.05, 1.22, 0),
    new THREE.Vector3(side * 1.58, 1.0, 0.02),
    new THREE.Vector3(side * 1.78, 0.32, 0.04),
    new THREE.Vector3(side * 1.72, -0.48, 0.02),
    new THREE.Vector3(side * 1.62, -1.25, 0),
  ]);
}

function makeTrimMaterial(texture) {
  return new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : '#3e5b79',
    map: texture,
    roughness: 0.72,
    metalness: 0.02,
  });
}

function TexturedShirt({ fabricUrl, fabricColor }) {
  const [texture, setTexture] = useState(null);
  const geometries = useMemo(() => ({
    body: createBodyGeometry(),
    leftSleeve: new THREE.TubeGeometry(createSleeveCurve(-1), 32, 0.31, 20, false),
    rightSleeve: new THREE.TubeGeometry(createSleeveCurve(1), 32, 0.31, 20, false),
    cuff: new THREE.CylinderGeometry(0.34, 0.34, 0.28, 24),
    collar: new THREE.ExtrudeGeometry(new THREE.Shape([
      new THREE.Vector2(-0.76, 0.08), new THREE.Vector2(-0.42, 0.38), new THREE.Vector2(0, 0.22),
      new THREE.Vector2(0.42, 0.38), new THREE.Vector2(0.76, 0.08), new THREE.Vector2(0.42, -0.16),
      new THREE.Vector2(0, -0.04), new THREE.Vector2(-0.42, -0.16),
    ]), { depth: 0.12, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.035, bevelThickness: 0.03, curveSegments: 8 }),
    stand: new THREE.TorusGeometry(0.54, 0.08, 10, 32, Math.PI * 1.3),
    placket: new THREE.BoxGeometry(0.13, 2.45, 0.1),
    pocket: new THREE.ExtrudeGeometry(new THREE.Shape([
      new THREE.Vector2(-0.31, 0.3), new THREE.Vector2(0.31, 0.3), new THREE.Vector2(0.27, -0.32),
      new THREE.Vector2(0, -0.42), new THREE.Vector2(-0.27, -0.32),
    ]), { depth: 0.06, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.035, bevelThickness: 0.02 }),
    button: new THREE.SphereGeometry(0.075, 20, 12),
    seam: new THREE.TorusGeometry(0.34, 0.018, 6, 24, Math.PI * 1.5),
  }), []);

  useEffect(() => {
    if (!fabricUrl) {
      setTexture(null);
      return undefined;
    }

    let active = true;
    const loader = new THREE.TextureLoader();
    const loaded = loader.load(fabricUrl, (nextTexture) => {
      if (!active) return;
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.wrapS = THREE.RepeatWrapping;
      nextTexture.wrapT = THREE.RepeatWrapping;
      nextTexture.repeat.set(3.5, 4.5);
      nextTexture.flipY = false;
      nextTexture.anisotropy = 8;
      setTexture(nextTexture);
    });

    return () => {
      active = false;
      loaded.dispose();
    };
  }, [fabricUrl]);

  useEffect(() => () => {
    Object.values(geometries).forEach((geometry) => geometry.dispose());
  }, [geometries]);

  const fabricMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : (fabricColor || DEFAULT_BLUE),
    map: texture,
    roughness: 0.88,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }), [texture, fabricColor]);
  const trimMaterial = useMemo(() => makeTrimMaterial(texture), [texture]);
  const buttonMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d7c39b', roughness: 0.3, clearcoat: 0.35 }), []);

  useEffect(() => () => {
    fabricMaterial.dispose();
    trimMaterial.dispose();
    buttonMaterial.dispose();
  }, [buttonMaterial, fabricMaterial, trimMaterial]);

  return (
    <group position={[0, 0.05, 0]}>
      <mesh geometry={geometries.body} material={fabricMaterial} castShadow receiveShadow />
      <mesh geometry={geometries.leftSleeve} material={fabricMaterial} castShadow receiveShadow />
      <mesh geometry={geometries.rightSleeve} material={fabricMaterial} castShadow receiveShadow />
      <mesh geometry={geometries.collar} material={trimMaterial} position={[0, 1.53, 0.18]} rotation={[-0.1, 0, 0]} castShadow />
      <mesh geometry={geometries.stand} material={trimMaterial} position={[0, 1.48, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow />
      <mesh geometry={geometries.placket} material={trimMaterial} position={[0, 0.1, 0.37]} castShadow />
      <mesh geometry={geometries.pocket} material={fabricMaterial} position={[0.68, 0.48, 0.37]} rotation={[0, 0, 0]} castShadow />
      <mesh geometry={geometries.cuff} material={trimMaterial} position={[-1.62, -1.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow />
      <mesh geometry={geometries.cuff} material={trimMaterial} position={[1.62, -1.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow />
      {[-0.82, -0.4, 0.02, 0.44, 0.86].map((y) => <mesh key={y} geometry={geometries.button} material={buttonMaterial} position={[0, y, 0.46]} castShadow />)}
      <mesh geometry={geometries.seam} material={trimMaterial} position={[0, -1.68, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[2.7, 1, 1]} />
    </group>
  );
}

function SimpleGarment({ garmentType, fabricUrl, fabricColor }) {
  const [texture, setTexture] = useState(null);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: texture ? '#ffffff' : (fabricColor || DEFAULT_BLUE), map: texture, roughness: 0.86, metalness: 0.02 }), [texture, fabricColor]);
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: texture ? '#ffffff' : '#3e5b79', map: texture, roughness: 0.72, metalness: 0.02 }), [texture]);
  const geometries = useMemo(() => {
    if (garmentType === 'bag') return { body: new THREE.BoxGeometry(2.5, 2.1, 0.72), handle: new THREE.TorusGeometry(0.72, 0.09, 12, 32, Math.PI) };
    if (garmentType === 'dress') return { skirt: new THREE.CylinderGeometry(1.65, 2.05, 2.5, 48), bodice: new THREE.CylinderGeometry(0.92, 0.82, 1.55, 40), waist: new THREE.TorusGeometry(0.7, 0.09, 12, 32) };
    return { waistband: new THREE.BoxGeometry(2.5, 0.28, 0.72), leg: new THREE.CapsuleGeometry(0.55, garmentType === 'shorts' ? 1.25 : 2.25, 8, 20), fly: new THREE.BoxGeometry(0.1, 0.65, 0.08) };
  }, [garmentType]);

  useEffect(() => {
    if (!fabricUrl) { setTexture(null); return undefined; }
    const loaded = new THREE.TextureLoader().load(fabricUrl, (nextTexture) => {
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.wrapS = THREE.RepeatWrapping;
      nextTexture.wrapT = THREE.RepeatWrapping;
      nextTexture.repeat.set(3, 3);
      nextTexture.flipY = false;
      setTexture(nextTexture);
    });
    return () => loaded.dispose();
  }, [fabricUrl]);

  useEffect(() => () => {
    material.dispose();
    trim.dispose();
    Object.values(geometries).forEach((geometry) => geometry.dispose());
  }, [geometries, material, trim]);

  if (garmentType === 'bag') {
    return <group><mesh geometry={geometries.body} material={material} position={[0, 0, 0]} castShadow receiveShadow /><mesh geometry={geometries.handle} material={trim} position={[-0.78, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow /><mesh geometry={geometries.handle} material={trim} position={[0.78, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow /></group>;
  }

  if (garmentType === 'dress') {
    return <group><mesh geometry={geometries.skirt} material={material} position={[0, -0.55, 0]} castShadow receiveShadow /><mesh geometry={geometries.bodice} material={material} position={[0, 1.45, 0]} castShadow /><mesh geometry={geometries.waist} material={trim} position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} /></group>;
  }

  const isShorts = garmentType === 'shorts';
  const legHeight = isShorts ? 1.25 : 2.25;
  return <group><mesh geometry={geometries.waistband} material={trim} position={[0, 1.25, 0]} castShadow /><mesh geometry={geometries.leg} material={material} position={[-0.62, 0, 0]} castShadow receiveShadow /><mesh geometry={geometries.leg} material={material} position={[0.62, 0, 0]} castShadow receiveShadow /><mesh geometry={geometries.fly} material={trim} position={[0, 0.95, 0.39]} castShadow /></group>;
}

function CameraController({ view, resetToken, controlsRef }) {
  const desiredPosition = useMemo(() => new THREE.Vector3(...(VIEW_POSITIONS[view] || VIEW_POSITIONS.front)), [view]);
  const cameraTarget = useMemo(() => new THREE.Vector3(0, 0.05, 0), []);
  const animating = useRef(true);

  useFrame(({ camera }, delta) => {
    if (!animating.current) return;
    const damping = 1 - Math.exp(-delta * 6);
    camera.position.lerp(desiredPosition, damping);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(cameraTarget, damping);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(desiredPosition) < 0.015) animating.current = false;
  });

  useEffect(() => {
    animating.current = true;
  }, [view, resetToken]);

  return null;
}

/**
 * @param {{ garmentType?: string, fabricUrl?: string | null, fabricColor?: string | null }} props
 */
export default function Garment3DViewer({ garmentType = 'shirt', fabricUrl = null, fabricColor = null }) {
  const normalizedGarment = String(garmentType).toLowerCase().includes('pant') ? 'pants' : String(garmentType).toLowerCase().includes('short') ? 'shorts' : String(garmentType).toLowerCase().includes('dress') ? 'dress' : String(garmentType).toLowerCase().includes('bag') ? 'bag' : 'shirt';
  const [view, setView] = useState('front');
  const [resetToken, setResetToken] = useState(0);
  const controlsRef = useRef(null);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#101b2b] shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-[#0d1726] px-4 py-3">
        <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">3D Preview</div><div className="text-lg font-semibold capitalize text-white">{normalizedGarment === 'pants' ? 'Pants' : normalizedGarment === 'shorts' ? 'Shorts' : normalizedGarment === 'dress' ? 'Dress' : normalizedGarment === 'bag' ? 'Bag' : 'Long-sleeve shirt'}</div></div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1">
          {['front', 'back', 'side'].map((option) => <button key={option} type="button" onClick={() => setView(option)} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${view === option ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>{option}</button>)}
          <button type="button" onClick={() => { setView('front'); setResetToken((value) => value + 1); }} className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">Reset</button>
        </div>
      </div>
      <div className="relative min-h-[650px] w-full flex-1 touch-none bg-[radial-gradient(circle_at_50%_35%,#263b52_0%,#101a2a_48%,#09111d_100%)]">
        <Canvas shadows camera={{ position: VIEW_POSITIONS.front, fov: 32 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <color attach="background" args={['#101a2a']} />
          <hemisphereLight intensity={1.5} color="#d8e9ff" groundColor="#101827" />
          <spotLight position={[3.5, 5, 4]} angle={0.42} penumbra={0.75} intensity={4.2} color="#fff3df" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[-3, 1, 2]} intensity={1.8} color="#9dc9ff" />
          <pointLight position={[0, 2, -3]} intensity={2.2} color="#7dd3fc" />
          <CameraController view={view} resetToken={resetToken} controlsRef={controlsRef} />
          {normalizedGarment === 'shirt' ? <TexturedShirt fabricUrl={fabricUrl} fabricColor={fabricColor} /> : <SimpleGarment garmentType={normalizedGarment} fabricUrl={fabricUrl} fabricColor={fabricColor} />}
          <ContactShadows position={[0, -1.74, 0]} opacity={0.42} scale={4.5} blur={2.6} far={4} />
          <OrbitControls ref={controlsRef} enableRotate enableZoom enablePan={false} zoomSpeed={0.85} rotateSpeed={0.65} minDistance={2.7} maxDistance={8.5} enableDamping dampingFactor={0.08} target={[0, 0.05, 0]} />
        </Canvas>
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-slate-300/80">Drag to rotate · Scroll to zoom</div>
      </div>
    </div>
  );
}
