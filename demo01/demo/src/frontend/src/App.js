import React, { useEffect, useState } from 'react';
import {
    getWeatherData,
    getWeatherForeCast
} from './components/Main/Weather/getWeatherAPI';
import styled from 'styled-components';
import Hero from './components/Hero/Hero';
import Map from './components/Main/Map/Map';
import './App.css';
import { getAllLocations } from './client';

// App component
const App = () => {
    // State variables for weather data, forecast data, and locations
    const [weatherData, setWeatherData] = useState({});
    const [foreCastData, setForeCastData] = useState({});
    const [locations, setLocations] = useState([]);

    // Fetch weather data. forecast data, and all parking locations on component mount

    //Fetch weather data
    const fetchWeatherData = () =>
        getWeatherData().then((data) => setWeatherData(data));

    //Fetch forecast data
    const fetchForeCastData = () =>
        getWeatherForeCast().then((data) => setForeCastData(data));

    //Fetch weather and forecast data every 3,600,000 milliseconds
    useEffect(() => {
        fetchForeCastData();
        fetchWeatherData();

        const intervalId = setInterval(() => {
            fetchWeatherData();
            fetchForeCastData();
        }, 3600000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    //Fetch static location data from database
    useEffect(() => {
        getAllLocations().then((data) => setLocations(data));
    }, []);

    //Render the App component
    return (
        <Container>
            <Hero />
            <Map
                weatherInfo={weatherData}
                foreCastInfo={foreCastData}
                locationInfo={locations}
            />
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
    scroll-behavior: smooth;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    @media screen and (max-width: 900px) {
        height: auto;
    }
`;
