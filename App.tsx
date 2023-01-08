import { StatusBar } from 'expo-status-bar'
import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Canvas, useFrame, useThree } from '@react-three/fiber/native'
import { useRef, useEffect } from 'react'
import useControls from 'r3f-native-orbitcontrols'
import { useImmer } from 'use-immer'
// import { OrbitControls as OBC } from '@react-three/drei/native'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import { KernelSize, BlendFunction } from 'postprocessing'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'

import Grid from './components/Grid'
import OBlock from './components/OBlock'
import XBlock from './components/XBlock'
import { Vector3 } from 'three'
import checkWin from './components/checkWin'

function createGrid(): Array<Array<Array<string | 0>>> {
  return new Array(4).fill(new Array(4).fill(new Array(4).fill(0)))
}

export const BLOCK_DISTANCE = 6

const CENTER = new Vector3(
  BLOCK_DISTANCE * 1.5,
  BLOCK_DISTANCE * 1.5,
  BLOCK_DISTANCE * 1.5
)

function getGridItemKey(i: number, j: number, k: number) {
  return `${i},${j},${k}`
}

const Test = () => {
  const gl = useThree((state) => state.gl)
  const domElement = gl.domElement
  useEffect(() => {
    domElement.addEventListener('touchstart', (e) => {
      console.log('touchstart', e)
    })
    return () => {
      domElement.removeEventListener('touchstart', (e) => {
        console.log('touchstart', e)
      })
    }
  })
  return null
}

export default function App() {
  const [OrbitControls, events] = useControls()

  const [grid, setGrid] = useImmer(() => createGrid())
  const [turn, setTurn] = useState('X')
  const [winner, setWinner] = useState<string | null>(null)

  const onCellClick = (i: number, j: number, k: number) => {
    if (winner) return
    if (grid[i][j][k] !== 0) return

    setGrid((draft) => {
      draft[i][j][k] = turn
      if (checkWin(turn, grid, new Vector3(i, j, k))) {
        setWinner(turn)
      }
      setTurn(turn === 'X' ? 'O' : 'X')
    })
  }

  const bottomSheetModalRef = useRef<BottomSheetModal>(null!)

  // variables
  const snapPoints = useMemo(() => ['45%'], [])

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index)
    // bottomSheetModalRef.current?.snapToIndex(index)
  }, [])

  // console.log(events)

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 70,
          right: 30,
          borderColor: 'white',
          borderWidth: 1,
          zIndex: 100,
          height: 50,
        }}
        onPress={handlePresentModalPress}
      >
        <Text style={{ color: 'white' }}>Open</Text>
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{ zIndex: 101 }}
      >
        <SafeAreaView
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            zIndex: 101,
          }}
        >
          {grid.map((plane, i) => (
            <View
              key={i}
              style={{
                width: '35%',
                // borderWidth: 1,
                // borderColor: 'black',
                aspectRatio: 1,
                margin: 15,
              }}
            >
              {plane.map((row, j) => (
                <View
                  style={{
                    flexDirection: 'row',
                    borderColor: 'black',
                    borderBottomWidth: j !== plane.length - 1 ? 2 : 0,
                  }}
                  key={j}
                >
                  {row.map((item, k) => {
                    // let itemType = null
                    // let opacity = 1
                    // if (item === 0) {
                    //   if (
                    //     i === hoveringCell?.[0] &&
                    //     j === hoveringCell?.[1] &&
                    //     k === hoveringCell?.[2] &&
                    //     !winner
                    //   ) {
                    //     itemType = turn
                    //     opacity = 0.3
                    //   }
                    // } else {
                    //   itemType = item
                    // }

                    return (
                      <TouchableOpacity
                        key={getGridItemKey(i, j, k)}
                        style={{
                          width: '25%',
                          aspectRatio: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: 'black',
                          borderRightWidth: k !== row.length - 1 ? 2 : 0,
                        }}
                        onPress={() => {
                          if (item !== 0) return
                          onCellClick(i, j, k)
                        }}
                      >
                        <Text>{item !== 0 && item}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              ))}
            </View>
          ))}
        </SafeAreaView>
      </BottomSheetModal>
      <View style={{ flex: 1 }} {...events}>
        <Canvas camera={{ position: [-30, -30, 0] }}>
          <OrbitControls target={CENTER} />
          {/* <OBC /> */}
          <color args={[0.0273, 0.0898, 0.1523]} attach="background" />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Grid />
          <ambientLight intensity={0.2} />
          <pointLight position={[50, 200, 50]} intensity={0.75} />
          <pointLight position={[-70, -200, 0]} intensity={0.35} />
          {grid.map((plane, i) =>
            plane.map((row, j) =>
              row.map((item, k) => {
                const key = getGridItemKey(i, j, k)
                if (item === 0) return null
                const Block = item === 'X' ? XBlock : OBlock

                return (
                  <Block
                    position={[
                      i * BLOCK_DISTANCE,
                      j * BLOCK_DISTANCE,
                      k * BLOCK_DISTANCE,
                    ]}
                    key={key}
                    opacity={1}
                  />
                )
              })
            )
          )}
        </Canvas>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})
