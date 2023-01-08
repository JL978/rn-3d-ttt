import { useRef, useMemo } from 'react'
import { MeshProps, useFrame } from '@react-three/fiber/native'
import { BoxGeometry, DoubleSide, Group, Mesh, Vector3 } from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { CustomThreeObj } from '../types'

export default function XBlock({ position, opacity }: CustomThreeObj) {
  const geometry = useMemo(() => {
    const firstGeo = new BoxGeometry(1, 5, 1)
    const secondGeo = new BoxGeometry(1, 5, 1)

    firstGeo.rotateZ(40)
    secondGeo.rotateZ(-40)

    return mergeBufferGeometries([firstGeo, secondGeo])
  }, [])

  const ref = useRef<Mesh>(null!)
  useFrame((state, delta) => {
    if (!ref.current.rotation) return
    ;(ref.current.rotation as any).y += delta
  })

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        emissive={'#fff450'}
        side={DoubleSide}
        color={[0, 0, 0]}
        opacity={opacity}
        transparent
      />
    </mesh>
  )
}
