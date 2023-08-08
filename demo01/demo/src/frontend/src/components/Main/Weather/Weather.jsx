import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Weather component
const Weather = ({ weatherInfo, foreCastInfo }) => {
    // Array of days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // State variables for click event and day index
    const [isClicked, setIsClicked] = useState(false);
    const [dayIndex, setDayIndex] = useState(null);

    useEffect(() => {
        // Find the index of the current day
        const weekDay = daysOfWeek.findIndex(
            (day) => day === Date(weatherInfo?.dt * 1000).slice(0, 3)
        );
        setDayIndex(weekDay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [foreCastInfo, weatherInfo]);

    // Handle click event
    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    // State variable for forecast data
    const [foreCast, setForeCast] = useState({});

    useEffect(() => {
        // Filter the forecast data to get the daily forecast
        if (foreCastInfo.list) {
            setForeCast(
                foreCastInfo.list.filter(
                    (element, index) => (index + 1) % 8 === 0
                )
            );
        }
    }, [foreCastInfo]);

    // Fade in animation
    const fadeInAnimation = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

    return (
        <WeatherContainer onClick={handleClick} expanded={isClicked}>
            {/* Check if weatherInfo and foreCastInfo objects have data */}
            {Object.keys(weatherInfo)?.length !== 0 &&
            Object.keys(foreCastInfo)?.length !== 0 ? (
                // Display current weather information if not clicked
                !isClicked ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* Display date, weather icon, and temperature */}
                        {Date(weatherInfo.dt * 1000).slice(0, 3)}
                        <img
                            src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`}
                            height="50px"
                            width="50px"
                            alt="weather icon"
                        />
                        {Math.round(weatherInfo.main.temp - 273.15)}°C
                    </div>
                ) : (
                    // Display forecast information if clicked
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            opacity: '0',
                            animation: 'fadeIn 1s ease forwards'
                        }}
                    >
                        <style>{fadeInAnimation}</style>
                        {/* Check if foreCast array exists */}
                        {foreCast ? (
                            // Map through the forecast array and display weather details
                            foreCast.map((weather, index) => (
                                <div key={index} style={{ padding: '10px' }}>
                                    <img
                                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                        height="40px"
                                        width="40px"
                                        alt="weather icon"
                                    />
                                    <h6>
                                        {daysOfWeek[(dayIndex + index + 1) % 7]}
                                    </h6>
                                    <h6>
                                        {Math.round(weather.main.temp - 273.15)}
                                        °C
                                    </h6>
                                </div>
                            ))
                        ) : (
                            <h5> Loading... </h5>
                        )}
                    </div>
                )
            ) : (
                // Display loading message if weather data is not available
                <p>Loading...</p>
            )}
        </WeatherContainer>
    );
};

export default Weather;

// Styled component for the WeatherContainer
const WeatherContainer = styled.div`
    cursor: pointer;
    z-index: 11;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: ${({ expanded }) => (expanded ? '350px' : '250px')};
    height: ${({ expanded }) => (expanded ? '150px' : '50px')};
    padding: 0 10px;
    backdrop-filter: blur(20px);
    background-color: rgba(65, 65, 65, 0.25);
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    top: 10px;
    left: 20px;
    border-radius: 5px;
    font-size: 1.5rem;
    font-family: Roboto;
    font-weight: 300;
    line-height: 170%;
    letter-spacing: 2px;
    transition: width 0.3s ease, height 0.3s ease;
    @media screen and (max-width: 900px) {
        top: 100px;
        font-size: 1rem;
        font-family: Roboto;
        font-weight: 300;
        line-height: 170%;
        letter-spacing: 1px;
        width: ${({ expanded }) => (expanded ? '300px' : '150px')};
        height: ${({ expanded }) => (expanded ? '100px' : '30px')};
    }
`;
