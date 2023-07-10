import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    StandaloneSearchBox,
    InfoWindow,
    GoogleMap,
    LoadScript,
    Marker,
    Circle,
    DirectionsRenderer,
    MarkerClusterer
} from '@react-google-maps/api';
import geoJsonData from './manhattan.json';
import colors from './color';
import styled from 'styled-components';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Weather from '../Weather/Weather';
import parkingMarker from './parking.svg';
import locationMarker from './marker.svg';
import Cookies from 'js-cookie';
import favoritedIcon from './favorited_active.svg';
import notfavoritedIcon from './favorited_empty.svg';
import { Alert, Collapse } from 'antd';
import Marquee from 'react-fast-marquee';
import { getDistance } from 'geolib';

// Map component
const Map = ({ weatherInfo, foreCastInfo, locationInfo }) => {
    const zoom = 11.5;
    const [map, setMap] = useState(null);

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
        rate: ''
    });

    const center = useMemo(() => ({ lat: 40.7826, lng: -73.9656 }), []);

    const handleStartPlaceChange = async () => {
        // Get the selected start location
        const [startPlace] = inputStartRef.current.getPlaces();
        if (startPlace) {
            const lat = await startPlace.geometry.location.lat();
            const lng = await startPlace.geometry.location.lng();
            // console.log('start: ', { lat }, { lng });
            setStartLocation({ lat, lng });
        }
        // console.log({ startPlace });
    };

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

    // useEffect(() => {
    //     console.log({ destLocation });
    //     if (destLocation !== null) {
    //         const distances = locationInfo.map((carPark) => {
    //             const distanceToCarPark = getDistance(
    //                 {
    //                     latitude: carPark.coordinates.latitude,
    //                     longitude: carPark.coordinates.longitude
    //                 },
    //                 { latitude: destLocation.lat, longitude: destLocation.lng }
    //             );
    //         });
    //     }
    // }, [destLocation]);

    const onLoad = (map) => {
        // Load the map and GeoJSON data
        setMap(map);
        const geoJsonLayer = new window.google.maps.Data();
        geoJsonLayer.addGeoJson(geoJsonData);
        geoJsonLayer.setStyle((feature) => {
            const locationId = feature.getProperty('location_id');
            return {
                fillColor: colors[locationId],
                strokeWeight: 0.25,
                fillOpacity: 0.25
            };
        });
        geoJsonLayer.setMap(map);
        console.log('GeoJSON Loaded');
        // Show info window for the clicked location
        geoJsonLayer.addListener('click', async (e) => {
            setShowInfoWindow(false);
            setSelectedLocPosition({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });

            setSelectedLocation(e.feature.getProperty('location_id'));
        });
    };

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
            setDirections(null);
        }
    }, [map, startLocation]);

    /* If map and destLocation have values
      the map pans to the destLocation and sets the directions state to null.*/
    useEffect(() => {
        if (map && destLocation) {
            map.panTo(destLocation);
            setDirections(null);
        }
    }, [map, destLocation]);

    // Initializes the directions state variable using the useState hook. It is initially set to undefined.
    const [directions, setDirections] = useState();

    // Handles the case when the user presses Enter with an empty input field
    const handleEmptyCase = (e) => {
        if (e.key === 'Enter' && e.target.value === '') {
            if (e.target.id === 'start-input') {
                setDirections(null);
                setStartLocation(null);
            } else {
                setDirections(null);
                setDestLocation(null);
            }
        }
    };

    // Fetches the directions using the DirectionsService
    const fetchDirections = (start, end) => {
        if (!start || !end) return;
        const service = new window.google.maps.DirectionsService();
        service.route(
            {
                origin: start,
                destination: end,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === 'OK' && result) {
                    setDirections(result);
                }
            }
        );
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

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedDayIndex, setSelectedDayIndex] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Sets the selected day and hour based on weather and forecast information
    useEffect(() => {
        if (weatherInfo !== {} || foreCastInfo !== {}) {
            const today = Date(weatherInfo.dt * 1000).slice(0, 10);
            const time = Date(weatherInfo.dt * 1000).slice(16, 18);
            const index = daysOfWeek.findIndex(
                (day) => day === today.slice(0, 3)
            );
            setSelectedDayIndex(index);
            setSelectedDay(today);
            setSelectedHour(time);
        }
    }, [weatherInfo, foreCastInfo]);

    // Handles the change of selected day
    const handleDayChange = (e) => {
        const pickedDay = e.target.value;
        setSelectedDay(pickedDay);
        console.log(
            'User chose the day: ',
            pickedDay,
            foreCastInfo.list[pickedDay * 8].dt //actual argument we need to pass to the backend
        );
    };

    // Handles the change of selected hour
    const handleHourChange = (e) => {
        const pickedHour = e.target.value;
        setSelectedHour(pickedHour);
        console.log('User chose the hour: ', pickedHour);
    };

    // Handles the click on a car park marker and displays the info window
    const handleCarParkClick = (locationInfo) => {
        setSelectedLocation(null);
        setShowInfoWindow(true);
        const lat = locationInfo.coordinates.latitude;
        const lng = locationInfo.coordinates.longitude;
        //Set the info window position on the map. Adding a tiny bit to lat displayes it just above the parking icon...
        setInfoWindowPos({ lat: lat + 0.0004, lng: lng });
        const name = locationInfo.parkingStationName;
        const zone = locationInfo.rateZone;
        const rate = locationInfo.zoneInfo;
        setInfoWindowData((previousLocation) => ({
            ...previousLocation,
            name: name,
            zone: zone,
            rate: rate
        }));

        // const dis = getDistance(
        //     { latitude: lat, longitude: lng },
        //     { latitude: destLocation.lat, longitude: destLocation.lng }
        // );
        // console.log('Distance from destination (m): ', dis);
    };

    // const [favAddress, setFavAddress] = useState('');

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
        console.log('Current cookie state:', favCookie);
        const address = await geoCoder(place);
        // setFavAddress(address);
        if (address !== undefined) {
            if (
                favorites.some(
                    (places) =>
                        places.lat === place.lat && places.lng === place.lng
                )
            ) {
                const updatedArray = favorites.filter(
                    (obj) => obj.lat !== place.lat && obj.lng !== place.lng
                );
                Cookies.set('favorites', JSON.stringify(updatedArray), {
                    expires: 30
                });

                setFavCookie(updatedArray);
                return;
            } else {
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
        setShowFavorites(!showFavorites);
    };

    const handleFavClick = (location) => {
        const lat = location.lat;
        const lng = location.lng;
        map.panTo({ lat: lat, lng: lng });
        map.setZoom(17);
    };

    const text = `
        Information of the recommended facility.
        `;
    const items = [
        {
            key: '1',
            label: 'This is Recommendation 1',
            children: <p>{text}</p>
        },
        {
            key: '2',
            label: 'This is Recommendation 2',
            children: <p>{text}</p>
        },
        {
            key: '3',
            label: 'This is Recommendation 3',
            children: <p>{text}</p>
        }
    ];

    // const distanceFinder = (coord1, coord2) => {
    //     const distance = getDistance(coord1, coord2);
    //     console.log(distance);
    //     return distance;
    // };

    const [sliderValue, setSliderValue] = useState(1000);

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);
    };

    return (
        <PageContainer id="main">
            <PageHeader>
                <PageTitle>
                    Auto Mate
                    <TitleMarker src="../../img/marker.png" alt="red-marker" />
                </PageTitle>
            </PageHeader>
            <></>
            <Container>
                <LoadScript
                    googleMapsApiKey="AIzaSyDQxFVWqXZ4sTsX7_Zsf6Hio3J4nr7_wgY"
                    libraries={libraries}
                >
                    <Left>
                        <Alert
                            banner
                            message={
                                <Marquee pauseOnHover gradient={false}>
                                    This is a current traffic alert.
                                </Marquee>
                            }
                        />
                        <InputContainer>
                            <StandaloneSearchBox
                                options={SearchOptions}
                                onLoad={(ref) => (inputStartRef.current = ref)}
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
                                onLoad={(ref) => (inputDestRef.current = ref)}
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
                        </InputContainer>
                        <Selector>
                            <DaySelector
                                value={selectedDay}
                                onChange={handleDayChange}
                            >
                                {[...Array(5)].map((_, index) => (
                                    <option key={index} value={index}>
                                        {
                                            daysOfWeek[
                                                (selectedDayIndex + index) % 7
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
                                        {index.toString().padStart(2, '0')} : 00
                                    </option>
                                ))}
                            </HourSelector>
                        </Selector>

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
                                ? 'Max distance between destination and car parks:'
                                : 'Enter a valid destination to show nearby car parks.'}
                        </RangeText>
                        <RangeSlider
                            type="range"
                            min={0}
                            max={5000}
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
                            <ListOfFavorites>
                                {showFavorites &&
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
                                    ))}
                            </ListOfFavorites>
                        </FavoritesContainer>

                        {!showFavorites && (
                            <StyledCollapse accordion items={items} />
                        )}
                    </Left>

                    <Right>
                        <Weather
                            weatherInfo={weatherInfo}
                            foreCastInfo={foreCastInfo}
                        />
                        <GoogleMap
                            onClick={() => setShowInfoWindow(false)}
                            center={center}
                            zoom={zoom}
                            mapContainerStyle={{
                                height: '100%',
                                width: '100%',
                                zIndex: 1
                            }}
                            onLoad={onLoad}
                            options={{
                                disableDefaultUI: true,
                                clickableIcons: false,
                                mapId: '890875aa171abb1a',
                                disableAutoPan: true
                            }}
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
                                        radius={300}
                                        options={threeHundredMetresCircle}
                                    />
                                    <Circle
                                        center={destLocation}
                                        radius={600}
                                        options={sixHundredMetresCircle}
                                    />
                                    <Circle
                                        center={destLocation}
                                        radius={1000}
                                        options={kiloMetresCircle}
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
                                        <h4>
                                            Busyness: {colors[selectedLocation]}
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
                                                                .coordinates
                                                                .latitude,
                                                            lng: carPark
                                                                .coordinates
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
                                                    carPark.coordinates
                                                        .latitude,
                                                longitude:
                                                    carPark.coordinates
                                                        .longitude
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
                                                lat: carPark.coordinates
                                                    .latitude,
                                                lng: carPark.coordinates
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
                                    <CarParkInfoWindow>
                                        <h3>Car Park Name: </h3>
                                        {infoWindowData.name}
                                        <h4>Zone: </h4>
                                        {infoWindowData.zone}
                                        <h4>Rate: </h4>
                                        {infoWindowData.rate}
                                        <LikeButton
                                            onClick={() =>
                                                handleAddFavorite(infoWindowPos)
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
                                                            marginRight: '15px'
                                                        }}
                                                        src={favoritedIcon}
                                                        alt="liked place"
                                                    />
                                                    <span>Favorited</span>
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            marginRight: '15px'
                                                        }}
                                                        src={notfavoritedIcon}
                                                        alt="didnt like place"
                                                    />
                                                    <span>Not favorited</span>
                                                </>
                                            )}
                                        </LikeButton>
                                    </CarParkInfoWindow>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </Right>
                </LoadScript>
            </Container>
        </PageContainer>
    );
};

export default Map;

const RangeSlider = styled.input`
    margin-left: 30px;
    margin-top: 10px;
    width: 350px;
`;

const RangeText = styled.h4`
    margin-top: 36px;
    margin-left: 30px;
    font-family: Roboto;
    font-weight: 100;
`;

const SliderValue = styled.span`
    margin-left: 10px;
    font-family: Roboto;
    font-weight: 100;
`;

const ListOfFavorites = styled.div`
    margin-top: 30px;
    padding: 0px 0px;
    max-height: 300px;
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
    height: 72px;
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
const threeHundredMetresCircle = {
    ...defaultCircleOptions,
    zIndex: 10,
    fillOpacity: 0.5,
    strokeColor: '#00FF00',
    fillColor: 'transparent'
};
const sixHundredMetresCircle = {
    ...defaultCircleOptions,
    zIndex: 9,
    fillOpacity: 0.25,
    strokeColor: '#FFFF00',
    fillColor: 'transparent'
};
const kiloMetresCircle = {
    ...defaultCircleOptions,
    zIndex: 8,
    fillOpacity: 0.15,
    strokeColor: '#FF5252',
    fillColor: 'transparent'
};

const rangeCircle = {
    ...defaultCircleOptions,
    zIndex: 8,
    fillOpacity: 0.15,
    strokeColor: 'white',
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
    margin-top: 20px;
    margin-left: 40px;
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
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-top: 40px;
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
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 50px;
    @media screen and (max-width: 400px) {
        flex-direction: column;
        height: 80px;
        margin-top: 10px;
    }
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
    width: 100vw;
    @media screen and (max-width: 900px) {
        flex-direction: column;
    }
`;
const Left = styled.div`
    flex: 2;
    height: auto;
    scroll-snap-align: center;
    @media screen and (max-width: 900px) {
        flex: 1;
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
    /* width: 100vw; */
    height: 100vh;
    flex-direction: column;
    z-index: 10;
`;
const PageHeader = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    background-color: #222222;
    width: 100%;
    height: 60px;
`;
const PageTitle = styled.h1`
    color: white;
    font-size: 2rem;
    font-family: Roboto;
    font-style: italic;
    font-weight: 500;
    line-height: 170%;
    letter-spacing: 3px;
    padding-left: 2%;
`;
const TitleMarker = styled.img`
    width: 1.5rem;
    height: auto;
    margin-left: 10px;
`;
const StyledCollapse = styled(Collapse)`
    .ant-collapse {
        background-color: #f5f5f5;
        border-radius: 4px;
        position: flex;
        top: 20px;
        left: 10;
        right: 10;
    }

    .ant-collapse-item {
        background-color: #ffffff;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .ant-collapse-item:last-child {
        margin-bottom: 0;
    }

    .ant-collapse-header {
        background-color: #f0f0f0;
        padding: 16px;
        font-weight: bold;
        border-radius: 4px;
        cursor: pointer;
    }

    .ant-collapse-content {
        padding: 16px;
    }
`;