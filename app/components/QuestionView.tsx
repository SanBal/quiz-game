import React, { useMemo, useState } from 'react'
import { Question } from '../services/QuestionsService'

interface QuestionViewProperties {
    question: Question
    onAnswerSubmit: (answer: string) => void
    onNext: () => void
}

const QuestionView: React.FC<QuestionViewProperties> = ({ question, onAnswerSubmit, onNext }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isNextEnabled, setIsNextEnabled] = useState(false)

    const shuffledAnswers = useMemo(() => {
        setIsNextEnabled(false)
        const answers = [...question.incorrect_answers, question.correct_answer]
        return answers.sort(() => Math.random() - 0.5);
    }, [question]);

    const handleAnswerSubmit = () => {
        selectedAnswer && onAnswerSubmit(selectedAnswer)
        setSelectedAnswer(null)
        setIsNextEnabled(true)
    }

    const parser = new DOMParser();
    const decodeHTML = (input: string): string => {
        const decodedString = parser.parseFromString(input, 'text/html').documentElement.textContent;
        return decodedString || input;
    };

    return (
        <div className="question-container min-w-[800px] flex flex-col items-center justify-center">
            <h2 className="mb-4 text-center">{decodeHTML(question.question)}</h2>
            {shuffledAnswers.map((answer, index) => (
                <div
                    key={index}
                    className={`answer-option p-4 border rounded cursor-pointer hover:bg-sky-400 ${answer === selectedAnswer ? 'bg-sky-400' : 'none'} min-w-[400px] text-center`}
                    onClick={() => setSelectedAnswer(answer === selectedAnswer ? null : answer)}
                >
                    {decodeHTML(answer)}
                </div>
            ))}
            <div className="flex flex-row justify-around min-w-[400px]">
                <button
                    className={`mt-4 px-4 py-2 rounded ${selectedAnswer ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                >
                    Submit
                </button>
                <button
                    className={`mt-4 px-4 py-2 rounded ${isNextEnabled ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                    onClick={() => onNext()}
                    disabled={!isNextEnabled}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default QuestionView