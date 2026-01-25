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

export const TimerContainer = styled.div(({ $isWork }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100vh",
    width: "100%",
    backgroundColor: $isWork ? "#ff4d4d" : "#4da6ff",
    color: "white",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.5s ease-in-out",
    position: "relative",
    padding: "20px",
    boxSizing: "border-box",
}));

export const TimeDisplay = styled.div(() => ({
    fontSize: "10rem",
    fontWeight: "bold",
    marginBottom: "20px",
}));

export const Phase = styled.div(() => ({
    fontSize: "2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
}));

export const ProgressBar = styled.div(({ progress }) => ({
    width: "80%",
    height: "20px",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    marginTop: "20px",
    overflow: "hidden",
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "100%",
        backgroundColor: "#fff",
        transition: "width 1s linear",
    },
}));

export const Controls = styled.div(() => ({
    marginTop: "20px",
    display: "flex",
    gap: "15px",
}));

export const Button = styled.button(() => ({
    backgroundColor: "white",
    color: "black",
    fontSize: "1.2rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
        backgroundColor: "#ddd",
    },
}));

export const Input = styled.input(() => ({
    fontSize: "1.2rem",
    padding: "5px",
    margin: "5px",
    width: "80px",
    textAlign: "center",
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