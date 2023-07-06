import axios from 'axios'

export const getAllLocations = async () => {
    try {
        const { data } = await axios.get('api/v1/parkingstations')
        console.log("Getting stations data.")
        return data
    } catch (error) {console.log("Can't get stations")}

}