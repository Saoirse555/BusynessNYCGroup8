import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    height: 100vh;
    background-color: orange;
    scroll-snap-align: center;
`;
const Main = () => {
    return <Container id="main">Main</Container>;
};

export default Main;
