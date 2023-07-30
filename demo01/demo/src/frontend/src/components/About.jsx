import React from 'react';
import styled from 'styled-components';

const data = [
    "We are Master students from the UCD",
    "This web app is called Auto Mate",
    "Based on predicted Manhattan road Busyness",
    "Help drivers plan their routes",
    "Provide traffic information conveniently"
];

const Section = styled.div`
    height:100vh;
    scroll-snap-align:center;
    display:felx;
    justify-content:center;
    background:url("./img/blue.jpg");
    background-size: cover;
`

const Container = styled.div`
    width:1400px;
    dispaly:flex;
    justify-content:space-between;
`

const Left = styled.div`
    flex:1;
`

const Right = styled.div`
    flex:1;
`

const List = styled.ul`

`

const ListItem = styled.li`

`

const About = () =>{
    return( 
            <Section>
                <Container>
                    <Left>

                    </Left>
                    <Right>
                        <List>
                            <ListItem>

                            </ListItem>
                        </List>
                    </Right>
                </Container>
            </Section>

    )
}


 
export default About;