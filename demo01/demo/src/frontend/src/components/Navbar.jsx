import React from 'react'
import styled from 'styled-components';

const Section = styled.div`
    display: flex;
    justify-content:center;
    align-items: center;
    height:15vh;
`

const Container = styled.div`
    width:100%;
    display: flex;
    justify-content:space-between;
    align-items:center;
    padding: 20px 10px;
`

const Links = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;
`

const Logo = styled.img`
   height: 50px;
   margin-left: 40px;
`

const Icons = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`

const List = styled.ul`
    display: flex;
    gap:30px;
    list-style:none;
    align-items: center; 
    padding: 20px; 
    margin-left: 250px;
    padding-left: 40px;
`

const ListItem = styled.li`
    cursor: pointer;
    font-weight:bold;
    color:white;
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
`

const Button = styled.button`
    height: 40px;
    width: 90px;
    padding: 20px;150px;
    background-color: #00ffff;
    color:white;
    border:none;
    border-radius:5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight:bold;
    margin-right: 40px;
`

const Navbar = () =>{
    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
      };

    return(
        <Section>
            <Container>
                <Links> 
                <Logo src="./img/icon.png"/>
                <List>
                    <ListItem><a href="#home">Home</a></ListItem>
                    <ListItem><a href="#main">Map</a></ListItem>
                    <ListItem><a href="#about">About Us</a></ListItem>
                </List>
                </Links>
                <Icons>
                <Button onClick={scrollToContact}>Contact</Button>
                </Icons>
            </Container>
        </Section>
    )
}

export default Navbar;