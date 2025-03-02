import './App.css'
import Clock from './components/Clock'
import styled, { useTheme } from 'styled-components'
import { ThemeProvider } from './theme/theme'
import ThemeToggler from "./components/ThemeToggler";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tabata from './components/Tabata/Tabata';


export const View = styled.div((props) => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minWidth: '100vw',
  minHeight: '100vh',
  alignItems: 'center',
  backgroundColor: props.theme.background
}));


export const Background = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height: 50%;
background-image: url(${(props) =>
    props.theme.url
  });
background-size: 38%;
background-position: center;
background-repeat: no-repeat;
background-color: ${(props) => props.theme.background};
background-clip: content-box;
`;

export const Content = styled.div`
    background-color: ${(props) => props.theme.background};
    color: white;
    text-align: center;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
`;

function Main() {
  return (
    <View>
      <Background />
      <Content>
        <Clock />
      </Content>
      <ThemeToggler />
    </View>
  );
}



function Routers() {
  return (
    <BrowserRouter basename="/fittr">
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/main" element={<Main />} />
        <Route path="/tabata" element={<Tabata />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Routers />
    </ThemeProvider>
  );
}

export default App
