import React from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { OrbitControls } from '@react-three/drei';
import Cube from './Cube';

const Container = styled.div`
    height: 100vh;
    width: 100%;
    scroll-snap-align:center;
`

const Test = () =>{
    return(
        <Container>
            <Canvas>
              <OrbitControls enableZoom={false} />
              <ambientLight intensity= {2}/>
              <directionalLight position={[3,2,1]}/>
                <Cube/>
            </Canvas>
        </Container>
    )
}

export default Test;