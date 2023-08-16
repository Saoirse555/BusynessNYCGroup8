import React, { Suspense } from 'react';
import Navbar from './Navbar';
import styled, { keyframes } from 'styled-components';
import { HiChevronDoubleDown } from 'react-icons/hi';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const breakpoints = {
    small: '760px',
    medium: '900px',
    large: '1400px'
};

const Section = styled.div`
    height: 100vh;
    scroll-snap-align: center;
    color: black;
    background: url('./img/blue.jpg');
    background-size: cover;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    font-family: 'Roboto';

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const Container = styled.div`
    height: 82vh;
    scroll-snap-align: center;
    width: 1400px;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: ${breakpoints.medium}) {
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

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 2.5rem;
        margin-top: 25rem;
        gap: 5px;
    }
`;

const Title = styled.h1`
    font-family: Helvetica;
    font-size: 85px;
    margin-left: 70px;
    color: #ffff4d;

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 2.5rem;
        margin-top: 15rem;
    }
`;

const Subtitle = styled.h2`
    color: #ffff99;
    margin-left: 70px;
    margin-top: 55px;
    font-weight: bold;

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 2rem;
        margin-top: 1rem;
    }
`;

const Desc = styled.p`
    font-size: 24px;
    color: #ffff99;
    font-weight: bold;
    margin-left: 70px;
    margin-top: 50px;
    margin-bottom: 45px;

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 1rem;
        margin-top: 1rem;
    }
`;

const Right = styled.div`
    flex: 3;
    position: relative;
    padding: 20px;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        align-items: center;
        margin-bottom: 15rem;
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
    margin-left: 90px;
    margin-bottom: 45px;
    @media screen and (max-width: ${breakpoints.medium}) {
        width: 300px;
        height: 300px;
        margin-bottom: 0rem;
        margin-left: 2rem;
    }
`;

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
    height: 3vh;
    animation: ${moveDown} 2s infinite;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    zoom: 1.5;
    color: white;
    z-index: 999;
    bottom: 25px;

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 1.5rem;
        margin-top: 1.5rem;
    }
`;

const Add = () => {
    return (
        <Section id="home">
            <Navbar />
            <Container>
                <Left>
                    <Title>Auto Mate</Title>
                    <Subtitle>Parking. Routing. Living.</Subtitle>
                    <Desc>Your Best Driving Assistant in NYC</Desc>
                </Left>
                <Right>
                    <Canvas>
                        <Suspense fallback={null}>
                            <OrbitControls enableZoom={false} />
                            <ambientLight intensity={1} />
                            <directionalLight position={[3, 2, 1]} />
                            <Sphere args={[1, 100, 200]} scale={2.6}>
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
    );
};

export default Add;
