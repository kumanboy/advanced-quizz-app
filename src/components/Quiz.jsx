import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../assets/data.js";

const Quiz = () => {
    let [index, setIndex] = useState(0); // Current question index
    let [question, setQuestion] = useState(data[index]); // Access the question object from the array
    let [lock, setLock] = useState(false); // Prevent multiple submissions
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [userAnswer, setUserAnswer] = useState(""); // User's answer
    let [feedback, setFeedback] = useState(""); // Display feedback (correct or wrong answer)
    let [isAnswered, setIsAnswered] = useState(false); // Track if the user has answered
    let [countdown, setCountdown] = useState(1200); // Countdown in seconds (20 minutes = 1200 seconds)
    let [timeUp, setTimeUp] = useState(false); // Flag to check if time is up

    // Countdown timer
    useEffect(() => {
        if (countdown === 0) {
            setTimeUp(true); // Set timeUp to true when countdown reaches 0
            setResult(true); // Show results when time is up
            alert("Your time is up!"); // Show an alert when the time is up
            return;
        }

        const timer = setInterval(() => {
            if (!timeUp) { // Only decrement if time isn't up
                setCountdown(prevCountdown => prevCountdown - 1); // Decrease countdown every second
            }
        }, 1000);

        // Cleanup the timer when the component unmounts or when countdown reaches zero
        return () => clearInterval(timer);
    }, [countdown, timeUp]);

    const handleNext = () => {
        // Increment the index if there are more questions
        if (lock === true) {
            if (index === data.length - 1) {
                setResult(true); // Show results after the last question
                return 0;
            }
            setIndex(index + 1);
            setQuestion(data[index + 1]); // Set the next question
            setLock(false); // Unlock the button for the next question
            setUserAnswer(""); // Clear the user answer
            setFeedback(""); // Clear the previous feedback
            setIsAnswered(false); // Reset the answered state
        }
    };

    const checkAnswer = () => {
        if (lock === false) {
            if (question.ansType === "fill-in") {
                if (question.ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
                    setScore(prev => prev + 1); // Correct answer, increase score
                    setFeedback("Correct ✅"); // Show correct message
                } else {
                    setFeedback(`Incorrect! The correct answer is: ${question.ans}`); // Show the correct answer
                }
                setLock(true); // Lock the button after answer is submitted
                setIsAnswered(true); // Mark the question as answered
            } else if (question.ansType === "error-identification") {
                if (userAnswer.toLowerCase().trim() === question.ans.toLowerCase().trim()) {
                    setScore(prev => prev + 1); // Correct answer, increase score
                    setFeedback("Correct ✅"); // Show correct message
                } else {
                    setFeedback(`Incorrect! The correct answer is: ${question.ans}`); // Show the correct answer
                }
                setLock(true); // Lock the button after answer is submitted
                setIsAnswered(true); // Mark the question as answered
            }
        }
    };

    return (
        <div className={"container"}>
            <div className={"row justify-content-center"}>
                <div className={"col-lg-6 col-md-6 col-sm-12"}>
                    <img src={"./logo.png"} alt={"logo"} className={"logo mx-auto d-block"} />
                    <hr />
                    {result ? (
                        <h6 className={"fs-4 text-center"}>
                            You Scored {score} out of {data.length} questions
                        </h6>
                    ) : (
                        <>
                            <div>
                                {/* Rendering the question in <span> */}
                                <span className={"fs-4"}>
                                    {index + 1}. {question.question}
                                </span>
                                {/* Display the text in <p> */}
                                <p>{question.sentence}</p>
                            </div>

                            {/* Countdown Timer */}
                            <div className="countdown">

                            </div>

                            {/* Input field for blank-fill questions or error identification */}
                            <div>
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Your answer"
                                    disabled={timeUp} // Disable input when time is up
                                />
                                <div className="d-flex justify-content-center">
                                    <button
                                        className={"btn mt-2 w-75 mt-3 mb-3"}
                                        onClick={checkAnswer}
                                        disabled={isAnswered || timeUp} // Disable submit button when time is up or already answered
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>

                            {/* Display feedback after answer is submitted */}
                            {feedback && (
                                <div className="feedback">
                                    <p>{feedback}</p>
                                </div>
                            )}

                            {/* Enable Next button after answer is submitted */}
                            <div className="d-flex justify-content-center">
                                <button
                                    className={"btn mt-3 w-75 mb-3"}
                                    onClick={handleNext}
                                    disabled={!isAnswered || timeUp} // Enable next button only after answering and if time is not up
                                >
                                    Next
                                </button>
                            </div>
                            <div className={"index mt-5 fw-bold d-flex justify-content-between gap-5"}>
                                {index + 1} of {data.length} quizzes <h5 className={""}>🕛:{Math.floor(countdown / 60)}:{countdown % 60}</h5>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
