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

export const BackArrow = styled.button(() => ({
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "3rem",
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    zIndex: 10,
    "&:hover": {
        transform: "scale(1.1)",
        opacity: 0.8,
    },
    "&:active": {
        transform: "scale(0.95)",
    },
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
    fontSize: "15rem",
    fontWeight: "bold",
    marginBottom: "20px",
}));

export const Phase = styled.div(() => ({
    fontSize: "3rem",
    fontWeight: "bold",
    textTransform: "uppercase",
}));

export const ProgressBarContainer = styled.div(() => ({
    width: "80vw",
    height: "40px",
    backgroundColor: "#ddd",
    borderRadius: "20px",
    marginTop: "30px",
    overflow: "hidden",
    position: "relative",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    display: "flex",
}));

export const ProgressSegment = styled.div(({ $isWork, $isCompleted, $isCurrent, $progress, $isFinished }) => ({
    flex: 1,
    height: "100%",
    backgroundColor: $isFinished
        ? "#4dff4d"
        : $isCompleted
            ? ($isWork ? "#ff6b6b" : "#6ba3ff")
            : "#ddd",
    position: "relative",
    borderRight: "2px solid #fff",
    transition: "background-color 0.5s ease",
    overflow: "hidden",
    "&:last-child": {
        borderRight: "none",
    },
    "&::after": $isCurrent ? {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: `${$progress}%`,
        height: "100%",
        backgroundColor: $isWork ? "#ff6b6b" : "#6ba3ff",
        transition: "width 0.05s linear",
    } : {},
}));

export const Controls = styled.div(() => ({
    marginTop: "20px",
    display: "flex",
    gap: "15px",
}));

export const Button = styled.button(() => ({
    backgroundColor: "white",
    color: "#1a1a1a",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    "&:hover": {
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-1px)",
    },
    "&:active": {
        transform: "translateY(0)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
    },
}));

export const Input = styled.input(() => ({
    fontSize: "1.1rem",
    padding: "10px 14px",
    margin: "5px",
    width: "80px",
    textAlign: "center",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#1a1a1a",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    "&:focus": {
        border: "2px solid white",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-1px)",
    },
    "&:disabled": {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        cursor: "not-allowed",
        opacity: "0.7",
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