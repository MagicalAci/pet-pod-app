import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import * as THREE from 'three'

// STL模型组件
function STLModel({ url, color = '#FFB347', autoRotate = true }: { url: string; color?: string; autoRotate?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useLoader(STLLoader, url)
  
  // 自动旋转
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.005
    }
  })
  
  // 居中模型
  useEffect(() => {
    if (geometry) {
      geometry.center()
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      if (box) {
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        geometry.scale(3 / maxDim, 3 / maxDim, 3 / maxDim)
      }
    }
  }, [geometry])
  
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.1}
      />
    </mesh>
  )
}

// 加载中显示
function Loader() {
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        color: '#FF8C61'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 140, 97, 0.2)',
          borderTopColor: '#FF8C61',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '14px' }}>加载3D模型...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  )
}

interface Model3DViewerProps {
  modelUrl: string
  color?: string
  autoRotate?: boolean
  style?: React.CSSProperties
}

export default function Model3DViewer({ 
  modelUrl, 
  color = '#FFB347',
  autoRotate = true,
  style 
}: Model3DViewerProps) {
  const [isClient, setIsClient] = useState(false)
  
  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        borderRadius: '16px',
        ...style
      }}>
        <span style={{ color: '#FF8C61' }}>加载中...</span>
      </div>
    )
  }
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      ...style 
    }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FFB347" />
        
        {/* 3D模型 */}
        <Suspense fallback={<Loader />}>
          <STLModel url={modelUrl} color={color} autoRotate={autoRotate} />
          <Environment preset="studio" />
        </Suspense>
        
        {/* 阴影 */}
        <ContactShadows 
          position={[0, -1.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4} 
        />
        
        {/* 控制器 */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

