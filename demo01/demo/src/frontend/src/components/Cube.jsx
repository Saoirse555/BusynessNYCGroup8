import React, {useRef} from 'react';
import { Text, RenderTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Cube = () =>{
    const textRef = useRef()

    useFrame(state=> (textRef.current.position.x = Math.sin(state.clock.elapsedTime)*2.5)
        )

    return(
        <mesh rotation={[Math.PI* 1, Math.PI* 1.2, Math.PI* 1.1]}>
                    <boxGeometry args={[2.5,2.5,2.5]}/>
                    <meshStandardMaterial>
                      <RenderTexture attach="map">
                        <perspectiveCamera
                          makeDefault
                          position={[0,0,2]}
                        />
                        <color attach="background" args={["cyan"]}/>
                        <Text ref={textRef} fontSize={2.4} color='white'>
                            Auto Mate
                        </Text>
                      </RenderTexture>
                     </meshStandardMaterial>
                </mesh>
    )
}

export default Cube;