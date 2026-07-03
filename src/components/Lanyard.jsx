/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider, CuboidCollider, Physics, RigidBody,
  useRopeJoint, useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT  = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 22],
  gravity = [0, -40, 0],
  fov = 28,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2}  color="white" position={[0, -1, 5]}   rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3}  color="white" position={[-1, -1, 1]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3}  color="white" position={[1, 1, 1]}    rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 35,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const band  = useRef();
  const fixed = useRef();
  const j1    = useRef();
  const j2    = useRef();
  const j3    = useRef();
  const card  = useRef();
  const ropePoints = useRef([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic', canSleep: true, colliders: false,
    // Damping relevé (4 → 9) pour tuer l'oscillation résiduelle de la corde :
    // avec 4, chaque petit à-coup (drag, resize, premier tick Rapier) mettait
    // trop de temps à s'amortir et la carte continuait à osciller/tourner.
    angularDamping: 9, linearDamping: 9
  };

  // card.glb and lanyard.png served from /public/assets/lanyard/
  const { nodes, materials } = useGLTF('/assets/lanyard/card.glb');
  const texture  = useTexture(lanyardImage || '/assets/lanyard/lanyard.png');
  const frontTex = useTexture(frontImage  || BLANK_PIXEL);
  const backTex  = useTexture(backImage   || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img, rect) => {
      const rx = rect.x * W, ry = rect.y * H;
      const rw = rect.w * W, rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      const dx = rx + (rw - dw) / 2, dy = ry + (rh - dh) / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh); ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage  && backTex.image)  drawFitted(backTex.image,  BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,   0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(1,   0, 0),
      new THREE.Vector3(1.5, 0, 0),
    ]);
    c.curveType = 'chordal';
    return c;
  });
  const [dragged, drag]  = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0,0,0],[0,0,0],1]);
  useRopeJoint(j1,   j2, [[0,0,0],[0,0,0],1]);
  useRopeJoint(j2,   j3, [[0,0,0],[0,0,0],1]);
  useSphericalJoint(j3, card, [[0,0,0],[0,1.5,0]]);

  // Pré-initialise MeshLine avec des points valides dès le mount.
  // Sans ça, le premier render appelle setPoints sur une géométrie vide :
  // MeshLineGeometry.process() calcule j/(l-1) avec l=1 → NaN partout.
  // On silence aussi computeBoundingSphere pendant la phase d'init Rapier.
  useEffect(() => {
    const geo = band.current?.geometry;
    if (!geo) return;
    // Patch silencieux : évite le spam console pendant les premiers frames
    const origCBS = geo.computeBoundingSphere.bind(geo);
    const origCBB = geo.computeBoundingBox.bind(geo);
    geo.computeBoundingSphere = () => {
      try { origCBS(); } catch (_) {}
      if (geo.boundingSphere && !isFinite(geo.boundingSphere.radius)) {
        geo.boundingSphere.set(new THREE.Vector3(), 0);
      }
    };
    geo.computeBoundingBox = () => {
      try { origCBB(); } catch (_) {}
    };
    // Pré-charge avec des points distincts valides
    const fallback = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(1.5, 0, 0),
    ]);
    geo.setPoints(fallback.getPoints(isMobile ? 16 : 32));
    return () => {
      // Restore au démontage
      if (geo.computeBoundingSphere !== origCBS) geo.computeBoundingSphere = origCBS;
      if (geo.computeBoundingBox   !== origCBB) geo.computeBoundingBox    = origCBB;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2, j3].forEach(ref => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const translation = ref.current.translation();
        const clampedDistance = Math.max(0.1, Math.min(1,
          ref.current.lerped.distanceTo(translation)
        ));
        ref.current.lerped.lerp(
          translation,
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      // Rapier initialise sa physique de façon asynchrone.
      // lerped n'existe qu'après le premier tick du lerp ci-dessus.
      if (!j1.current.lerped || !j2.current.lerped || !j3.current.lerped) return;
      const p0 = j3.current.lerped;
      const p1 = j2.current.lerped;
      const p2 = j1.current.lerped;
      const p3 = fixed.current.translation();
      const ok = v => v && isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
      if (!ok(p0) || !ok(p1) || !ok(p2) || !ok(p3)) return;
      ropePoints.current[0].copy(p0);
      ropePoints.current[1].copy(p1);
      ropePoints.current[2].copy(p2);
      ropePoints.current[3].copy(p3);
      curve.points.forEach((point, index) => point.copy(ropePoints.current[index]));
      const pts = curve.getPoints(isMobile ? 16 : 32);
      if (pts.length >= 2 && pts.every(v => isFinite(v.x) && isFinite(v.y) && isFinite(v.z))) {
        band.current.geometry.setPoints(pts);
      }
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      // Correction proportionnelle plus douce (0.25 → 0.15) + clamp : sans ça,
      // la carte pouvait légèrement dépasser sa cible en yaw et repartir dans
      // l'autre sens en boucle, ce qui se lit comme une corde "instable".
      const correctedY = Math.max(-2, Math.min(2, ang.y - rot.y * 0.15));
      card.current.setAngvel({ x: ang.x, y: correctedY, z: ang.z });
    }
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} restitution={0} friction={1} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} restitution={0} friction={1} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} restitution={0} friction={1} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]} ref={card} {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} restitution={0} friction={1} />
          <group
            scale={2.25} position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap} map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1} clearcoatRoughness={0.15}
                roughness={0.9} metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}  material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white" depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap map={texture} repeat={[-4, 1]} lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}