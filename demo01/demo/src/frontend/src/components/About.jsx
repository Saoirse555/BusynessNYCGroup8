import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './Cube';
import Navbar from './Navbar';
import { HiChevronDoubleDown } from 'react-icons/hi';

const breakpoints = {
    small: '760px',
    medium: '900px',
    large: '1400px'
};

const data = [
    'We are Auto Mate',
    'See predicted Manhattan busyness',
    'Check the nearest Parking lots',
    'Help route planning through amenities',
    'Provide handy traffic information'
];

const Section = styled.div`
    background: url('./img/greenbg.jpg');
    background-size: cover;
    height: 100vh;
    scroll-snap-align: center;
    display: felx;
    justify-content: center;
    overflow: hidden;
    position: relative;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 82vh;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 5rem;
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    padding: 3vh;
    width: 66%;
    font-family: 'Roboto';

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 3rem;
        margin-top: 8rem;
        gap: 5px;
        width: 55vh;
        margin-left: 7vh;
    }
`;

const Right = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: flex-start;
    width: 34%;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 200vh;
        padding: 0rem;
        margin-bottom: 25px;
    }
`;

const List = styled.ul`
    padding: 50px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: 20%;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        white-space: normal;
        font-size: 2rem;
        margin-top: 0rem;
        padding-bottom: 0rem;
    }
`;

const ListItem = styled.li`
    font-size: 40px;
    font-weight: 100;
    color: white;
    font-weight: bold;
    position: relative;

    &::after {
        content: '${(props) => props.text}';
        position: absolute;
        left: 0;
        background-color: #ffd700;
        background-position: center;
        background-repeat: no-repeat;
        width: 0%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        transition: width 0.5s, color 0.5s;
    }

    &:hover::after {
        width: 100%;
    }

    &:hover {
        color: black;
    }

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 1rem;
        margin-top: 0rem;
        margin-bottom: 0rem;
        margin-right: 2rem;
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

    @media screen and (max-width: 900px) {
        white-space: normal;
        font-size: 3rem;
    }

    @media screen and (max-width: ${breakpoints.medium}) {
        white-space: normal;
        font-size: 1.5rem;
        margin-top: 1.5rem;
    }
`;

const About = () => {
    return (
        <Section id="about">
            <Navbar />
            <Container>
                <Left>
                    <List>
                        {data.map((item) => (
                            <ListItem key={item} text={item}>
                                {item}
                            </ListItem>
                        ))}
                    </List>
                </Left>
                <Right>
                    <Canvas>
                        <OrbitControls enableZoom={false} />
                        <ambientLight intensity={2} />
                        <directionalLight position={[3, 2, 1]} />
                        <Cube />
                    </Canvas>
                </Right>
            </Container>
            <AnimatedHiChevronDoubleDown />
        </Section>
    );
};

export default About;
