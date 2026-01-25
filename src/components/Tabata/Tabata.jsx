import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { Header, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar, FormContainer, TimerContent } from "./Tabata.style";

// const beepSound = new Audio("/beep.mp3"); // Short beep for last 3 seconds
// const skiClockSound = new Audio("/ski-clock.mp3"); // Alpine ski clock sound

function Tabata() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(20);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);

    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [roundsLeft, setRoundsLeft] = useState(8);

    const [workDuration, setWorkDuration] = useState(20);
    const [restDuration, setRestDuration] = useState(10);

    const navigate = useNavigate();


    useEffect(() => {
        let timer;

        if (isRunning) {
            if (isPreWorkout && preCountdown > 0) {
                timer = setInterval(() => {
                    setPreCountdown((prev) => {
                        if (prev <= 1) {
                            setIsPreWorkout(false);
                            setTime(workDuration);
                            return 0;

                        }
                        if (prev <= 4 && prev > 1) {
                            // beepSound.play(); // Play beep in last 3 seconds
                        }

                        return prev - 1;
                    });
                }, 1000);
            } else if (!isPreWorkout && roundsLeft > 0) {
                timer = setInterval(() => {
                    setTime((prev) => {
                        if (prev === 0) {
                            return 0;
                        }
                        if (prev === 1) {
                            // skiClockSound.play(); // Play Alpine ski clock sound at phase change
                            setTimeout(() => {
                                if (isWorkPhase) {
                                    setTime(restDuration);
                                } else {
                                    setTime(workDuration);
                                    setRoundsLeft((r) => r - 1);
                                }
                                setIsWorkPhase((prevPhase) => !prevPhase);
                            }, 200)

                        }
                        return prev > 1 ? prev - 1 : prev;
                    });
                }, 1000);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, isWorkPhase, roundsLeft, workDuration, restDuration]);

    const handleStartPause = () => {
        if (roundsLeft > 0) {
            setIsRunning(!isRunning);
            if (isPreWorkout && !isRunning) setPreCountdown(preCountdownDuration);
            if (isPreWorkout && isRunning) setIsPreWorkout(false);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setPreCountdown(preCountdownDuration);
        setIsPreWorkout(true);
        setTime(workDuration);
        setIsWorkPhase(true);
        setRoundsLeft(8);
    };

    const handleWorkDurationChange = (e) => {
        setWorkDuration(parseInt(e.target.value) || 0);
        setTime(parseInt(e.target.value) || 0);
    };

    const handleRestDurationChange = (e) => {
        setRestDuration(parseInt(e.target.value) || 0);
    };

    const handleRoundsDurationChange = (e) => {
        setRoundsLeft(parseInt(e.target.value) || 8);
    }

    const handlePreCountdownChange = (e) => {
        const newValue = parseInt(e.target.value) || 10;
        setPreCountdownDuration(newValue);
        if (isPreWorkout) {
            setPreCountdown(newValue);
        }
    }

    const backToMenu = (e) => {
        handleReset();
        navigate('/main');

    }
    const totalPhaseDuration = isWorkPhase ? workDuration : restDuration;
    const elapsedTime = totalPhaseDuration - time;
    const progress = (elapsedTime / totalPhaseDuration) * 100;


    return (
        <TimerContainer $isWork={isWorkPhase}>
            <Header>Tabata</Header>
            <TimerContent>
                {isPreWorkout ? (
                    <>
                        <Phase>Get Ready</Phase>
                        <TimeDisplay>{preCountdown}s</TimeDisplay>
                    </>
                ) : (
                    <>
                        <Phase>{isWorkPhase ? "WORK" : "REST"}</Phase>
                        <TimeDisplay>{time}s</TimeDisplay>
                        <Phase>Rounds Left: {roundsLeft}</Phase>
                        <ProgressBar progress={progress} />
                    </>
                )}
            </TimerContent>

            <FormContainer>
                <Controls>
                    <Button onClick={handleStartPause}>
                        {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button onClick={handleReset}>Reset</Button>
                    <Button onClick={backToMenu}>Back</Button>
                </Controls>

                <div>
                    <label>Countdown: </label>
                    <Input type="number" value={preCountdownDuration} onChange={handlePreCountdownChange} disabled={isRunning} />
                    <label>Work: </label>
                    <Input type="number" value={workDuration} onChange={handleWorkDurationChange} />
                    <label>Rest: </label>
                    <Input type="number" value={restDuration} onChange={handleRestDurationChange} />
                    <label>For: </label>
                    <Input type="number" value={roundsLeft} onChange={handleRoundsDurationChange} />
                    <label>rounds</label>
                </div>
            </FormContainer>
        </TimerContainer>
    );

}

export default Tabata;