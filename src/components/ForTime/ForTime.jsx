import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar, ToggleButton, MinuteButton, FormContainer, TimerContent } from "./ForTime.style";

function ForTime() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);
    const [isStopped, setIsStopped] = useState(false);
    const [timeCap, setTimeCap] = useState(600);
    const [countMode, setCountMode] = useState("up"); // "up" or "down"

    const navigate = useNavigate();

    useEffect(() => {
        let timer;

        if (isRunning) {
            if (isPreWorkout && preCountdown > 0) {
                timer = setInterval(() => {
                    setPreCountdown((prev) => {
                        if (prev <= 1) {
                            setIsPreWorkout(false);
                            // Initialize time based on count mode
                            setTime(countMode === "down" ? timeCap : 0);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else if (!isPreWorkout && !isStopped) {
                timer = setInterval(() => {
                    setTime((prev) => {
                        if (countMode === "up") {
                            // Count up mode: stop at time cap
                            if (prev >= timeCap) {
                                setIsRunning(false);
                                setIsStopped(true);
                                return timeCap;
                            }
                            return prev + 1;
                        } else {
                            // Count down mode: stop at 0
                            if (prev <= 1) {
                                setIsRunning(false);
                                setIsStopped(true);
                                return 0;
                            }
                            return prev - 1;
                        }
                    });
                }, 1000);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, isStopped, countMode, timeCap]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        if (!isStopped) {
            setIsRunning(!isRunning);
        }
    };

    const handleFinish = () => {
        setIsRunning(false);
        setIsStopped(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setPreCountdown(preCountdownDuration);
        setIsPreWorkout(true);
        setTime(countMode === "down" ? timeCap : 0);
        setIsStopped(false);
    };

    const handlePreCountdownChange = (e) => {
        const newValue = parseInt(e.target.value) || 10;
        setPreCountdownDuration(newValue);
        if (isPreWorkout) {
            setPreCountdown(newValue);
        }
    };

    const handleTimeCapChange = (e) => {
        const newCapMinutes = parseInt(e.target.value) || 10;
        const newCap = newCapMinutes * 60; // Convert minutes to seconds
        setTimeCap(newCap);
        if (countMode === "down" && isPreWorkout) {
            setTime(newCap);
        }
    };

    const handleAddMinute = () => {
        setTimeCap((prev) => prev + 60);
        if (countMode === "down") {
            setTime((prev) => prev + 60);
        }
    };

    const handleCountModeToggle = () => {
        const newMode = countMode === "up" ? "down" : "up";
        setCountMode(newMode);
        if (isPreWorkout) {
            setTime(newMode === "down" ? timeCap : 0);
        }
    };

    const backToMenu = () => {
        handleReset();
        navigate('/main');
    };

    // Calculate progress based on count mode
    const progress = countMode === "up"
        ? (time / timeCap) * 100
        : ((timeCap - time) / timeCap) * 100;

    return (
        <TimerContainer $isStopped={isStopped}>
            <Header>For Time</Header>
            <TimerContent>
                {isPreWorkout ? (
                    <>
                        <Phase>Get Ready</Phase>
                        <TimeDisplay>{preCountdown}s</TimeDisplay>
                    </>
                ) : (
                    <>
                        <Phase>{isStopped ? "COMPLETED!" : "FOR TIME"}</Phase>
                        <TimeDisplay>{formatTime(time)}</TimeDisplay>
                        <Phase>Time Cap: {formatTime(timeCap)}</Phase>
                        <ProgressBar progress={progress} />
                    </>
                )}
            </TimerContent>

            <FormContainer>
                <Controls>
                    {!isStopped && (
                        <>
                            <Button onClick={handleStartPause}>
                                {isRunning ? "Pause" : "Start"}
                            </Button>
                            {!isPreWorkout && (
                                <>
                                    <MinuteButton onClick={handleAddMinute}>+1 Min</MinuteButton>
                                    <Button onClick={handleFinish} $finish>Finish</Button>
                                </>
                            )}
                        </>
                    )}
                    <Button onClick={handleReset}>Reset</Button>
                    <Button onClick={backToMenu}>Back</Button>
                </Controls>

                {isPreWorkout && (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', fontSize: '1.2rem', marginRight: '10px' }}>
                                Countdown:
                            </label>
                            <Input
                                type="number"
                                value={preCountdownDuration}
                                onChange={handlePreCountdownChange}
                                disabled={isRunning}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ color: 'white', fontSize: '1.2rem', marginRight: '10px' }}>
                                Time Cap (minutes):
                            </label>
                            <Input
                                type="number"
                                value={timeCap / 60}
                                onChange={handleTimeCapChange}
                                disabled={isRunning}
                            />
                        </div>
                        <div>
                            <label style={{ color: 'white', fontSize: '1.2rem', marginRight: '10px' }}>
                                Mode:
                            </label>
                            <ToggleButton
                                onClick={handleCountModeToggle}
                                disabled={isRunning}
                                $active={countMode === "up"}
                            >
                                Count Up
                            </ToggleButton>
                            <ToggleButton
                                onClick={handleCountModeToggle}
                                disabled={isRunning}
                                $active={countMode === "down"}
                            >
                                Count Down
                            </ToggleButton>
                        </div>
                    </div>
                )}
            </FormContainer>
        </TimerContainer>
    );
}

export default ForTime;
