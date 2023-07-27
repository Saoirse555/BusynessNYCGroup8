import axios from 'axios';

// Function to fetch all locations
// export const getBusyness = async (info) => {
//     axios
//         .post('api/v1/prediction', info)
//         .then((response) => {
//             return response.data;
//         })
//         .catch((error) => {
//             // Handle any errors that occurred during the request
//             console.error('Error:', error);
//         });
// };

export const getBusyness = async (info) => {
    try {
        // Make an HTTP GET request to retrieve parking station data
        const { data } = await axios.post('api/v1/prediction', info);

        // Log a message indicating that the station data is being retrieved
        console.log('Getting busyness data.');

        // Return the retrieved data
        return data;
        // Log an error message if the request fails
    } catch (error) {
        console.log("Can't get busyness");
    }
};
