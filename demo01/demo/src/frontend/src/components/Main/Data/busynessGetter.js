import axios from 'axios';

export const getBusyness = async (info) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        // Make an HTTP GET request to retrieve parking station data
        const { data } = await axios.post(
            'http://137.43.49.42/automate_api/v1/prediction',
            info,
            { headers }
        );

        // Log a message indicating that the station data is being retrieved
        console.log('Getting busyness data.');

        // Return the retrieved data
        return data;
        // Log an error message if the request fails
    } catch (error) {
        console.log("Can't get busyness");
    }
};
