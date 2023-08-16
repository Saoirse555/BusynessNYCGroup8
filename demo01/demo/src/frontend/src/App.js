import React, { useEffect, useState } from 'react';
import {
    getWeatherData,
    getWeatherForeCast
} from './components/Main/Weather/getWeatherAPI';
import styled from 'styled-components';
import Map from './components/Main/Map/Map';
import Add from './components/Add';
import './App.css';
import { getAllLocations } from './client';
import Contact from './components/Contact';
import About from './components/About';

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

    //Fetch forecast weather data
    const fetchForeCastData = () =>
        getWeatherForeCast().then((data) => setForeCastData(data));

    //Fetch weather and forecast data every 3,600,000 milliseconds (every hour)
    useEffect(() => {
        fetchForeCastData();
        fetchWeatherData();

        // Fetch weather and forecast data at regular intervals
        const intervalId = setInterval(() => {
            fetchWeatherData();
            fetchForeCastData();
        }, 3600000);

        // Clean up the interval when the component unmounts
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
            <Add />
            <Map
                weatherInfo={weatherData}
                foreCastInfo={foreCastData}
                locationInfo={locations}
            />
            <About />
            <Contact />
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
        height: 100vh;
    }
`;
