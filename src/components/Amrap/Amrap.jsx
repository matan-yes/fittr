import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar, RoundButton, FormContainer, TimerContent } from "./Amrap.style";

function Amrap() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);
    const [rounds, setRounds] = useState(0);
    const [timeCap, setTimeCap] = useState(600);

    const navigate = useNavigate();

    useEffect(() => {
        let timer;

        if (isRunning) {
            if (isPreWorkout && preCountdown > 0) {
                timer = setInterval(() => {
                    setPreCountdown((prev) => {
                        if (prev <= 1) {
                            setIsPreWorkout(false);
                            return 0;
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
                        return prev + 1;
                    });
                }, 1000);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, time, timeCap]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPause = () => {
        if (time < timeCap) {
            setIsRunning(!isRunning);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setPreCountdown(preCountdownDuration);
        setIsPreWorkout(true);
        setTime(0);
        setRounds(0);
    };

    const handleAddRound = () => {
        setRounds((prev) => prev + 1);
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
                        <Phase>Rounds: {rounds}</Phase>
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
                        <RoundButton onClick={handleAddRound}>+1 Round</RoundButton>
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
                        <div>
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
                    </div>
                )}
            </FormContainer>
        </TimerContainer>
    );
}

export default Amrap;
