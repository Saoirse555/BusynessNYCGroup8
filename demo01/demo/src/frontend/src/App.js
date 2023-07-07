import React, { useEffect, useState } from 'react';
import {
    getWeatherData,
    getWeatherForeCast
} from './components/Main/Weather/getWeatherAPI';
import styled from 'styled-components';
import Hero from './components/Hero/Hero';
import Map from './components/Main/Map/Map';
import './App.css';
import {getAllLocations} from "./client";

// App component
const App = () => {
    // State variables for weather data, forecast data, and locations
    const [weatherData, setWeatherData] = useState({});
    const [foreCastData, setForeCastData] = useState({});
    const [locations, setLocations] = useState([]);

    // Fetch weather data, forecast data, and all parking locations on component mount
    useEffect(() => {
        // Fetch weather data and update state
        getWeatherData().then((data) => setWeatherData(data));

        // Fetch forecast data and update state
        getWeatherForeCast().then((data) => setForeCastData(data));

        // Fetch all locations and update state
        getAllLocations().then((data) => setLocations(data));
    }, []);

    // Render the App component
    return (
        <Container>
            <Hero />
            <Map weatherInfo={weatherData} foreCastInfo={foreCastData} locationInfo = {locations}/>
        </Container>
    );
};

export default App;

// Styled component for the container
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
