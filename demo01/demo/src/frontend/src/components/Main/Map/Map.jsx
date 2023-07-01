import React, { useState, useRef, useEffect } from 'react';
import {
    StandaloneSearchBox,
    InfoWindow,
    GoogleMap,
    LoadScript,
    Marker
} from '@react-google-maps/api';
import geoJsonData from './manhattan.json';
import colors from './color';
import styled from 'styled-components';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EvStationIcon from '@mui/icons-material/EvStation';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const Map = () => {
    const center = { lat: 40.7826, lng: -73.9656 };
    const zoom = 11.5;
    const [map, setMap] = useState(null);
    const inputStartRef = useRef();
    const inputDestRef = useRef();
    const [libraries] = useState(['places']);
    const [startLocation, setStartLocation] = useState(null);
    const [destLocation, setDestLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocPosition, setSelectedLocPosition] = useState(null);

    const handleStartPlaceChange = async () => {
        const [startPlace] = inputStartRef.current.getPlaces();
        if (startPlace) {
            const lat = await startPlace.geometry.location.lat();
            const lng = await startPlace.geometry.location.lng();
            console.log('start: ', { lat }, { lng });
            setStartLocation({ lat, lng });
        }
    };

    const handleDestPlaceChange = async () => {
        const [destPlace] = inputDestRef.current.getPlaces();
        if (destPlace) {
            const lat = await destPlace.geometry.location.lat();
            const lng = await destPlace.geometry.location.lng();
            console.log('end: ', { lat }, { lng });
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
                strokeWeight: 0.3,
                fillOpacity: 0.5
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
        }
    }, [map, startLocation]);

    useEffect(() => {
        if (map && destLocation) {
            map.panTo(destLocation);
        }
    }, [map, destLocation]);

    return (
        <PageContainer>
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
                                    type="text"
                                    placeholder="Search start..."
                                />
                            </StandaloneSearchBox>
                            <StandaloneSearchBox
                                options={SearchOptions}
                                onLoad={(ref) => (inputDestRef.current = ref)}
                                onPlacesChanged={handleDestPlaceChange}
                            >
                                <EndInput
                                    type="text"
                                    placeholder="Search destination..."
                                />
                            </StandaloneSearchBox>
                        </InputContainer>
                        <AmenitiesContainer>
                            <CarParks>
                                <LocalParkingIcon />
                            </CarParks>
                            <PetrolStations>
                                <LocalGasStationIcon />
                            </PetrolStations>
                            <EVCharging>
                                <EvStationIcon />
                            </EVCharging>
                        </AmenitiesContainer>
                    </Left>

                    <Right>
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
                                mapId: '7df5b499f8ea804a'
                            }}
                        >
                            {startLocation && (
                                <Marker position={startLocation} />
                            )}

                            {destLocation && <Marker position={destLocation} />}

                            {selectedLocation && (
                                <InfoWindow
                                    position={selectedLocPosition}
                                    onCloseClick={() =>
                                        setSelectedLocation(null)
                                    }
                                >
                                    <h3>Location ID: {selectedLocation}</h3>
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

const AmenitiesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-top: 40px;
`;
const CarParks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
    width: 100px;
    height: 30px;
    border-radius: 5px;
`;
const PetrolStations = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
    width: 100px;
    height: 30px;
    border-radius: 5px;
`;
const EVCharging = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
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
    height: 36;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid black;
`;
const EndInput = styled.input`
    width: 200px;
    height: 36px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid black;
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
    background-color: red;
`;
const PageContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
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
