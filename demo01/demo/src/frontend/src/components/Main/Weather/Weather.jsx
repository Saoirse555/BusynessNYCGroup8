import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const Weather = ({ weatherInfo, foreCastInfo }) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [isClicked, setIsClicked] = useState(false);
    const [dayIndex, setDayIndex] = useState(null);

    useEffect(() => {
        const weekDay = daysOfWeek.findIndex(
            (day) => day === Date(weatherInfo.dt * 1000).slice(0, 3)
        );
        setDayIndex(weekDay);
    }, [foreCastInfo]);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const [foreCast, setForeCast] = useState({});

    useEffect(() => {
        if (foreCastInfo.list) {
            setForeCast(
                foreCastInfo.list.filter(
                    (element, index) => (index + 1) % 8 === 0
                )
            );
        }
    }, [foreCastInfo]);

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
            {Object.keys(weatherInfo).length !== 0 &&
            Object.keys(foreCastInfo).length !== 0 ? (
                !isClicked ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
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
                        {foreCast ? (
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
                <p>Loading...</p>
            )}
        </WeatherContainer>
    );
};

export default Weather;

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
    background-color: rgba(255, 255, 255, 0.25);
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
`;
