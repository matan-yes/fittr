import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { Header, BackArrow, TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBarContainer, ProgressSegment, FormContainer, TimerContent } from "./Tabata.style";
import alpineSkiClockSound from "../../assets/alpineSkiClock.mp3";

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
                            setTime(workDuration);
                            setSoundPlayed(false); // Reset for next phase
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
                                                setSoundPlayed(false); // Reset for next phase
                                            }
                                        } else {
                                            // Rest phase ending - transition to work
                                            setTime(workDuration);
                                            setMilliseconds(0);
                                            setRoundsLeft((r) => r - 1);
                                            setIsWorkPhase(true);
                                            setSoundPlayed(false); // Reset for next phase
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

    // Play sound during last 3 seconds of work/rest phases
    useEffect(() => {
        if (!isPreWorkout && isRunning && time <= 3 && time > 0 && !soundPlayed) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                setSoundPlayed(true);
            }
        }
    }, [time, isPreWorkout, isRunning, soundPlayed]);

    const handleStartPause = () => {
        if (roundsLeft > 0 || isRunning) {
            // Lock in the configured rounds when starting
            if (!isRunning && isPreWorkout) {
                setTotalRounds(configuredRounds);
                setRoundsLeft(configuredRounds);
                setSoundPlayed(false); // Reset sound flag when starting
            }
            setIsRunning(!isRunning);
            if (isPreWorkout && !isRunning) {
                setPreCountdown(preCountdownDuration);
                setSoundPlayed(false); // Reset sound flag for pre-workout
            }
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
        setSoundPlayed(false); // Reset sound flag on reset
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
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
            <BackArrow onClick={backToMenu}>←</BackArrow>
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