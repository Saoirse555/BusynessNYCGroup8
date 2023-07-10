import axios from 'axios';

// Function to fetch all locations
export const getAllLocations = async () => {
    try {
        // Make an HTTP GET request to retrieve parking station data
        const { data } = await axios.get('api/v1/parkingstations');

        // Log a message indicating that the station data is being retrieved
        console.log('Getting stations data.');

        // Return the retrieved data
        return data;
        // Log an error message if the request fails
    } catch (error) {
        console.log("Can't get stations");
    }
};