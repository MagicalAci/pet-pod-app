import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface STLViewerProps {
  url: string
  color?: string
  backgroundColor?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: (error: Error) => void
}

export default function STLViewer({
  url,
  color = '#FFB347',
  backgroundColor = '#1a1a2e',
  style,
  onLoad,
  onError
}: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
    backLight.position.set(-5, -5, -5)
    scene.add(backLight)

    // 添加地面网格
    const gridHelper = new THREE.GridHelper(10, 20, 0x444444, 0x222222)
    gridHelper.position.y = -1.5
    scene.add(gridHelper)

    // 加载STL模型
    const loader = new STLLoader()
    
    loader.load(
      url,
      (geometry) => {
        // 居中并缩放模型
        geometry.center()
        geometry.computeBoundingBox()
        
        const box = geometry.boundingBox!
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.5 / maxDim
        geometry.scale(scale, scale, scale)

        // 创建材质
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.4,
          metalness: 0.1,
          flatShading: false
        })

        // 创建网格
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)

        setLoading(false)
        onLoad?.()
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100)
          setProgress(percent)
        }
      },
      (err) => {
        console.error('STL加载错误:', err)
        setError('模型加载失败')
        setLoading(false)
        onError?.(err as Error)
      }
    )

    // 动画循环
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // 响应窗口大小变化
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [url, color, backgroundColor, onLoad, onError])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        ...style 
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: backgroundColor,
          zIndex: 10,
          gap: '16px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 140, 97, 0.2)',
            borderTopColor: '#FF8C61',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: '#FF8C61', fontSize: '14px' }}>
            加载3D模型... {progress > 0 ? `${progress}%` : ''}
          </div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: backgroundColor,
          color: '#ff6b6b',
          fontSize: '14px',
          zIndex: 10
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

