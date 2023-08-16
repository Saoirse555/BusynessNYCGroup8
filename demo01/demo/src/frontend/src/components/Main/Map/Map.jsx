import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    StandaloneSearchBox,
    InfoWindow,
    GoogleMap,
    LoadScript,
    Marker,
    Circle,
    DirectionsRenderer,
    MarkerClusterer,
    TrafficLayer
} from '@react-google-maps/api';
import geoJsonData from './manhattan.json';
import colors from './color';
import predictionAccuracy from '../Data/predictionAccuracy';
import styled, { css } from 'styled-components';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Weather from '../Weather/Weather';
import parkingMarker from './parking.svg';
import locationMarker from './marker.svg';
import fuelmarker from './fuelmarker.svg';
import evmarker from './evmarker.svg';
import Cookies from 'js-cookie';
import favoritedIcon from './favorited_active.svg';
import notfavoritedIcon from './favorited_empty.svg';
import { Alert, Button } from 'antd';
import Marquee from 'react-fast-marquee';
import { getDistance } from 'geolib';
import fuel_stations from '../Data/fuel_stations.json';
import charging_stations from '../Data/charging_stations.json';
import axios from 'axios';
import { getBusyness } from '../Data/busynessGetter';
import colorPicker from '../Data/colorPicker';
import moreIcon from './forMore.svg';

// Map component
const Map = ({ weatherInfo, foreCastInfo, locationInfo }) => {
    const zoom = 11.5;
    const [map, setMap] = useState(null);
    const [color, setColor] = useState(colors);
    const [value, setValue] = useState(3);

    const inputStartRef = useRef();
    const inputDestRef = useRef();

    const [libraries] = useState(['places', 'marker']);

    const [startLocation, setStartLocation] = useState(null);
    const [destLocation, setDestLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocPosition, setSelectedLocPosition] = useState(null);

    const [parkingIcons, setParkingIcons] = useState(true);
    const [petrolStationIcons, setPetrolStationIcons] = useState(false);
    const [evChargingIcons, setevChargingIcons] = useState(false);

    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [infoWindowPos, setInfoWindowPos] = useState();
    const [infoWindowData, setInfoWindowData] = useState({
        name: '',
        zone: '',
        rate: '',
        zoneID: ''
    });

    //Set the default map location.
    const center = useMemo(() => ({ lat: 40.7826, lng: -73.9656 }), []);

    //Handle when a user enters start location
    const handleStartPlaceChange = async () => {
        // Get the selected start location
        const [startPlace] = inputStartRef.current.getPlaces();
        if (startPlace) {
            const lat = await startPlace.geometry.location.lat();
            const lng = await startPlace.geometry.location.lng();
            setStartLocation({ lat, lng });
        }
    };

    //Handle when a user enters destination location
    const handleDestPlaceChange = async () => {
        // Get the selected destination location
        const [destPlace] = inputDestRef.current.getPlaces();
        if (destPlace) {
            const lat = await destPlace.geometry.location.lat();
            const lng = await destPlace.geometry.location.lng();
            // console.log('end: ', { lat }, { lng });
            setDestLocation({ lat, lng });
        }
    };

    const [geoJsonLayer, setGeoJsonLayer] = useState(null);

    const onLoad = (map) => {
        // Remove the old GeoJSON layer if it exists
        if (geoJsonLayer) {
            geoJsonLayer.setMap(null);
        }

        if (map) {
            setIsLoading(false);
            const newGeoJsonLayer = new window.google.maps.Data();
            newGeoJsonLayer.addGeoJson(geoJsonData);
            newGeoJsonLayer.setStyle((feature) => {
                const locationId = feature.getProperty('location_id');

                if (color) {
                    return {
                        fillColor: color[locationId],
                        strokeWeight: 0.25,
                        fillOpacity: 0.25
                    };
                } else {
                    return {
                        fillColor: colors[locationId],
                        strokeWeight: 0.25,
                        fillOpacity: 0.25
                    };
                }
            });
            newGeoJsonLayer.setMap(map);

            // Set the newGeoJsonLayer in the state for future reference
            setGeoJsonLayer(newGeoJsonLayer);

            // Show info window for the clicked location
            newGeoJsonLayer.addListener('click', async (e) => {
                setShowInfoWindow(false);
                setUserInputShow(false);
                setSelectedLocPosition({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });

                setSelectedLocation(e.feature.getProperty('location_id'));
            });
        }
    };

    useEffect(() => {
        if (map) {
            onLoad(map);
        }
    }, [map]);

    useEffect(() => {
        onLoad(map);
    }, [color]);

    // Defines the boundaries for the search options
    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1
    };

    // Specifies the options for the StandaloneSearchBox component
    const SearchOptions = {
        bounds: defaultBounds,
        componentRestrictions: {
            country: 'us'
        }
    };

    /* If map and startLocation have values
       the map pans to the startLocation and sets the directions state to null.*/
    useEffect(() => {
        if (map && startLocation) {
            map.panTo(startLocation);
            map.setZoom(15);
            setDirections(null);
        }
    }, [map, startLocation]);

    /* If map and destLocation have values
      the map pans to the destLocation and sets the directions state to null.*/
    useEffect(() => {
        if (map && destLocation) {
            map.panTo(destLocation);
            map.setZoom(15);
            setDirections(null);
        }
    }, [map, destLocation]);

    // Initializes the directions state variable using the useState hook. It is initially set to undefined.
    const [directions, setDirections] = useState(null);

    // Handles the case when the user presses Enter with an empty input field
    const handleEmptyCase = (e) => {
        if (e.key === 'Enter' && e.target.value === '') {
            setWayPoint([]);
            setWayPointType('');
            if (e.target.id === 'start-input') {
                setDirections(null);
                setStartLocation(null);
            } else {
                setDirections(null);
                setDestLocation(null);
            }
        }
    };

    const [travelDuration, setTravelDuration] = useState(null);

    // Fetches the directions using the DirectionsService
    const fetchDirections = (start, end) => {
        if (!start || !end) return;
        const service = new window.google.maps.DirectionsService();

        service.route(
            {
                origin: start,
                destination: end,
                waypoints: wayPoint,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    setDirections(result);
                    displayTravelTime(result);
                }
            }
        );
    };

    const displayTravelTime = (directions) => {
        const travelDuration = directions.routes[0]?.legs[0]?.duration.text;
        setTravelDuration(travelDuration);
    };

    const startInputRef = useRef(null);
    const destInputRef = useRef(null);

    // Handles the dragging of markers and updates their positions and addresses
    const handleDrag = (e, marker_id) => {
        const { latLng } = e;
        const lat = latLng.lat();
        const lng = latLng.lng();
        if (marker_id === 'start-marker') {
            setStartLocation({ lat, lng });
        } else {
            setDestLocation({ lat, lng });
        }

        // Reverse geocoding to get the address from the new position
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results.length > 0) {
                const address = results[0].formatted_address;
                console.log('New Address', address);
                if (marker_id === 'start-marker') {
                    startInputRef.current.value = address;
                } else {
                    destInputRef.current.value = address;
                }
            } else {
                console.error('Geocoder error:', status);
            }
        });
    };

    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedHour, setSelectedHour] = useState(0);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Sets the selected day and hour based on weather and forecast information
    useEffect(() => {
        if (weatherInfo !== {} || foreCastInfo !== {}) {
            const today = Date(weatherInfo.dt * 1000).slice(0, 10);
            const time = Date(weatherInfo.dt * 1000).slice(16, 18);
            const index = daysOfWeek.findIndex(
                (day) => day === today.slice(0, 3)
            );
            setSelectedDayIndex(parseInt(index));
            setSelectedDay(0);
            setSelectedHour(parseInt(time));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherInfo, foreCastInfo]);

    // Handles the change of selected day
    const handleDayChange = (e) => {
        const pickedDay = e.target.value;
        setSelectedDay(pickedDay);
    };

    // Handles the change of selected hour
    const handleHourChange = (e) => {
        const pickedHour = e.target.value;
        setSelectedHour(pickedHour);
    };

    const getModelInput = async () => {
        console.log('getModelInput called', foreCastInfo.list.length);
        if (
            foreCastInfo.list
            // && selectedHour && selectedDay
        ) {
            const timeStamp = foreCastInfo.list[selectedDay * 8].dt;
            const weather = foreCastInfo.list[selectedDay * 8];
            const hour = parseInt(selectedHour); //0 to 23
            const date = new Date(timeStamp * 1000);
            const month = date.getMonth() + 1; //1 to 12
            const day = date.getDate(); //1 to 31
            const day_of_week = (date.getDay() + 5) % 7; //Sunday is 6
            const vis = weather.visibility / 1000; //in km
            const wind_spd = weather.wind.speed; // in m/s
            const temp = parseFloat((weather.main.temp - 273.15).toFixed(2)); //in deg C
            let precip = 0;
            if (weather.rain) {
                precip = weather.rain['1h'];
            }

            const modelInput = {
                hour: hour,
                month: month,
                day: day - 1,
                day_of_week: day_of_week,
                wind_spd: wind_spd,
                vis: vis,
                precip: precip,
                temp: temp
            };

            console.log({ modelInput });
            try {
                const model_output = await getBusyness(
                    JSON.stringify(modelInput)
                ).then((data) => data);
                return model_output;
            } catch (error) {
                console.log('Error in getting busyness');
            }
        } else {
            console.log(
                'Something went wrong...',
                foreCastInfo,
                selectedDay,
                selectedHour
            );
        }
    };

    const fetchBusyness = async () => {
        console.log('fetchBusyness called');
        try {
            const data = await getModelInput();
            const updatedColor = processColorData(data);
            console.log({ updatedColor });
            setColor(updatedColor);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching busyness data:', error);
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log({ isLoading });
    }, [isLoading]);

    useEffect(() => {
        setIsLoading(true);
        fetchBusyness();
        console.log(
            'Running model on day/hour change: ',
            selectedDay,
            selectedHour
        );
    }, [selectedDay, selectedHour, foreCastInfo]);

    const processColorData = (array) => {
        const colorPicker = {
            'VERY LOW': '#00FF00',
            LOW: '#ADFF2F',
            MEDIUM: '#FFFF00',
            HIGH: '#FFA500',
            'VERY HIGH': '#FF0000'
        };

        if (!array) return;
        const busynessArray = {};
        for (const busynessPerLocation of array) {
            busynessArray[busynessPerLocation.location] =
                colorPicker[busynessPerLocation.level];
        }
        // console.log({ busynessArray });
        return busynessArray;
    };

    // Handles the click on a car park marker and displays the info window
    const handleCarParkClick = (locationInfo) => {
        setSelectedLocation(null);
        const lat = locationInfo.coordinate.latitude;
        const lng = locationInfo.coordinate.longitude;

        if (directions === null) {
            //Set the info window position on the map. Adding a tiny bit to lat displayes it just above the parking icon...
            setShowInfoWindow(true);
            setInfoWindowPos({ lat: lat, lng: lng });
            const name = locationInfo.parkingStationName;
            const zone = locationInfo.rateZone;
            const rate = locationInfo.zoneInfo;
            const zoneID = locationInfo.locationId;
            setInfoWindowData((previousLocation) => ({
                ...previousLocation,
                name: name,
                zone: zone,
                rate: rate,
                zoneID: zoneID,
                type: 'carPark'
            }));
        } else {
            setDestLocation({ lat, lng });
        }
    };

    const handleFuelMarkerClick = (station) => {
        setSelectedLocation(null);
        const lat = station.coordinates[1];
        const lng = station.coordinates[0];
        //Set the info window position on the map. Adding a tiny bit to lat displayes it just above the parking icon...
        if (directions === null) {
            setShowInfoWindow(true);
            setInfoWindowPos({ lat: lat, lng: lng });
            const name = station.name;
            const operator = station.operator;
            const zoneID = station.location_id;
            const type = station.amenity;
            setInfoWindowData((previousLocation) => ({
                ...previousLocation,
                name: name,
                operator: operator,
                zoneID: zoneID,
                type: type
            }));
        } else {
            //Clear the old way point
            setWayPoint([]);
            setWayPointType('');
            //Set the new waypoint
            setWayPointType('fuelStation');
            setWayPoint([{ location: { lat: lat, lng: lng } }]);
        }
    };

    const handleEvMarkerClick = (station) => {
        setSelectedLocation(null);
        const lat = station.coordinates[1];
        const lng = station.coordinates[0];
        //Set the info window position on the map. Adding a tiny bit to lat displayes it just above the parking icon...
        if (directions === null) {
            setShowInfoWindow(true);
            setInfoWindowPos({ lat: lat, lng: lng });
            const name = station.name;
            const operator = station.operator;
            const zoneID = station.location_id;
            const type = station.amenity;
            setInfoWindowData((previousLocation) => ({
                ...previousLocation,
                name: name,
                operator: operator,
                zoneID: zoneID,
                type: type
            }));
        } else {
            //Clear the old way point
            setWayPoint([]);
            setWayPointType('');
            //Set a new way point
            setWayPointType('evStation');
            setWayPoint([{ location: { lat: lat, lng: lng } }]);
        }
    };

    const geoCoder = (place) => {
        return new Promise((resolve, reject) => {
            const lat = place.lat;
            const lng = place.lng;
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    const address = results[0].formatted_address;
                    resolve(address); // Resolve the promise with the address
                } else {
                    console.error('Geocoder error:', status);
                    reject(status); // Reject the promise with the error status
                }
            });
        });
    };

    const [favCookie, setFavCookie] = useState([]);

    const getFavoriteFromCookie = () => {
        const favoritesJSON = Cookies.get('favorites');
        if (favoritesJSON) {
            return JSON.parse(favoritesJSON);
        }
        return [];
    };

    useEffect(() => {
        const fav = getFavoriteFromCookie();
        setFavCookie(fav);
    }, []);

    const addFavoritePlace = async (place) => {
        const favorites = getFavoriteFromCookie();
        console.log('Favorites before removal: ', favorites);
        const address = await geoCoder(place);
        if (address !== undefined) {
            if (
                favorites.some(
                    (places) =>
                        places.lat === place.lat && places.lng === place.lng
                )
            ) {
                console.log('Removing from fav list');
                const updatedArray = favorites.filter(
                    (obj) => obj.lat !== place.lat && obj.lng !== place.lng
                );
                Cookies.set('favorites', JSON.stringify(updatedArray), {
                    SameSite: 'Strict',
                    secure: true,
                    expires: 30
                });

                setFavCookie(updatedArray);
                return;
            } else {
                console.log('Adding this to fav list');
                const element = {
                    lat: place.lat,
                    lng: place.lng,
                    address: address
                };
                favorites.push(element);
                Cookies.set('favorites', JSON.stringify(favorites), {
                    expires: 30
                });
                setFavCookie(favorites);

                return;
            }
        }
    };

    const handleAddFavorite = (location) => {
        addFavoritePlace(location);
    };

    const [showFavorites, setShowFavorites] = useState(false);

    const handleShowFavorites = () => {
        if (!showFavorites) {
            setShowFavorites(true);
            setShowRecommended(false);
        } else {
            setShowFavorites(false);
        }
    };

    const handleFavClick = (location) => {
        if (location.lat) {
            const lat = location.lat;
            const lng = location.lng;
            map.panTo({ lat: lat, lng: lng });
            map.setZoom(17);
        } else {
            const lat = location.coordinate.latitude;
            const lng = location.coordinate.longitude;
            map.panTo({ lat: lat, lng: lng });
            map.setZoom(17);
        }
    };

    const [sliderValue, setSliderValue] = useState(100);

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);
    };

    const [recommendArray, setRecommendArray] = useState([]);
    const [threeClosestParks, setThreeClosestParks] = useState([]);

    useEffect(() => {
        const recommended = [];
        if (locationInfo) {
            locationInfo.map((location, index) => {
                if (destLocation) {
                    const distanceA = getDistance(
                        {
                            latitude: destLocation.lat,
                            longitude: destLocation.lng
                        },
                        {
                            latitude: location.coordinate.latitude,
                            longitude: location.coordinate.longitude
                        }
                    );
                    if (distanceA < sliderValue) {
                        recommended.push(location);
                    }
                }
            });
        }
        setRecommendArray(recommended);
    }, [sliderValue, destLocation, locationInfo]);

    useEffect(() => {
        const sortArray = [...recommendArray].sort((a, b) => {
            if (destLocation) {
                const distA = getDistance(
                    {
                        latitude: destLocation.lat,
                        longitude: destLocation.lng
                    },
                    {
                        latitude: a.coordinate.latitude,
                        longitude: a.coordinate.longitude
                    }
                );
                const distB = getDistance(
                    {
                        latitude: destLocation.lat,
                        longitude: destLocation.lng
                    },
                    {
                        latitude: b.coordinate.latitude,
                        longitude: b.coordinate.longitude
                    }
                );
                return distA - distB;
            }
            return '';
        });
        setThreeClosestParks(sortArray.slice(0, 5));
    }, [recommendArray, destLocation]);

    const [showRecommended, setShowRecommended] = useState(false);

    const handleShowRecommended = () => {
        if (!showRecommended) {
            setShowRecommended(true);
            setShowFavorites(false);
        } else {
            setShowRecommended(false);
        }
    };

    const [wayPoint, setWayPoint] = useState([]);
    const [wayPointType, setWayPointType] = useState('');

    useEffect(() => {
        fetchDirections(startLocation, destLocation);
    }, [wayPoint]);

    //section for getting traffic alert data from 511NY
    const [alertData, setAlertData] = useState({ login: '1111' });

    const getAlertData = async () => {
        try {
            // Make an HTTP GET request to the 511ny API for current alert data
            const { data } = await axios.get(
                `http://137.43.49.42/automate_api/v1/get_alert`
            );
            return data;
        } catch (error) {
            // Log any errors that occur during the API call
            console.log('Error occured while fetching live info: ', error);
        }
    };

    const fetchAlertData = () => {
        getAlertData().then((data) => setAlertData(data));
    };

    useEffect(() => {
        fetchAlertData();
        const intervalId = setInterval(() => {
            fetchAlertData();
        }, 3600000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const percentageColorCoder = (percent) => {
        const rd = -2.55 * percent + 255;
        const grn = 2.55 * percent;
        return [rd, grn, 0];
    };

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
    };

    const [userInputShow, setUserInputShow] = useState(false);
    useEffect(() => {
        console.log({ userInputShow });
    }, [userInputShow]);

    return (
        <PageContainer id="main">
            <PageHeader>
                <PageTitle>
                    <TitleMarker src="./img/icon.png" />
                    <List>
                        <ListItem>
                            <a href="#home">Home</a>
                        </ListItem>
                        <ListItem>
                            <a href="#main">Map</a>
                        </ListItem>
                        <ListItem>
                            <a href="#about">About Us</a>
                        </ListItem>
                    </List>
                </PageTitle>
                <Button2 onClick={scrollToContact}>Contact</Button2>
            </PageHeader>

            <Container>
                {/* codes for alert data display */}
                <LoadScript
                    googleMapsApiKey="AIzaSyDQxFVWqXZ4sTsX7_Zsf6Hio3J4nr7_wgY"
                    libraries={libraries}
                >
                    <Left toShow={userInputShow}>
                        <Alert
                            banner
                            message={
                                <Marquee pauseOnHover gradient={false}>
                                    {alertData === undefined && (
                                        <li>
                                            There are currently no emergency
                                            alerts at this time.
                                        </li>
                                    )}
                                    {alertData !== undefined && alertData.length
                                        ? alertData[0].Description +
                                          {} +
                                          alertData[1].Description
                                        : ''}
                                </Marquee>
                            }
                        />

                        <Busynesscheck>
                            <p
                                style={{
                                    fontFamily: 'Roboto',
                                    fontWeight: '500'
                                }}
                            >
                                Check Busyness
                            </p>
                            <Selector>
                                <DaySelector
                                    value={selectedDay}
                                    onChange={handleDayChange}
                                >
                                    {[...Array(5)].map((_, index) => (
                                        <option key={index} value={index}>
                                            {
                                                daysOfWeek[
                                                    (selectedDayIndex + index) %
                                                        7
                                                ]
                                            }
                                        </option>
                                    ))}
                                </DaySelector>
                                <HourSelector
                                    value={selectedHour}
                                    onChange={handleHourChange}
                                >
                                    {[...Array(24)].map((_, index) => (
                                        <option key={index} value={index}>
                                            {index.toString().padStart(2, '0')}{' '}
                                            : 00
                                        </option>
                                    ))}
                                </HourSelector>
                            </Selector>
                        </Busynesscheck>

                        <InputContainer>
                            <ContentContainer>
                                <SearchBoxContainer>
                                    <StandaloneSearchBox
                                        options={SearchOptions}
                                        onLoad={(ref) =>
                                            (inputStartRef.current = ref)
                                        }
                                        onPlacesChanged={handleStartPlaceChange}
                                    >
                                        <StartInput
                                            id="start-input"
                                            type="text"
                                            placeholder="Search start..."
                                            onKeyDown={handleEmptyCase}
                                            ref={startInputRef}
                                        />
                                    </StandaloneSearchBox>
                                    <StandaloneSearchBox
                                        options={SearchOptions}
                                        onLoad={(ref) =>
                                            (inputDestRef.current = ref)
                                        }
                                        onPlacesChanged={handleDestPlaceChange}
                                    >
                                        <EndInput
                                            id="end-input"
                                            type="text"
                                            placeholder="Search destination..."
                                            onKeyDown={handleEmptyCase}
                                            ref={destInputRef}
                                        />
                                    </StandaloneSearchBox>
                                </SearchBoxContainer>
                                <ButtonContainer>
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            fetchDirections(
                                                startLocation,
                                                destLocation
                                            )
                                        }
                                    >
                                        See Route
                                    </Button>
                                </ButtonContainer>
                            </ContentContainer>
                        </InputContainer>

                        <Traveltime>
                            {travelDuration && (
                                <p>
                                    Estimated travelling time: {travelDuration}
                                </p>
                            )}
                        </Traveltime>

                        <AmenitiesContainer>
                            <CarParks
                                background={parkingIcons}
                                onClick={() => setParkingIcons(!parkingIcons)}
                            >
                                <LocalParkingIcon color={'info'} />
                            </CarParks>
                            <PetrolStations
                                background={petrolStationIcons}
                                onClick={() =>
                                    setPetrolStationIcons(!petrolStationIcons)
                                }
                            >
                                <LocalGasStationIcon color={'error'} />
                            </PetrolStations>
                            <EVCharging
                                background={evChargingIcons}
                                onClick={() =>
                                    setevChargingIcons(!evChargingIcons)
                                }
                            >
                                <EvStationIcon color={'success'} />
                            </EVCharging>
                        </AmenitiesContainer>

                        <RangeText>
                            {destLocation
                                ? 'Choose distance to check car parks near destination.'
                                : 'See car parks near your destination.'}
                        </RangeText>

                        <RangeSlider
                            type="range"
                            min={0}
                            max={1000}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            disabled={destLocation ? false : true}
                        />
                        <SliderValue>Value: {sliderValue}m</SliderValue>

                        <FavoritesContainer>
                            <ShowFavorites
                                background={showFavorites}
                                onClick={handleShowFavorites}
                            >
                                Show Favorites
                            </ShowFavorites>
                            <ShowRecommended
                                background={showRecommended}
                                onClick={handleShowRecommended}
                            >
                                Show Recommended
                            </ShowRecommended>
                            <ListOfFavorites>
                                {showFavorites &&
                                    (favCookie.length > 0 ? (
                                        favCookie.map((location, index) => (
                                            <FavoritesDiv
                                                key={index}
                                                onClick={() =>
                                                    handleFavClick(location)
                                                }
                                            >
                                                <img
                                                    style={{
                                                        width: 'auto',
                                                        height: '100%',
                                                        marginRight: '15px'
                                                    }}
                                                    src={parkingMarker}
                                                    alt="liked place"
                                                />
                                                <span>{location.address}</span>
                                            </FavoritesDiv>
                                        ))
                                    ) : (
                                        <EmptyCookieText>
                                            No favorites to show.
                                        </EmptyCookieText>
                                    ))}
                                {showRecommended &&
                                    (destLocation &&
                                    threeClosestParks.length > 0 ? (
                                        threeClosestParks.map(
                                            (location, index) => (
                                                <FavoritesDiv
                                                    key={index}
                                                    onClick={() =>
                                                        handleFavClick(location)
                                                    }
                                                >
                                                    {' '}
                                                    {index + 1}
                                                    {'.'}
                                                    <img
                                                        style={{
                                                            width: 'auto',
                                                            height: '100%',
                                                            marginRight: '15px',
                                                            paddingLeft: '20px'
                                                        }}
                                                        src={parkingMarker}
                                                        alt="liked place"
                                                    />
                                                    <span>
                                                        {
                                                            location.parkingStationName
                                                        }{' '}
                                                        car park -{' '}
                                                        {getDistance(
                                                            {
                                                                latitude:
                                                                    destLocation.lat,
                                                                longitude:
                                                                    destLocation.lng
                                                            },
                                                            {
                                                                latitude:
                                                                    location
                                                                        .coordinate
                                                                        .latitude,
                                                                longitude:
                                                                    location
                                                                        .coordinate
                                                                        .longitude
                                                            }
                                                        )}{' '}
                                                        m away
                                                    </span>
                                                </FavoritesDiv>
                                            )
                                        )
                                    ) : (
                                        <EmptyCookieText>
                                            No car park within set radius or
                                            destination has not been set.
                                        </EmptyCookieText>
                                    ))}
                            </ListOfFavorites>
                        </FavoritesContainer>
                        {!showFavorites && !showRecommended && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            ></div>
                        )}
                    </Left>

                    <Right>
                        <ToggleLeft
                            toShow={userInputShow}
                            onClick={() => setUserInputShow(!userInputShow)}
                        >
                            <img
                                src={moreIcon}
                                alt="click for more"
                                style={{ width: '36px', height: '36px' }}
                            />
                        </ToggleLeft>

                        <Weather
                            weatherInfo={weatherInfo}
                            foreCastInfo={foreCastInfo}
                        />
                        <GoogleMap
                            onClick={() => (
                                setShowInfoWindow(false),
                                setUserInputShow(false)
                            )}
                            center={center}
                            zoom={zoom}
                            mapContainerStyle={{
                                height: '100%',
                                width: '100%',
                                zIndex: 1
                            }}
                            // onLoad={setMap}
                            onLoad={setMap}
                            options={{
                                disableDefaultUI: true,
                                clickableIcons: false,
                                mapId: 'cbd44d8f8f1a5330',
                                disableAutoPan: true
                            }}
                            tilt={35}
                        >
                            {startLocation && (
                                <Marker
                                    icon={{
                                        url: locationMarker,
                                        scaledSize: {
                                            height: 64,
                                            width: 32
                                        },
                                        anchor: {
                                            x: 15.5,
                                            y: 50
                                        }
                                    }}
                                    position={startLocation}
                                    draggable={true}
                                    onDragEnd={(e) =>
                                        handleDrag(e, 'start-marker')
                                    }
                                    onClick={() => {
                                        fetchDirections(
                                            startLocation,
                                            destLocation
                                        );
                                    }}
                                    key={'start-marker'}
                                />
                            )}
                            {destLocation && (
                                <>
                                    <Marker
                                        icon={{
                                            url: locationMarker,
                                            scaledSize: {
                                                height: 64,
                                                width: 32
                                            },
                                            anchor: {
                                                x: 15.5,
                                                y: 50
                                            }
                                        }}
                                        draggable={true}
                                        onDragEnd={(e) =>
                                            handleDrag(e, 'end-marker')
                                        }
                                        key={'end-marker'}
                                        position={destLocation}
                                        onClick={() => {
                                            fetchDirections(
                                                startLocation,
                                                destLocation
                                            );
                                        }}
                                    />

                                    <Circle
                                        center={destLocation}
                                        radius={sliderValue}
                                        options={rangeCircle}
                                    />
                                </>
                            )}
                            {directions && (
                                <DirectionsRenderer
                                    directions={directions}
                                    options={{
                                        suppressMarkers: true,
                                        polylineOptions: {
                                            zIndex: 13,
                                            strokeColor: '#41a0ff',
                                            strokeWeight: 7
                                        }
                                    }}
                                />
                            )}
                            {selectedLocation && (
                                <InfoWindow
                                    position={selectedLocPosition}
                                    onCloseClick={() =>
                                        setSelectedLocation(null)
                                    }
                                    options={{ disableAutoPan: true }}
                                >
                                    <>
                                        <h3>Location ID: {selectedLocation}</h3>
                                        <br />
                                        <h4>
                                            Area Busyness:
                                            <span style={{ fontWeight: '100' }}>
                                                {color ? (
                                                    color[selectedLocation] ===
                                                    '#FF0000' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Heavy
                                                        </span>
                                                    ) : color[
                                                          selectedLocation
                                                      ] === '#FFA500' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Heavy
                                                        </span>
                                                    ) : color[
                                                          selectedLocation
                                                      ] === '#FFFF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'orange'
                                                            }}
                                                        >
                                                            {' '}
                                                            Moderate
                                                        </span>
                                                    ) : color[
                                                          selectedLocation
                                                      ] === '#ADFF2F' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: '#00FF00'
                                                            }}
                                                        >
                                                            {' '}
                                                            Light
                                                        </span>
                                                    ) : color[
                                                          selectedLocation
                                                      ] === '#00FF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Light
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {' '}
                                                            Unknown
                                                        </span>
                                                    )
                                                ) : (
                                                    ''
                                                )}{' '}
                                            </span>
                                        </h4>

                                        <br />
                                        <h4>
                                            {'Prediction Accuracy: '}
                                            <span
                                                style={{
                                                    fontWeight: '500',
                                                    color: colorPicker[
                                                        predictionAccuracy[
                                                            selectedLocation
                                                        ]
                                                    ]
                                                }}
                                            >
                                                {
                                                    predictionAccuracy[
                                                        selectedLocation
                                                    ]
                                                }
                                            </span>
                                        </h4>
                                    </>
                                </InfoWindow>
                            )}
                            {locationInfo?.length &&
                                parkingIcons &&
                                !destLocation && (
                                    <MarkerClusterer>
                                        {(clusterer) =>
                                            locationInfo.map(
                                                (carPark, index) => (
                                                    <Marker
                                                        onClick={() =>
                                                            handleCarParkClick(
                                                                carPark
                                                            )
                                                        }
                                                        clusterer={clusterer}
                                                        icon={{
                                                            url: parkingMarker,
                                                            scaledSize: {
                                                                height: 64,
                                                                width: 32
                                                            }
                                                        }}
                                                        key={index}
                                                        position={{
                                                            lat: carPark
                                                                .coordinate
                                                                .latitude,
                                                            lng: carPark
                                                                .coordinate
                                                                .longitude
                                                        }}
                                                    />
                                                )
                                            )
                                        }
                                    </MarkerClusterer>
                                )}

                            {locationInfo?.length &&
                                destLocation &&
                                locationInfo.map((carPark, index) =>
                                    Number(
                                        getDistance(
                                            {
                                                latitude: destLocation.lat,
                                                longitude: destLocation.lng
                                            },
                                            {
                                                latitude:
                                                    carPark.coordinate.latitude,
                                                longitude:
                                                    carPark.coordinate.longitude
                                            }
                                        )
                                    ) < sliderValue ? (
                                        <Marker
                                            onClick={() =>
                                                handleCarParkClick(carPark)
                                            }
                                            icon={{
                                                url: parkingMarker,
                                                scaledSize: {
                                                    height: 64,
                                                    width: 32
                                                }
                                            }}
                                            key={index}
                                            position={{
                                                lat: carPark.coordinate
                                                    .latitude,
                                                lng: carPark.coordinate
                                                    .longitude
                                            }}
                                        />
                                    ) : (
                                        ''
                                    )
                                )}

                            {showInfoWindow && (
                                <InfoWindow
                                    position={infoWindowPos}
                                    onCloseClick={() =>
                                        setShowInfoWindow(false)
                                    }
                                >
                                    <>
                                        {infoWindowData.type === 'carPark' && (
                                            <CarParkInfoWindow>
                                                <h3>Car Park Name: </h3>
                                                {infoWindowData.name}
                                                <br />
                                                <br />
                                                <h4>Zone: </h4>
                                                {infoWindowData.zone}
                                                <br />
                                                <br />
                                                <h4>Rate: </h4>
                                                {infoWindowData.rate}
                                                <br />
                                                <br />
                                                <h4>Area Busyness: </h4>
                                                {color ? (
                                                    color[
                                                        infoWindowData.zoneID
                                                    ] === '#FF0000' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFA500' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFFF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'orange'
                                                            }}
                                                        >
                                                            {' '}
                                                            Moderate
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#ADFF2F' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Light
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#00FF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Light
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {' '}
                                                            Unknown
                                                        </span>
                                                    )
                                                ) : (
                                                    ''
                                                )}{' '}
                                                <br />
                                                <br />
                                                <h4>
                                                    {'Prediction Accuracy: '}
                                                    <span
                                                        style={{
                                                            fontWeight: '500',
                                                            color: colorPicker[
                                                                predictionAccuracy[
                                                                    infoWindowData
                                                                        .zoneID
                                                                ]
                                                            ]
                                                        }}
                                                    >
                                                        {
                                                            predictionAccuracy[
                                                                infoWindowData
                                                                    .zoneID
                                                            ]
                                                        }
                                                    </span>
                                                </h4>
                                                <LikeButton
                                                    onClick={() =>
                                                        handleAddFavorite(
                                                            infoWindowPos
                                                        )
                                                    }
                                                >
                                                    {favCookie.some(
                                                        (obj) =>
                                                            obj.lat ===
                                                                infoWindowPos.lat &&
                                                            obj.lng ===
                                                                infoWindowPos.lng
                                                    ) ? (
                                                        <>
                                                            <img
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    marginRight:
                                                                        '15px'
                                                                }}
                                                                src={
                                                                    favoritedIcon
                                                                }
                                                                alt="liked place"
                                                            />
                                                            <span>
                                                                Favorited
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    marginRight:
                                                                        '15px'
                                                                }}
                                                                src={
                                                                    notfavoritedIcon
                                                                }
                                                                alt="didnt like place"
                                                            />
                                                            <span>
                                                                Not favorited
                                                            </span>
                                                        </>
                                                    )}
                                                </LikeButton>
                                            </CarParkInfoWindow>
                                        )}
                                        {infoWindowData.type === 'fuel' && (
                                            <CarParkInfoWindow>
                                                <h3>Petrol Station Name: </h3>
                                                {infoWindowData.name}
                                                <br />
                                                <br />
                                                <h4>Operator: </h4>
                                                {infoWindowData.operator}
                                                <br />
                                                <h4>Area Busyness: </h4>

                                                {color ? (
                                                    color[
                                                        infoWindowData.zoneID
                                                    ] === '#FF0000' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFA500' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFFF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'orange'
                                                            }}
                                                        >
                                                            {' '}
                                                            Moderate
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#ADFF2F' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Light
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#00FF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Light
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {' '}
                                                            Unknown
                                                        </span>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                                <br />
                                                <h4>
                                                    {'Prediction Accuracy: '}
                                                    <span
                                                        style={{
                                                            fontWeight: '500',
                                                            color: colorPicker[
                                                                predictionAccuracy[
                                                                    infoWindowData
                                                                        .zoneID
                                                                ]
                                                            ]
                                                        }}
                                                    >
                                                        {
                                                            predictionAccuracy[
                                                                infoWindowData
                                                                    .zoneID
                                                            ]
                                                        }
                                                    </span>
                                                </h4>
                                            </CarParkInfoWindow>
                                        )}
                                        {infoWindowData.type ===
                                            'charging_station' && (
                                            <CarParkInfoWindow>
                                                <h3>EV Station Name: </h3>
                                                {infoWindowData.name}
                                                <h4>Operator: </h4>
                                                {infoWindowData.operator}
                                                <h4>Area Busyness: </h4>
                                                {color ? (
                                                    color[
                                                        infoWindowData.zoneID
                                                    ] === '#FF0000' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFA500' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {' '}
                                                            Heavy
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#FFFF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'orange'
                                                            }}
                                                        >
                                                            {' '}
                                                            Moderate
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#ADFF2F' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Light
                                                        </span>
                                                    ) : color[
                                                          infoWindowData.zoneID
                                                      ] === '#00FF00' ? (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'green'
                                                            }}
                                                        >
                                                            {' '}
                                                            Very Light
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                                color: 'black'
                                                            }}
                                                        >
                                                            {' '}
                                                            Unknown
                                                        </span>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                                <br />

                                                <h4>
                                                    {'Prediction Accuracy: '}
                                                    <span
                                                        style={{
                                                            fontWeight: '500',
                                                            color: colorPicker[
                                                                predictionAccuracy[
                                                                    infoWindowData
                                                                        .zoneID
                                                                ]
                                                            ]
                                                        }}
                                                    >
                                                        {
                                                            predictionAccuracy[
                                                                infoWindowData
                                                                    .zoneID
                                                            ]
                                                        }
                                                    </span>
                                                </h4>
                                            </CarParkInfoWindow>
                                        )}
                                    </>
                                </InfoWindow>
                            )}

                            {fuel_stations?.length &&
                                petrolStationIcons &&
                                wayPointType === '' &&
                                fuel_stations.map((station, index) => (
                                    <Marker
                                        onClick={() =>
                                            handleFuelMarkerClick(station)
                                        }
                                        icon={{
                                            url: fuelmarker,
                                            scaledSize: {
                                                height: 56,
                                                width: 28
                                            }
                                        }}
                                        key={index}
                                        position={{
                                            lat: station.coordinates[1],
                                            lng: station.coordinates[0]
                                        }}
                                    />
                                ))}

                            {charging_stations?.length &&
                                evChargingIcons &&
                                wayPointType === '' &&
                                charging_stations.map((station, index) => (
                                    <Marker
                                        onClick={() =>
                                            handleEvMarkerClick(station)
                                        }
                                        icon={{
                                            url: evmarker,
                                            scaledSize: {
                                                height: 56,
                                                width: 28
                                            }
                                        }}
                                        key={index}
                                        position={{
                                            lat: station.coordinates[1],
                                            lng: station.coordinates[0]
                                        }}
                                    />
                                ))}

                            {wayPointType === 'evStation' && (
                                <Marker
                                    icon={{
                                        url: evmarker,
                                        scaledSize: {
                                            height: 56,
                                            width: 28
                                        }
                                    }}
                                    position={{
                                        lat: wayPoint[0].location.lat,
                                        lng: wayPoint[0].location.lng
                                    }}
                                />
                            )}
                            {wayPointType === 'fuelStation' && (
                                <Marker
                                    icon={{
                                        url: fuelmarker,
                                        scaledSize: {
                                            height: 56,
                                            width: 28
                                        }
                                    }}
                                    position={{
                                        lat: wayPoint[0].location.lat,
                                        lng: wayPoint[0].location.lng
                                    }}
                                />
                            )}

                            <TrafficLayer autoUpdate />
                        </GoogleMap>
                        <MapBlurLayer isLoading={isLoading}>
                            {isLoading ? 'Loading...' : null}
                        </MapBlurLayer>
                    </Right>
                </LoadScript>
            </Container>
        </PageContainer>
    );
};

export default Map;

const ToggleLeft = styled.div`
    display: none;
    position: absolute;
    justify-content: center;
    align-items: center;
    z-index: 10;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(20px);

    top: ${(props) => (props.toShow ? '' : '20px')};
    left: ${(props) => (props.toShow ? '' : '20px')};
    right: ${(props) => (props.toShow ? '30px' : '')};
    bottom: ${(props) => (props.toShow ? '400px' : '')};
    @media screen and (max-width: 900px) {
        display: ${(props) => (props.toShow ? 'none' : 'flex')};
        z-index: 30;
    }
`;

const MapBlurLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    background-color: ${(props) =>
        props.isLoading ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)'};
    z-index: 2;
    backdrop-filter: ${(props) => (props.isLoading ? 'blur(20px)' : 'none')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: white;
    pointer-events: none; /* Prevent clicks on the overlay */
    font-family: Roboto;
    font-weight: 100;
`;

const EmptyCookieText = styled.p`
    font-family: Roboto;
    font-weight: 100;
`;

const RangeSlider = styled.input`
    margin-left: 30px;
    margin-top: 10px;
    width: 350px;
`;

const RangeText = styled.h4`
    margin-top: 10px;
    margin-left: 30px;
    font-weight: bold;
    font-family: Arial;
    font-weight: 100;
`;

const SliderValue = styled.span`
    margin-left: 30px;
    font-weight: bold;
    display: block;
    font-size: 16px;
    font-family: Arial;
    font-weight: 100;
`;

const ListOfFavorites = styled.div`
    margin-top: 30px;
    padding: 0px 0px;
    max-height: 200px;
    overflow-y: auto;
    @media screen and (max-width: 900px) {
        max-height: 200px;
    }
    @media screen and (max-width: 400px) {
        max-height: 132px;
        margin-top: 5px;
    }
`;

const FavoritesDiv = styled.div`
    cursor: pointer;
    height: 68px;
    background-color: aliceblue;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    font-family: Roboto;
    font-weight: 100;
    margin: 10px 20px;
    padding: 15px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    @media screen and (max-width: 900px) {
        padding: 5px;
    }
    @media screen and (max-width: 400px) {
        height: 28px;
        padding: 4px;
        font-size: 0.5rem;
    }
`;

const FavoritesContainer = styled.div`
    padding: 36px;
`;

const ShowFavorites = styled.button`
    background-color: ${(props) =>
        props.background ? 'aliceblue' : '#ffffff'};
    cursor: pointer;
    width: 120px;
    height: 32px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    @media screen and (max-width: 400px) {
        height: 28px;
        font-size: 0.75rem;
    }
`;
const ShowRecommended = styled.button`
    margin-left: 36px;
    background-color: ${(props) =>
        props.background ? 'aliceblue' : '#ffffff'};
    cursor: pointer;
    width: 160px;
    height: 32px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    @media screen and (max-width: 400px) {
        height: 28px;
        font-size: 0.75rem;
    }
`;

const LikeButton = styled.button`
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    width: 130px;
    height: 30px;
`;

// Circle options for different distances
const defaultCircleOptions = {
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true
};

const rangeCircle = {
    ...defaultCircleOptions,
    zIndex: 8,
    fillOpacity: 0.15,
    strokeColor: 'black',
    fillColor: 'transparent'
};

const CarParkInfoWindow = styled.div`
    display: flex;
    flex-direction: column;
    font-family: Roboto;
    font-weight: 100;
    width: 245px;
`;

const Selector = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-right: 40px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    @media screen and (max-width: 400px) {
    }
`;

const DaySelector = styled.select`
    display: flex;
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
    @media screen and (max-width: 400px) {
        height: 24px;
        padding: 0;
    }
`;
const HourSelector = styled.select`
    display: flex;
    flex: 1;
    margin-left: 10px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    @media screen and (max-width: 400px) {
        height: 24px;
        padding: 0;
    }
`;

const AmenitiesContainer = styled.div`
    margin-top: 10px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 40px;
`;

const CarParks = styled.button`
    background-color: ${(props) =>
        props.background ? 'aliceblue' : '#ffffff'};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    width: 100px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
`;
const PetrolStations = styled.button`
    cursor: pointer;
    background-color: ${(props) =>
        props.background ? 'aliceblue' : '#ffffff'};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    width: 100px;
    height: 30px;
    border-radius: 5px;
`;
const EVCharging = styled.button`
    cursor: pointer;
    background-color: ${(props) =>
        props.background ? 'aliceblue' : '#ffffff'};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 5px;
    width: 100px;
    height: 30px;
`;

const InputContainer = styled.div`
    font-weight: bold;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-left: 7%;

    & > * {
        margin-bottom: 10px;
    }

    @media screen and (max-width: 400px) {
        flex-direction: column;
        margin-top: 10px;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    align-items: flex-start;
`;

const SearchBoxContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    & > * + * {
        margin-top: 10px;
    }
`;

const ButtonContainer = styled.div`
    margin-left: 50px;
    margin-top: 20px;
`;

const StartInput = styled.input`
    width: 200px;
    height: 36px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    @media screen and (max-width: 400px) {
        height: 18px;
    }
`;
const EndInput = styled.input`
    width: 200px;
    height: 36px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    @media screen and (max-width: 400px) {
        height: 18px;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    @media screen and (max-width: 900px) {
        flex-direction: column;
    }
`;

const Left = styled.div`
    flex: 2;
    height: auto;
    scroll-snap-align: center;
    @media screen and (max-width: 900px) {
        display: ${(props) => (props.toShow ? 'block' : 'none')};
        background-color: white;
        flex: 1;
        position: absolute;
        z-index: 20;
    }
`;
const Right = styled.div`
    position: relative;
    flex: 3.5;
    height: auto;
    @media screen and (max-width: 900px) {
        flex: 3;
    }
`;
const PageContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    z-index: 10;
    scroll-snap-align: center;
    overflow: hidden;

    @media screen and (max-width: 900px) {
        flex-direction: column;
        position: relative;
    }
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #222222;
    width: 100%;
    height: 60px;

    @media screen and (max-width: 900px) {
        flex-direction: row;
    }
`;

// Orginal navbar
const PageTitle = styled.h1`
    color: white;
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-family: Roboto;
    font-style: italic;
    font-weight: 500;
    line-height: 170%;
    letter-spacing: 3px;
    padding-left: 2%;

    @media screen and (max-width: 900px) {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 5vh;
        width: 85%;
    }
`;

const TitleMarker = styled.img`
    height: 50px;
    margin-left: 30px;

    @media screen and (max-width: 900px) {
        width: 15%;
        flex-direction: row;
        margin-left: 0.6rem;
    }
`;

const List = styled.ul`
    display: flex;
    list-style: none;
    align-items: center;
    padding: 5px;
    margin-left: 200px;

    @media screen and (max-width: 900px) {
        width: 85%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-left: 0.5rem;
    }
`;

const ListItem = styled.li`
    cursor: pointer;
    font-weight: bold;
    color: white;
    position: relative;
    font-size: 15px;
    margin-left: 90px;
    font-family: Arial;
    font-style: normal;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -3px;
        width: 100%;
        height: 4px;
        background: linear-gradient(45deg, #00ffff, #00bfff, #00ffff);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    }

    &:hover::after {
        transform: scaleX(1);
    }

    @media screen and (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0.8rem;
        font-size: 0.8rem;
    }
`;

const Button2 = styled.button`
    height: 40px;
    width: 90px;
    padding: 20px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 60px;

    @media screen and (max-width: 900px) {
        width: 15%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0.2rem;
        margin-right: 0.5rem;
    }
`;

const Busynesscheck = styled.div`
    font-weight: bold;
    margin-left: 5%;
    padding: 10px;
`;

const Traveltime = styled.div`
    font-family: 'Roboto';
    margin-left: 30px;
`;
