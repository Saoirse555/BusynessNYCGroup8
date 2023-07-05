import axios from 'axios';

const APIKey = '227c18c04734a077388738019aae8744';

export const getWeatherData = async () => {
    try {
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=40.7831&lon=-73.9712&appid=${APIKey}`
        );
        console.log('API Called');
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getWeatherForeCast = async () => {
    try {
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=40.7831&lon=-73.9712&appid=${APIKey}`
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};
