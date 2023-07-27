import React from 'react'
import styled from 'styled-components';

const Section = styled.div`
    height:100vh;
    background-color: green;
    scroll-snap-align: center;
    color:black;
    background:url("./img/blue.jpg");
    background-size: cover; 
`

const Add = () =>{
    return(
        <Section>Addsss</Section>
    )
}

export default Add;