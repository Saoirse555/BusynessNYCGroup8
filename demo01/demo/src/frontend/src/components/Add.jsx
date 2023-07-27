import React from 'react'
import Navbar from './Navbar';
import styled, { keyframes} from 'styled-components';
import { HiChevronDoubleDown } from 'react-icons/hi';

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
            <AnimatedHiChevronDoubleDown />
        </Section>
    )
}

export default Add;