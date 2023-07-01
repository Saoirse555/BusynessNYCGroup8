import axios from 'axios';

const APIKey = '2f5a644e5e3a4bf1146cb38302f6a2f3';

export const getWeatherData = async () => {
    try {
        const { data } = await axios.get(
            `https://api.openweathermap.org/data/forecast/weather?lat=40.7831&lon=-73.9712&appid=${APIKey}`
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getWeatherForeCast = async () => {
    try {
        const { data } = await axios.get(
            'https://open-weather13.p.rapidapi.com/city/fivedaysforcast/40.7831/-73.9712',
            {
                headers: {
                    'X-RapidAPI-Key':
                        'c275e53d79msh1059f469d07cacdp185536jsn0754183e8e81',
                    'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
                }
            }
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};
