import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Weather = ({ weatherInfo, foreCastInfo }) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
        console.log({ isHovered });
    };

    const [foreCast, setForeCast] = useState({});

    useEffect(() => {
        setForeCast(foreCastInfo);
    }, [foreCastInfo]);

    return (
        <WeatherContainer
            className={`container ${isHovered ? 'expanded' : ''}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            {Object.keys(weatherInfo).length !== 0 &&
            Object.keys(foreCastInfo).length !== 0 ? (
                !isHovered ? (
                    <div>
                        {Date(weatherInfo.dt * 1000).slice(0, 3)}
                        <img
                            src={`http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`}
                            height="40px"
                            alt="weather icon"
                        />
                        {Math.round(weatherInfo.main.temp - 273.15)}°C
                    </div>
                ) : (
                    <>foreCast.</>
                )
            ) : (
                <p>Loading...</p>
            )}
        </WeatherContainer>
    );
};

export default Weather;

const WeatherContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    position: absolute;
    height: 40px;
    width: auto;
    padding: 0 10px;
    z-index: 2;
    background-color: #3737ff;
    color: white;
    top: 10px;
    left: 200px;
    border-radius: 5px;
    font-size: 1.5rem;
    font-family: Roboto;
    font-weight: 300;
    line-height: 170%;
    letter-spacing: 2px;
`;
