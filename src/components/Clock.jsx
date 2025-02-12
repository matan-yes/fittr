import React, {useState, useEffect} from "react"
import styled from "styled-components";
import { useTheme } from "../theme/theme";



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
        -2px -2px 0 black,  
        2px -2px 0 black,
        -2px  2px 0 black,
        2px  2px 0 black;

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
            <DateElement onClick={toggleTheme}> {formattedDate} </DateElement><br />
        </>
    )
}