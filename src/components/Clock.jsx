import React, {useState, useEffect} from "react"
import styled from "styled-components";
import { useTheme } from "../theme/theme";
import { ThemeToggle } from "./ThemeSwitch";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';



export const ClockElement = styled.span`
    font-family: 'Montserrat', sans-serif;
    font-size: 14rem;
    font-weight: bold;
    text-align: center;
    color: #d34444;
    display: flex;
    align-items: center;
    justify-content: center;
    
    text-shadow: 
        -2px -2px 0 ${(props) => props.theme.text},  
        2px -2px 0 ${(props) => props.theme.text},
        -2px  2px 0 ${(props) => props.theme.text},
        2px  2px 0 ${(props) => props.theme.text};

`;
export const DateElement = styled(ClockElement)`
    font-size: 4rem;

`;

export default function Clock(){
    const [currentTime, setCurrentTime] = useState(new Date());

    const formattedTime = currentTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Set to false for 24-hour format, true for 12-hour format
    });
    
    const formattedDate = currentTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    useEffect( () => {
        const interval = setInterval(()=> {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);



    const { toggleTheme } = useTheme();
    return (
        <>
            <ClockElement> {formattedTime}</ClockElement>
            <DateElement> {formattedDate} </DateElement><br />
            <FormGroup>
                <FormControlLabel
                        control={<ThemeToggle onChange={toggleTheme} sx={{ m: 1 }} defaultChecked={false} />}
                        label="Dark Mode"
                />
            </FormGroup>
        </>
    )
}