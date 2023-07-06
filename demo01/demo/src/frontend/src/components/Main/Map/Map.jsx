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

    const [parkingIcons, setParkingIcons] = useState(false);
    const [petrolStationIcons, setPetrolStationIcons] = useState(false);
    const [evChargingIcons, setevChargingIcons] = useState(false);

    const center = useMemo(() => ({ lat: 40.7826, lng: -73.9656 }), []);

    const handleStartPlaceChange = async () => {
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
        const [destPlace] = inputDestRef.current.getPlaces();
        if (destPlace) {
            const lat = await destPlace.geometry.location.lat();
            const lng = await destPlace.geometry.location.lng();
            // console.log('end: ', { lat }, { lng });
            setDestLocation({ lat, lng });
        }
    };

    const onLoad = (map) => {
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
        geoJsonLayer.addListener('click', async (e) => {
            setSelectedLocPosition({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
            setSelectedLocation(e.feature.getProperty('location_id'));
        });
    };

    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1
    };

    const SearchOptions = {
        bounds: defaultBounds,
        componentRestrictions: {
            country: 'us'
        }
    };

    useEffect(() => {
        if (map && startLocation) {
            map.panTo(startLocation);
            setDirections(null);
        }
    }, [map, startLocation]);

    useEffect(() => {
        if (map && destLocation) {
            map.panTo(destLocation);
            setDirections(null);
            // console.log('destination changed');
        }
    }, [map, destLocation]);

    const [directions, setDirections] = useState();

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

    const handleDrag = (e, marker_id) => {
        const { latLng } = e;
        const lat = latLng.lat();
        const lng = latLng.lng();
        if (marker_id === 'start-marker') {
            setStartLocation({ lat, lng });
        } else {
            setDestLocation({ lat, lng });
        }

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

    const handleDayChange = (e) => {
        const pickedDay = e.target.value;
        setSelectedDay(pickedDay);
        console.log(
            'User chose the day: ',
            pickedDay,
            foreCastInfo.list[pickedDay * 8].dt //actual argument we need to pass to the backend
        );
    };

    const handleHourChange = (e) => {
        const pickedHour = e.target.value;
        setSelectedHour(pickedHour);
        console.log('User chose the hour: ', pickedHour);
    };

    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [infoWindowPos, setInfoWindowPos] = useState();
    const [infoWindowData, setInfoWindowData] = useState({
        name: '',
        zone: '',
        rate: ''
    });

    const handleCarParkClick = (locationInfo) => {
        setShowInfoWindow(true);
        const lat = locationInfo.coordinates.latitude;
        const lng = locationInfo.coordinates.longitude;
        setInfoWindowPos({ lat: lat, lng: lng });
        const name = locationInfo.parkingStationName;
        const zone = locationInfo.rateZone;
        const rate = locationInfo.zoneInfo;
        setInfoWindowData((previousLocation) => ({
            ...previousLocation,
            name: name,
            zone: zone,
            rate: rate
        }));
        console.log(showInfoWindow, infoWindowData, infoWindowPos);
    };

    return (
        <PageContainer id="main">
            <PageHeader>
                <PageTitle>
                    Auto Mate
                    <TitleMarker src="../../img/marker.png" alt="red-marker" />
                </PageTitle>
            </PageHeader>
            <Container>
                <LoadScript
                    googleMapsApiKey="AIzaSyDQxFVWqXZ4sTsX7_Zsf6Hio3J4nr7_wgY"
                    libraries={libraries}
                >
                    <Left>
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
                    </Left>

                    <Right>
                        <Weather
                            weatherInfo={weatherInfo}
                            foreCastInfo={foreCastInfo}
                        />
                        <GoogleMap
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

                            {locationInfo.length && parkingIcons && (
                                <MarkerClusterer>
                                    {(clusterer) =>
                                        locationInfo.map((carPark, index) => (
                                            <Marker
                                                onClick={() =>
                                                    handleCarParkClick(carPark)
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
                                                    lat: carPark.coordinates
                                                        .latitude,
                                                    lng: carPark.coordinates
                                                        .longitude
                                                }}
                                            />
                                        ))
                                    }
                                </MarkerClusterer>
                            )}

                            {showInfoWindow && (
                                <InfoWindow
                                    position={infoWindowPos}
                                    onCloseClick={() =>
                                        setShowInfoWindow(false)
                                    }
                                >
                                    <CarParkInfoWindow>
                                        <h3>Name: </h3>
                                        {infoWindowData.name}
                                        <h4>Zone: </h4>
                                        {infoWindowData.zone}
                                        <h4>Rate: </h4>
                                        {infoWindowData.rate}
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
`;
const DaySelector = styled.select`
    display: flex;
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
`;
const HourSelector = styled.select`
    display: flex;
    flex: 1;
    margin-left: 10px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
`;

const AmenitiesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-top: 40px;
`;
const CarParks = styled.button`
    background-color: ${(props) => (props.background ? '#ff6666' : '#ffffff')};
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
    background-color: ${(props) => (props.background ? '#ff6666' : '#ffffff')};
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
    background-color: ${(props) => (props.background ? '#ff6666' : '#ffffff')};
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
`;
const StartInput = styled.input`
    width: 200px;
    height: 36px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
`;
const EndInput = styled.input`
    width: 200px;
    height: 36px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
`;
const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100vw;
`;
const Left = styled.div`
    flex: 2;
    height: auto;
    scroll-snap-align: center;
`;
const Right = styled.div`
    position: relative;
    flex: 3.5;
    height: auto;
`;
const PageContainer = styled.div`
    display: flex;
    width: 100vw;
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
