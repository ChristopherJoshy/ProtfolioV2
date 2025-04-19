import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create objects for a floating island of code
    const group = new THREE.Group();
    scene.add(group);

    // Create a cube with custom shader material for a glowing effect
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Wireframe material for cube
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x6E57E0,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const cube = new THREE.Mesh(cubeGeometry, wireMaterial);
    group.add(cube);

    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00C9A7,
      transparent: true,
      opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particlesMesh);

    // Add floating code symbols
    const symbolsGroup = new THREE.Group();
    
    // Create symbols using box geometry instead of text
    const createSymbol = (position: THREE.Vector3, rotation: THREE.Euler, color: number) => {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
      const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9 
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.copy(rotation);
      
      return mesh;
    };
    
    // Add some code symbols - using simple geometries instead of text
    symbolsGroup.add(createSymbol(new THREE.Vector3(1.5, 1.2, 0), new THREE.Euler(0, 0, Math.PI / 4), 0x6E57E0));
    symbolsGroup.add(createSymbol(new THREE.Vector3(-1.5, -1.2, 0), new THREE.Euler(0, 0, -Math.PI / 6), 0xFF6B6B));
    symbolsGroup.add(createSymbol(new THREE.Vector3(0, 1.8, 0), new THREE.Euler(Math.PI / 5, 0, 0), 0x00C9A7));
    
    group.add(symbolsGroup);

    // Auto-rotation for group
    let rotationSpeed = 0.005;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate group
      group.rotation.y += rotationSpeed;
      
      // Rotate cube
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      
      // Make particles move
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      
      // Make symbols float
      symbolsGroup.children.forEach((symbol: any, i: number) => {
        symbol.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
        symbol.rotation.z += 0.002;
      });
      
      // Render the scene
      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
