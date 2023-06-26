import './App.css';

// import {getAllStudents} from "./client";
import {getAllLocations} from "./client";
import {useEffect, useState} from "react";

function App() {
    // const [students, setStudents] = useState([]);

    const [locations, setLocations] = useState([]);

    // const fetchStudents = () => {
    //     getAllStudents()
    //         .then(rs => rs.json())
    //         .then(data => {
    //             setStudents(data);
    //             console.log(data);
    //         })
    // };

    const fetchLocations = () => {
        getAllLocations()
            .then(rs => rs.json())
            .then(data => {
                setLocations(data);
                console.log(data);
            })
    }

    useEffect(() => {
        console.log("Component is mounted.");
        // fetchStudents();
        fetchLocations();
    }, []);

    // if (students.length <= 0){
    //     return "no data";
    // }

    if (locations.length <= 0) {
        return "no data";
    }

    return locations.map((locations, index) => {
        return <p key={index}>{locations.locationId} {locations.name}</p>;
    })
}

export default App;
