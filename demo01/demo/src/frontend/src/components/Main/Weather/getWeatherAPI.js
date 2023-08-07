import axios from 'axios';

// Function to get current weather data
export const getWeatherData = async () => {
    try {
        // Make an HTTP GET request to the OpenWeatherMap API for current weather data
        const { data } = await axios.get(
            `http://137.43.49.42/realtimeWeather`
        );
        // Log a message indicating that the API call was made
        console.log('API Called');
        // Return the retrieved weather data
        return data;
    } catch (error) {
        // Log any errors that occur during the API call
        console.log(error);
    }
};

// Function to get weather forecast data
export const getWeatherForeCast = async () => {
    try {
        // Make an HTTP GET request to the OpenWeatherMap API for weather forecast data
        const { data } = await axios.get(
            `http://137.43.49.42/forecastWeather`
        );
        // Return the retrieved forecast data
        return data;
    } catch (error) {
        // Log any errors that occur during the API call
        console.log(error);
    }
};
