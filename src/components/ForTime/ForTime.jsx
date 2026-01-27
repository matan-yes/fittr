import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Header, BackArrow, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar, ToggleButton, MinuteButton, FormContainer, TimerContent } from "./ForTime.style";
import alpineSkiClockSound from "../../assets/alpineSkiClock.mp3";

function ForTime() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);
    const [isStopped, setIsStopped] = useState(false);
    const [timeCap, setTimeCap] = useState(600);
    const [countMode, setCountMode] = useState("up"); // "up" or "down"
    const [soundPlayed, setSoundPlayed] = useState(false);
    const audioRef = useRef(null);

    const navigate = useNavigate();

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio(alpineSkiClockSound);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

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
                            setSoundPlayed(false); // Reset for workout phase
                            return 0;
                        }
                        if (prev === 4) {
                            if (audioRef.current && !soundPlayed) {
                                audioRef.current.currentTime = 0;
                                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                                setSoundPlayed(true);
                            }
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
                            // Play sound when 3 seconds remain (trigger at 4 so display shows 3 remaining)
                            if (timeCap - prev === 4 && !soundPlayed) {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = 0;
                                    audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                                    setSoundPlayed(true);
                                }
                            }
                            return prev + 1;
                        } else {
                            // Count down mode: stop at 0
                            if (prev <= 1) {
                                setIsRunning(false);
                                setIsStopped(true);
                                return 0;
                            }
                            // Play sound when countdown reaches 3 seconds
                            if (prev === 4 && !soundPlayed) {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = 0;
                                    audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                                    setSoundPlayed(true);
                                }
                            }
                            return prev - 1;
                        }
                    });
                }, 1000);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, isStopped, countMode, timeCap, soundPlayed]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        if (!isStopped) {
            if (!isRunning && isPreWorkout) {
                setSoundPlayed(false); // Reset sound flag when starting
            }
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
        setSoundPlayed(false); // Reset sound flag on reset
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
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
        setSoundPlayed(false); // Reset sound flag when adding time
    };

    const handleCountModeToggle = () => {
        const newMode = countMode === "up" ? "down" : "up";
        setCountMode(newMode);
        if (isPreWorkout) {
            setTime(newMode === "down" ? timeCap : 0);
        }
        setSoundPlayed(false); // Reset sound flag when changing mode
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
            <BackArrow onClick={backToMenu}>←</BackArrow>
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
                    <>
                        <div style={{ color: 'white', fontSize: '1rem', marginTop: '10px' }}>
                            <label>Countdown: </label>
                            <Input
                                type="number"
                                value={preCountdownDuration}
                                onChange={handlePreCountdownChange}
                                disabled={isRunning}
                            />
                            <label>Time Cap: </label>
                            <Input
                                type="number"
                                value={timeCap / 60}
                                onChange={handleTimeCapChange}
                                disabled={isRunning}
                            />
                            <label>minutes</label>
                        </div>
                        <div style={{ marginTop: '10px' }}>
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
                    </>
                )}
            </FormContainer>
        </TimerContainer>
    );
}

export default ForTime;
