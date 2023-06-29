import React from 'react';
import styled from 'styled-components';
import Hero from './components/Hero/Hero';
import Main from './components/Main/Main';
import './App.css';

const Container = styled.div`
    margin: 0;
    padding: 0;
    height: 100vh;
    scroll-snap-type: y mandatory;
    scroll-behaviour: smooth;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const App = () => {
    return (
        <Container>
            <Hero />
            <Main />
        </Container>
    );
};

export default App;
