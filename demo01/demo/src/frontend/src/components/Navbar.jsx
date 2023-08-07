import React from 'react';
import styled from 'styled-components';

const breakpoints = {
    small: '760px',
    medium: '900px',
    large: '1400px'
};

const Section = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15vh;
    font-family: 'Roboto';

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height:5vh;
    }
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10px;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 15%;
    }
`;

const Links = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 80%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-left:0rem;
        margin-left: 0rem;
    }
`;

const Logo = styled.img`
    height: 50px;
    margin-left: 40px;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 20%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0rem;
    }
`;

const Icons = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;

    @media screen and (max-width: ${breakpoints.medium}) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0rem;
        gap: 0rem;
        margin-right: 0rem;
    }
`;

const List = styled.ul`
    display: flex;
    gap: 30px;
    list-style: none;
    align-items: center;
    padding: 20px;
    margin-left: 250px;
    padding-left: 40px;

    @media screen and (max-width: ${breakpoints.medium}) {
        width: 80%;
        flex-direction: row;
        align-items: center;
        padding-left: 0rem;
        margin-left: 0rem;
        gap:1.3rem;
    }
`;

const ListItem = styled.li`
    cursor: pointer;
    font-weight: bold;
    color: white;
    margin-right: 50px;
    position: relative;

    /* Add the wavy line effect */
    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -5px;
        width: 100%;
        height: 2px;
        background: linear-gradient(45deg, #00ffff, #00bfff, #00ffff);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    }

    &:hover::after {
        transform: scaleX(1);
    }

    @media screen and (max-width: ${breakpoints.medium}) {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 0.1rem;
        font-size:0.8rem;
        margin-left: 0rem;
    }
`;

const Button = styled.button`
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
    margin-right: 40px;
    margin-left: auto;

    @media screen and (max-width: ${breakpoints.medium}) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 0px;
        width: 3.5rem;
    }
`;

const Navbar = () => {
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section>
            <Container>
                <Links>
                    <Logo src="./img/icon.png" />
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
                </Links>
                <Icons>
                    <Button onClick={scrollToContact}>Contact</Button>
                </Icons>
            </Container>
        </Section>
    );
};

export default Navbar;
