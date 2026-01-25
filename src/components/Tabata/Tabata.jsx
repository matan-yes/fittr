import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { Header, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBarContainer, ProgressSegment, FormContainer, TimerContent } from "./Tabata.style";

// const beepSound = new Audio("/beep.mp3"); // Short beep for last 3 seconds
// const skiClockSound = new Audio("/ski-clock.mp3"); // Alpine ski clock sound

function Tabata() {
    const [preCountdown, setPreCountdown] = useState(10);
    const [preCountdownDuration, setPreCountdownDuration] = useState(10);
    const [time, setTime] = useState(20);
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);

    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [roundsLeft, setRoundsLeft] = useState(8);
    const [totalRounds, setTotalRounds] = useState(8);
    const [configuredRounds, setConfiguredRounds] = useState(8);

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
                    setMilliseconds((prevMs) => {
                        const newMs = prevMs + 50;

                        if (newMs >= 1000) {
                            setTime((prev) => {
                                if (prev <= 1) {
                                    // Phase complete - transition
                                    setTimeout(() => {
                                        if (isWorkPhase) {
                                            // Check if this is the last work phase
                                            if (roundsLeft === 1) {
                                                // Last work phase - stop the timer
                                                setIsRunning(false);
                                                setRoundsLeft(0);
                                            } else {
                                                // Not the last round - transition to rest
                                                setTime(restDuration);
                                                setMilliseconds(0);
                                                setIsWorkPhase(false);
                                            }
                                        } else {
                                            // Rest phase ending - transition to work
                                            setTime(workDuration);
                                            setMilliseconds(0);
                                            setRoundsLeft((r) => r - 1);
                                            setIsWorkPhase(true);
                                        }
                                    }, 50);
                                    return 0;
                                }
                                return prev - 1;
                            });
                            return 0;
                        }
                        return newMs;
                    });
                }, 50);
            }
        }

        return () => clearInterval(timer);
    }, [isRunning, isPreWorkout, preCountdown, isWorkPhase, roundsLeft, workDuration, restDuration]);

    const handleStartPause = () => {
        if (roundsLeft > 0 || isRunning) {
            // Lock in the configured rounds when starting
            if (!isRunning && isPreWorkout) {
                setTotalRounds(configuredRounds);
                setRoundsLeft(configuredRounds);
            }
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
        setMilliseconds(0);
        setIsWorkPhase(true);
        setRoundsLeft(configuredRounds);
    };

    const handleWorkDurationChange = (e) => {
        setWorkDuration(parseInt(e.target.value) || 0);
        setTime(parseInt(e.target.value) || 0);
    };

    const handleRestDurationChange = (e) => {
        setRestDuration(parseInt(e.target.value) || 0);
    };

    const handleRoundsDurationChange = (e) => {
        const rounds = parseInt(e.target.value) || 8;
        setConfiguredRounds(rounds);
        // Only update roundsLeft if not currently running
        if (!isRunning) {
            setRoundsLeft(rounds);
        }
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
    // milliseconds represents progress within the current second (0-1000ms)
    const timeRemaining = time - (milliseconds / 1000);
    const elapsedTime = totalPhaseDuration - timeRemaining;
    const progress = Math.min(100, Math.max(0, (elapsedTime / totalPhaseDuration) * 100));

    // Calculate current segment
    const completedRounds = totalRounds - roundsLeft;
    const currentSegmentIndex = completedRounds * 2 + (isWorkPhase ? 0 : 1);
    const isFinished = roundsLeft === 0;


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
                        <Phase>{roundsLeft === 0 ? "COMPLETED!" : (isWorkPhase ? "WORK" : "REST")}</Phase>
                        <TimeDisplay>{roundsLeft === 0 ? "DONE!" : `${time}s`}</TimeDisplay>
                        {roundsLeft > 0 && <Phase>Rounds Left: {roundsLeft}</Phase>}
                        <ProgressBarContainer>
                            {Array.from({ length: totalRounds * 2 - 1 }).map((_, index) => {
                                const isWork = index % 2 === 0;
                                const isCompleted = index < currentSegmentIndex;
                                const isCurrent = index === currentSegmentIndex;

                                return (
                                    <ProgressSegment
                                        key={index}
                                        $isWork={isWork}
                                        $isCompleted={isCompleted}
                                        $isCurrent={isCurrent}
                                        $progress={isCurrent ? progress : 0}
                                        $isFinished={isFinished}
                                    />
                                );
                            })}
                        </ProgressBarContainer>
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
                    <Input type="number" value={workDuration} onChange={handleWorkDurationChange} disabled={isRunning} />
                    <label>Rest: </label>
                    <Input type="number" value={restDuration} onChange={handleRestDurationChange} disabled={isRunning} />
                    <label>For: </label>
                    <Input type="number" value={configuredRounds} onChange={handleRoundsDurationChange} disabled={isRunning} />
                    <label>rounds</label>
                </div>
            </FormContainer>
        </TimerContainer>
    );

}

export default Tabata;