import React, { useMemo, useState } from 'react'
import { Question } from '../services/QuestionsService'

interface QuestionViewProperties {
    question: Question
    onAnswerSubmit: (answer: string) => void
}

const QuestionView: React.FC<QuestionViewProperties> = ({ question, onAnswerSubmit }) => {
    const shuffledAnswers = useMemo(() => {
        const answers = [...question.incorrect_answers, question.correct_answer]
        return answers.sort(() => Math.random() - 0.5);
    }, [question]);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

    const parser = new DOMParser();
    const decodeHTML = (input: string): string => {
        const decodedString = parser.parseFromString(input, 'text/html').documentElement.textContent;
        return decodedString || input;
    };

    return (
        <div>
            <h2>{decodeHTML(question.question)}</h2>
            {
                shuffledAnswers.map((answer, index) => (
                    <div
                        key={index}
                        className="answer-option p-4 border rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => setSelectedAnswer(answer === selectedAnswer ? null : answer)}>
                        {decodeHTML(answer)}
                    </div>
                ))
            }
            <button
                className={`mt-4 px-4 py-2 rounded ${selectedAnswer ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    }`}
                onClick={() => { selectedAnswer && onAnswerSubmit(selectedAnswer) }}
                disabled={!selectedAnswer}>
                Submit
            </button>
        </div>
    )
}

export default QuestionView