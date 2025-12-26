import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface IntroLoaderProps {
  onComplete: () => void;
}

const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // GEOMETRY - WIREFRAME SPHERE/TORUS
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, // Indigo
      wireframe: true,
      transparent: true,
      opacity: 0.8 
    });
    const mainMesh = new THREE.Mesh(geometry, material);
    scene.add(mainMesh);

    // PARTICLES
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x818cf8,
        transparent: true,
        opacity: 0.8,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // ANIMATION LOOP
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      mainMesh.rotation.x += 0.003;
      mainMesh.rotation.y += 0.005;

      particlesMesh.rotation.y -= 0.002;
      particlesMesh.rotation.x -= 0.001;
      
      // Pulse effect
      const time = Date.now() * 0.001;
      const scale = 1 + Math.sin(time) * 0.05;
      mainMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEnter = () => {
    setOpacity(0);
    setTimeout(onComplete, 800); // Wait for transition
  };

  return (
    <div 
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000"
        style={{ opacity: opacity, pointerEvents: opacity === 0 ? 'none' : 'auto' }}
    >
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 tracking-tighter mb-4 animate-pulse">
            WELCOME TO <br/> MASANTO PROJECT
        </h1>
        <p className="text-slate-400 text-sm md:text-base tracking-[0.3em] uppercase mb-10">
            Secure . Anonymous . Modern
        </p>
        
        <button 
            onClick={handleEnter}
            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-indigo-500/50 text-indigo-300 font-bold tracking-widest hover:text-white transition-colors duration-300"
        >
            <span className="absolute inset-0 w-full h-full bg-indigo-600/20 group-hover:bg-indigo-600/50 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
            <span className="relative flex items-center gap-2">
                ENTER SYSTEM <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
        </button>
      </div>
      
      <div className="absolute bottom-8 text-[10px] text-slate-600 font-mono">
        INITIALIZING GATELMAIL PROTOCOL v2.5
      </div>
    </div>
  );
};

export default IntroLoader;