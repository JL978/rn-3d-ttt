import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Canvas, useFrame, useThree } from '@react-three/fiber/native'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRef, useEffect } from 'react'
// import { OrbitControls } from '@react-three/drei/native'
import useControls from 'r3f-native-orbitcontrols'

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<any>()

  // Set up state for the hovered and active stateyarn
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  )
}

export default function App() {
  const [OrbitControls, events] = useControls()

  return (
    <View style={{ flex: 1 }} {...events}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        {/* <OrbitControls
        target={[0, 0, 0]}
        maxPolarAngle={3}
        // autoRotate
        // autoRotateSpeed={3}
        // makeDefault
      /> */}
        <OrbitControls />
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
