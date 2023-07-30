import React from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './Cube';
import Navbar from './Navbar';

const data = [
    "We are CS Master students at UCD",
    "This web app is called Auto Mate",
    "Based on predicted Manhattan road Busyness",
    "Help drivers plan their routes",
    "Provide traffic information conveniently"
];

const Section = styled.div`
    background:url("./img/greenbg.jpg");
    background-size: cover;
    height:100vh;
    scroll-snap-align:center;
    display:felx;
    justify-content:center;
    overflow: hidden; 
    position: relative;
`

const Container = styled.div`
    width: 100%;
    display:flex;
    justify-content: space-between;
    height:80vh;

    @media only screen and (max-width: 768px) {
        width: 100%;
        flex-direction: column;
      }
`

const Left = styled.div`
    display:flex;
    align-items:center;
    padding:3vh;
    width:65%;

    @media only screen and (max-width: 768px) {
        padding: 20px;
        justify-content: center;
      }
`

const Right = styled.div`
    display:flex;
    position: relative;
    flex-direction: column;
    justify-content:flex-start;
    width:35%;
`

const List = styled.ul`
    padding:50px;
    list-style:none;
    display:flex;
    flex-direction:column;
    gap:20px;
    top:20%;
`

const ListItem = styled.li`
    font-size:30px;
    font-weight:bold;
    color: transparent;
    -webkit-text-stroke: 1.5px white;
    position: relative;
    
    
    @media only screen and (max-width: 768px) {
        font-size: 24px;
        color: white;
        -webkit-text-stroke: 0px;
      }
    
    &::after {
        content: "${(props) => props.text}";
        position: absolute;
        top: 0;
        left: 0;
        background-color:forestgreen ;
        width: 0%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        transition: width 0.5s;
        }

    &:hover::after {
        width: 100%;
        }
    `;

const About = () =>{
    return( 
            <Section id="about">
                <Navbar/>
                <Container>
                    <Left>
                        <List>
                            {data.map((item)=>(
                                <ListItem key={item} text={item}>
                                    {item}
                                </ListItem>))}
                        </List>
                    </Left>
                    <Right>
                    <Canvas>
                        <OrbitControls enableZoom={false} />
                        <ambientLight intensity= {2}/>
                        <directionalLight position={[3,2,1]}/>
                            <Cube/>
                    </Canvas>
                    </Right>
                </Container>
            </Section>

    )
}

export default About;