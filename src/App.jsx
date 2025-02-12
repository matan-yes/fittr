import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Clock from './components/Clock'
import styled from 'styled-components'
import bgImage from '/Users/matanyes/personal-dev/fittr/src/fittr_transparent.png';
import { ThemeProvider } from './theme/theme'

export const Background = styled.div`
display: flex;
flex-direction: column;
min-width: 100vw;
min-height: 100vh;
background-image: url(${props => props.bg$});
background-size: 55% 55%;
background-position: top center;
background-repeat: no-repeat;
background-color: ${(props) => props.theme.background};
`;

export const Content = styled.div`
  position: absolute;
  top: 40%; /* Starts at 70% from the top */
  left: 50%;
  transform: translate(-50%, 0); /* Centers horizontally */
  width: 80%; /* Adjust width as needed */
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
`;

function App() {
  

  return (
    <>
    <ThemeProvider>
      <Background bg={bgImage}> 
        <Content>
          <Clock/>
        </Content>
      </Background>
    </ThemeProvider>
    </>
  )
}

export default App
