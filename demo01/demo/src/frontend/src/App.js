import React, { useEffect, useState } from 'react';
import {
    getWeatherData,
    getWeatherForeCast
} from './components/Main/Weather/getWeatherAPI';
import styled from 'styled-components';
import Hero from './components/Hero/Hero';
import Map from './components/Main/Map/Map';
import './App.css';

const App = () => {
    const [weatherData, setWeatherData] = useState({});
    const [foreCastData, setForeCastData] = useState({});

    useEffect(() => {
        getWeatherData().then((data) => setWeatherData(data));
        getWeatherForeCast().then((data) => setForeCastData(data));
    }, []);

    return (
        <Container>
            <Hero />
            <Map weatherInfo={weatherData} foreCastInfo={foreCastData} />
        </Container>
    );
};

export default App;

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
