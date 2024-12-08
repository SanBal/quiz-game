import React, { useMemo, useState } from 'react'
import { Question } from '../services/QuestionsService'

interface QuestionViewProperties {
    question: Question
    onAnswerSubmit: (answer: string) => void
    onNext: () => void
}

const QuestionView: React.FC<QuestionViewProperties> = ({ question, onAnswerSubmit, onNext }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false)
    const [isNextEnabled, setIsNextEnabled] = useState(false)

    const shuffledAnswers = useMemo(() => {
        setIsNextEnabled(false)
        const answers = [...question.incorrect_answers, question.correct_answer]
        return answers.sort(() => Math.random() - 0.5);
    }, [question]);

    const handleAnswerClick = (answer: string) => {
        if (!isAnswerSubmitted) {
            setSelectedAnswer(answer)
            setIsSubmitEnabled(true)
        }
    }

    const handleAnswerSubmit = () => {
        setIsSubmitEnabled(false)
        selectedAnswer && onAnswerSubmit(selectedAnswer)
        setIsNextEnabled(true)
    }

    const isAnswerSubmitted = isNextEnabled

    const handleOnNext = () => {
        setSelectedAnswer(null)
        onNext()
    }

    const parser = new DOMParser();
    const decodeHTML = (input: string): string => {
        const decodedString = parser.parseFromString(input, 'text/html').documentElement.textContent;
        return decodedString || input;
    };

    const getAnswerBackgroundColor = (answer: string): string => {
        let result = 'bg-none'
        if (isAnswerSubmitted) {
            if (answer === selectedAnswer) {
                result = selectedAnswer === question.correct_answer ? 'bg-green-400' : 'bg-red-400'
            } else if (answer === question.correct_answer) {
                result = 'bg-green-400'
            }
        } else if (answer === selectedAnswer) {
            result = 'bg-sky-400'
        }
        return result;
    };

    return (
        <div className="question-container w-full flex flex-col items-center justify-center gap-4 p-4">
            <h2 className="mb-4 text-center text-lg md:text-3xl font-bold">{decodeHTML(question.question)}</h2>
            {shuffledAnswers.map((answer, index) => (
                <div
                    key={index}
                    className={`answer-option p-4 md:p-6 border-2 rounded-lg text-sm md:text-xl font-semibold 
            ${!isAnswerSubmitted ? 'cursor-pointer hover:bg-sky-400' : 'cursor-not-allowed'} 
            ${getAnswerBackgroundColor(answer)} 
            w-full max-w-[600px] text-center`}
                    onClick={() => handleAnswerClick(answer)}
                >
                    {decodeHTML(answer)}
                </div>
            ))}
            <div className="flex flex-row justify-center w-full max-w-[600px] gap-2 md:gap-4">
                <button
                    className={`mt-4 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-medium 
            ${isSubmitEnabled ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    onClick={handleAnswerSubmit}
                    disabled={!isSubmitEnabled}
                >
                    Submit
                </button>
                <button
                    className={`mt-4 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-medium 
            ${isNextEnabled ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    onClick={handleOnNext}
                    disabled={!isNextEnabled}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default QuestionView