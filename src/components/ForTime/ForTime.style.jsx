import styled from "styled-components";

export const Header = styled.div(() => ({
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "2px",
}));

export const TimerContainer = styled.div(({ $isStopped }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100vh",
    width: "100%",
    backgroundColor: $isStopped ? "#4da6ff" : "#ffa64d",
    color: "white",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.5s ease-in-out",
    position: "relative",
    padding: "20px",
    boxSizing: "border-box",
}));

export const TimeDisplay = styled.div(() => ({
    fontSize: "15rem",
    fontWeight: "bold",
    marginBottom: "20px",
}));

export const Phase = styled.div(() => ({
    fontSize: "3rem",
    fontWeight: "bold",
    textTransform: "uppercase",
}));

export const Controls = styled.div(() => ({
    marginTop: "20px",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center",
}));

export const Button = styled.button(({ $finish }) => ({
    backgroundColor: $finish ? "#ff4d4d" : "white",
    color: $finish ? "white" : "black",
    fontSize: "1.2rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: $finish ? "bold" : "normal",
    "&:hover": {
        backgroundColor: $finish ? "#e64444" : "#ddd",
    },
}));

export const Input = styled.input(() => ({
    fontSize: "1.2rem",
    padding: "5px",
    margin: "5px",
    width: "80px",
    textAlign: "center",
}));

export const ProgressBar = styled.div(({ progress }) => ({
    width: "80vw",
    height: "40px",
    backgroundColor: "#ddd",
    borderRadius: "20px",
    marginTop: "30px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "100%",
        backgroundColor: "#fff",
        transition: "width 1s linear",
        boxShadow: "0 2px 4px rgba(255,255,255,0.3)",
    },
}));

export const ToggleButton = styled.button(({ $active }) => ({
    backgroundColor: $active ? "#ff4d4d" : "white",
    color: $active ? "white" : "black",
    fontSize: "1.2rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    marginRight: "10px",
    fontWeight: $active ? "bold" : "normal",
    "&:hover": {
        backgroundColor: $active ? "#e64444" : "#ddd",
    },
    "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.6,
    },
}));

export const MinuteButton = styled.button(() => ({
    backgroundColor: "#4dff4d",
    color: "black",
    fontSize: "1.2rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
    "&:hover": {
        backgroundColor: "#3de63d",
    },
}));

export const FormContainer = styled.div(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    width: "100%",
    paddingBottom: "20px",
}));

export const TimerContent = styled.div(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
}));
