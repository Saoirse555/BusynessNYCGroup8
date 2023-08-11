import React, { useRef, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import styled from 'styled-components';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Statue from './Statue';
import Navbar from './Navbar';
import { Alert, Rate, Modal, Button, Popover } from 'antd';
import axios from 'axios';

const Section = styled.div`
    height: 100vh;
    scroll-snap-align: center;
    background: url('./img/contactbg.jpg');
    background-size: cover;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    @media only screen and (max-width: 768px) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const Container = styled.div`
    width: 100%;
    height: 85vh;
    display: flex;
    justify-content: space-between;
    gap: 50px;

    @media only screen and (max-width: 768px) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

const Left = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 50px;

    @media only screen and (max-width: 768px) {
        margin-top: 5rem;
        justify-content: center;
    }
`;

const Title = styled.h2`
    font-weight: 250;
    font-family: 'Roboto';
    font-weight: bold;
    margin-bottom: 0;

    @media only screen and (max-width: 768px) {
        width: 0%;
        justify-content: center;
        color: rgba(0, 0, 0, 0);
    }
`;

const HeadContainer = styled.div`
    display: flex;
    align-items: flex-end; /* Align items to the bottom */

    @media only screen and (max-width: 768px) {
        justify-content: center;
        align-items: center;
    }
`;

const Rating = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-left: 40px;
    margin-right: 40px;

    @media only screen and (max-width: 768px) {
        justify-content: center;
        flex-direction: column;
        margin: 0;
        width: 100%;
    }
`;

const Form = styled.form`
    width: 500px;
    display: flex;
    flex-direction: column;
    gap: 25px;

    @media only screen and (max-width: 768px) {
        width: 300px;
    }
`;

const Input = styled.input`
    padding: 15px;
    background-color: #e8e6e6;
    border: none;
    border-radius: 5px;
`;

const TextArea = styled.textarea`
    font-family: Arial;
    padding: 15px;
    border: none;
    border-radius: 5px;
    background-color: #e8e6e6;
`;

const ButtonForm = styled.button`
    background-color: #1890ff;
    color: white;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    padding: 15px;
`;

const SuccessMessage = styled.p`
    color: white;
`;

const Right = styled.div`
    flex: 1;
    margin-bottom: 40px;

    @media only screen and (max-width: 768px) {
        display: none;
    }
`;

const Contact = () => {
    // Collect Rating and get average function
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
    const [rate, setRate] = useState(5);
    const [showPopup, setShowPopup] = useState(false);
    const [backendRating, setBackendRating] = useState(null);

    const getBackRating = async () => {
        try {
            // Make an HTTP GET request for current backend rating data
            const { data } = await axios.get(
                `http://137.43.49.42/automate_api/v1/rating`
            );
            // Log a message indicating that the API call was made
            console.log('BackRating get');
            console.log('Fetched Rating:', data);
            console.log('Data Type of Fetched Rating:', typeof data);
            // Return the retrieved rating data
            setBackendRating(data);
        } catch (error) {
            // Log any errors that occur during the API call
            console.log(error);
        }
    };

    useEffect(() => {
        getBackRating();
    }, []);

    const content = (
        <div>
            <p>
                {' '}
                {backendRating !== null ? backendRating.toFixed(1) : '-'} / 5{' '}
            </p>
        </div>
    );

    const handleRatingChange = async (newValue) => {
        setRate(newValue);
        setShowPopup(true);

        const value = parseInt(newValue);
        console.log({ value });
        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            // Make an HTTP post request to retrieve parking station data
            const { rating } = await axios.post(
                'http://137.43.49.42/automate_api/v1/rating',
                value,
                { headers }
            );

            // Log a message indicating that the station data is being retrieved
            console.log('Sending rating data.');

            // Return the retrieved data
            return rating;
            // Log an error message if the request fails
        } catch (error) {
            console.log("Can't send rating");
        }
    };

    const alertStyles = {
        width: 'auto',
        padding: '8px 15px', // Smaller padding
        fontSize: '14px' // Smaller font size
    };

    // Send e-mail fuction
    const ref = useRef();
    const [success, setSuccess] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                'emailpls',
                'template_bql4gux',
                ref.current,
                'hEzNolfyTe3J3GvE4'
            )
            .then(
                (result) => {
                    console.log(result.text);
                    setSuccess(true);
                },
                (error) => {
                    console.log(error.text);
                    setSuccess(false);
                }
            );
    };

    return (
        <Section id="contact">
            <Navbar />
            <Container>
                <Left>
                    <Form ref={ref} onSubmit={handleSubmit}>
                        <HeadContainer>
                            <Title>Contact Us</Title>

                            <Rating>
                                <p
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 'bold',
                                        color: 'black',
                                        margin: 0
                                    }}
                                >
                                    and rate us 😊
                                </p>

                                <Rate
                                    tooltips={desc}
                                    onChange={handleRatingChange}
                                    value={rate}
                                />

                                {showPopup && (
                                    <Modal
                                        open={showPopup}
                                        onCancel={() => setShowPopup(false)}
                                        footer={null}
                                        centered
                                    >
                                        <Alert
                                            message="Thank you very much for your feedback!"
                                            type="success"
                                            style={alertStyles}
                                        />
                                    </Modal>
                                )}
                            </Rating>
                            {backendRating !== null && (
                                <Popover
                                    content={content}
                                    title="So far, we got:"
                                    style={{ fontweight: 'bold' }}
                                >
                                    <Button type="primary">
                                        Current rating
                                    </Button>
                                </Popover>
                            )}
                        </HeadContainer>
                        <Input placeholder="Name" name="name" />
                        <Input placeholder="Email" name="email" />
                        <TextArea
                            placeholder="Write your message here"
                            name="message"
                            rows={10}
                        />
                        <ButtonForm type="submit">Send</ButtonForm>
                        {success && (
                            <SuccessMessage>
                                {
                                    'Your message has been sent. We will get back to you soon. 🙇'
                                }
                            </SuccessMessage>
                        )}
                    </Form>
                </Left>

                <Right>
                    <Canvas>
                        <Stage enviroment="city" intensity={0.6}>
                            <Statue rotation={[0, Math.PI * 1.3, 0]} />
                        </Stage>
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </Right>
            </Container>
        </Section>
    );
};

export default Contact;
