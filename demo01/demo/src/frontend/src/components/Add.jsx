import React, { Suspense } from 'react'
import Navbar from './Navbar';
import styled, { keyframes} from 'styled-components';
import { HiChevronDoubleDown } from 'react-icons/hi';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Section = styled.div`
    height:100vh;
    background-color: green;
    scroll-snap-align: center;
    color:black;
    background:url("./img/blue.jpg");
    background-size: cover;
    flex-direction:column;
    align-items:center; 
    justify-content:space-between;
`

const Container = styled.div`
  height: 100%;
  scroll-snap-align: center;
  width: 1400px;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  @media only screen and (max-width: 768px) {
    flex: 1;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 74px;
  margin-left: 70px;

  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`;

const Subtitle = styled.h2`
  color: ivory;
  margin-left: 70px;
  margin-top: 50px;
  font-weight:bold;
`;

const Desc = styled.p`
  font-size: 24px;
  color: ivory;
  font-weight:bold;
  margin-left: 70px;
  margin-top: 50px;
  margin-bottom: 250px;
  @media only screen and (max-width: 768px) {
    padding: 20px;
    text-align: center;
  }
`;

const Right = styled.div`
  flex: 3;
  position: relative;
  padding: 20px;
  @media only screen and (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const Img = styled.img`
  width: 500px;
  height: 350px;
  object-fit: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  margin-left: 50px;
//   animation: animate 2s infinite ease alternate;

  @media only screen and (max-width: 768px) {
    width: 300px;
    height: 300px;
  }

//   @keyframes animate {
//     to {
//       transform: translateY(20px);
//     }
//   }
// `;


const moveDown = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
`;

const AnimatedHiChevronDoubleDown = styled(HiChevronDoubleDown)`
  animation: ${moveDown} 2s infinite;
  position: absolute;
  left: 45%;
  bottom: 30px;
  transform: translateX(-50%);
  zoom: 1.5; 
  color: white;
`;

const Add = () =>{
    return(
        <Section>
            <Navbar/>
            <Container>
                <Left>
                    <Title>
                        Auto Mate
                    </Title>
                    <Subtitle>
                        Parking. Routing. More.
                    </Subtitle>
                    <Desc>
                        Your Best Driving Assistant in NYC
                    </Desc>
                </Left>
                <Right>
                    <Canvas>
                        <Suspense fallback={null}>
                        <OrbitControls enableZoom={false} />
                        <ambientLight intensity={1} />
                        <directionalLight position={[3, 2, 1]} />
                        <Sphere args={[1, 100, 200]} scale={2.4}>
                            <MeshDistortMaterial
                            color="#00ffff"
                            attach="material"
                            distort={0.5}
                            speed={1.5}
                            />
                        </Sphere>
                        </Suspense>
                    </Canvas>
                    <Img src="./img/WhiteAudi.png" />
                </Right>
            </Container>
            <AnimatedHiChevronDoubleDown />
        </Section>
    )
}

export default Add;