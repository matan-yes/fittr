import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Header, BackArrow, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar, MinuteButton, FormContainer, TimerContent } from "./Amrap.style";
import alpineSkiClockSound from "../../assets/alpineSkiClock.mp3";

function Amrap() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);
    const [timeCap, setTimeCap] = useState(600);
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
                            setSoundPlayed(false); // Reset for AMRAP phase
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
            } else if (!isPreWorkout && time < timeCap) {
                timer = setInterval(() => {
                    setTime((prev) => {
                        if (prev >= timeCap - 1) {
                            setIsRunning(false);
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
                    });
                }, 1000);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, time, timeCap, soundPlayed]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        if (time < timeCap) {
            if (!isRunning && isPreWorkout) {
                setSoundPlayed(false); // Reset sound flag when starting
            }
            setIsRunning(!isRunning);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setPreCountdown(preCountdownDuration);
        setIsPreWorkout(true);
        setTime(0);
        setSoundPlayed(false); // Reset sound flag on reset
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handleAddMinute = () => {
        setTimeCap((prev) => prev + 60);
        setSoundPlayed(false); // Reset sound flag when adding time
    };

    const handleTimeCapChange = (e) => {
        const newCapMinutes = parseInt(e.target.value) || 10;
        const newCap = newCapMinutes * 60; // Convert minutes to seconds
        setTimeCap(newCap);
    };

    const handlePreCountdownChange = (e) => {
        const newValue = parseInt(e.target.value) || 10;
        setPreCountdownDuration(newValue);
        if (isPreWorkout) {
            setPreCountdown(newValue);
        }
    };

    const backToMenu = () => {
        handleReset();
        navigate('/main');
    };

    const progress = (time / timeCap) * 100;

    return (
        <TimerContainer>
            <BackArrow onClick={backToMenu} disabled={isRunning}>←</BackArrow>
            <Header>AMRAP</Header>
            <TimerContent>
                {isPreWorkout ? (
                    <>
                        <Phase>Get Ready</Phase>
                        <TimeDisplay>{preCountdown}s</TimeDisplay>
                    </>
                ) : (
                    <>
                        <Phase>AMRAP</Phase>
                        <TimeDisplay>{formatTime(time)}</TimeDisplay>
                        <Phase>Time Cap: {formatTime(timeCap)}</Phase>
                        <ProgressBar progress={progress} />
                    </>
                )}
            </TimerContent>

            <FormContainer>
                <Controls>
                    <Button onClick={handleStartPause}>
                        {isRunning ? "Pause" : "Start"}
                    </Button>
                    {!isPreWorkout && (
                        <MinuteButton onClick={handleAddMinute}>+1 Min</MinuteButton>
                    )}
                    <Button onClick={handleReset}>Reset</Button>
                    <Button onClick={backToMenu} disabled={isRunning}>Back</Button>
                </Controls>

                {isPreWorkout && (
                    <div style={{ color: 'white', fontSize: '1rem' }}>
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
                )}
            </FormContainer>
        </TimerContainer>
    );
}

export default Amrap;
