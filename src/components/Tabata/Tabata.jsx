import { useState, useEffect } from "react";
import { TimerContainer, Phase, TimeDisplay, Controls, Button, Input, ProgressBar } from "./Tabata.style";

// const beepSound = new Audio("/beep.mp3"); // Short beep for last 3 seconds
// const skiClockSound = new Audio("/ski-clock.mp3"); // Alpine ski clock sound

function Tabata() {
    const [preCountdown, setPreCountdown] = useState(10); // 10 sec countdown before workout
    const [time, setTime] = useState(20); // 20 seconds work time
    const [isRunning, setIsRunning] = useState(false);
    const [isPreWorkout, setIsPreWorkout] = useState(true);

    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [roundsLeft, setRoundsLeft] = useState(8);

    const [workDuration, setWorkDuration] = useState(20);
    const [restDuration, setRestDuration] = useState(10);

    useEffect(() => {
        let timer;

        if (isRunning) {
            if (isPreWorkout && preCountdown > 0) {
                timer = setInterval(() => {
                    setPreCountdown((prev) => {
                        if (prev <= 4 && prev > 1) {
                            // beepSound.play(); // Play beep in last 3 seconds
                        }

                        return prev - 1;
                    });
                }, 1000);
            } else if (!isPreWorkout && roundsLeft > 0) {
                timer = setInterval(() => {
                    setTime((prev) => {
                        if (prev === 1) {
                            // skiClockSound.play(); // Play Alpine ski clock sound at phase change
                            if (isWorkPhase) {
                                setTime(restDuration);
                            } else {
                                setTime(workDuration);
                                setRoundsLeft((r) => r - 1);
                            }
                            setIsWorkPhase(!isWorkPhase);
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
            if (isPreWorkout && !isRunning) setPreCountdown(10);
            if (isPreWorkout && isRunning) setIsPreWorkout(false);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setPreCountdown(10);
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


    return (
        <TimerContainer $isWork={isWorkPhase}>
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
                    <ProgressBar progress={(time / (isWorkPhase ? workDuration : restDuration)) * 100} />
                </>
            )}

            <Controls>
                <Button onClick={handleStartPause}>
                    {isRunning ? "Pause" : "Start"}
                </Button>
                <Button onClick={handleReset}>Reset</Button>
            </Controls>

            <div>
                <label>Work: </label>
                <Input type="number" value={workDuration} onChange={handleWorkDurationChange} />
                <label>Rest: </label>
                <Input type="number" value={restDuration} onChange={handleRestDurationChange} />
            </div>
        </TimerContainer>
    );

}

export default Tabata;