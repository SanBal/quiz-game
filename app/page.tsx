'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

import CategorySelector from "./components/CategorySelector";
import { Category } from './model/Category';
import DifficultySelector from "./components/DifficultySelector";
import { Difficulty } from './model/Difficulty';
import { Question, QuestionsService } from "./services/QuestionsService";
import QuestionView from "./components/QuestionView";
import PointsView from "./components/PointsView";
import PointsForQuestion from "./components/PointsForQuestion";
import HintView from "./components/HintView";

const questionsService = new QuestionsService();

export default function Home() {
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [points, setPoints] = useState(0);
  const [pointsForQuestion, setPointsForQuestion] = useState<number | null>(null);
  const [pointsForQuestionVersion, setPointsForQuestionVersion] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isHintRequested, setIsHintRequested] = useState(false)

  const setNextQuestion = async () => {
    if (category && difficulty) {
      try {
        setIsAnswerSubmitted(false)
        setIsHintRequested(false)
        setQuestion(null)
        const fetchedQuestion = await questionsService.fetchQuestion(category, difficulty);
        setQuestion(fetchedQuestion);
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    setIsAnswerSubmitted(true)

    const isCorrect = answer === question?.correct_answer;

    let pointsForCurrentQuestion = 0;
    if (isCorrect) {
      switch (difficulty) {
        case Difficulty.EASY:
          pointsForCurrentQuestion = 10;
          break;
        case Difficulty.MEDIUM:
          pointsForCurrentQuestion = 30;
          break;
        case Difficulty.HARD:
          pointsForCurrentQuestion = 50;
          break;
      }
    }
    setPointsForQuestion(pointsForCurrentQuestion);
    setPointsForQuestionVersion((prev) => prev + 1)

    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + pointsForCurrentQuestion)
    }
  }

  useEffect(() => {
    questionsService.reset()
    setNextQuestion();
  }, [category, difficulty]);

  return (
    <div>
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {/* Main container keeps centered with mx-auto */}
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl mx-auto">
          <CategorySelector onCategoryClick={(category) => setCategory(category)} />
          <DifficultySelector onDifficultyClick={(difficulty) => setDifficulty(difficulty)} />
        </main>

        {/* Question container takes same width as the main container */}
        <div className="flex gap-4 items-center flex-col sm:flex-row border-0 w-full max-w-4xl mx-auto min-h-[300px] p-4">
          {question ? (
            <div className="w-full min-h-[150px] flex items-center justify-center">
              <QuestionView
                question={question}
                onAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
                onNext={() => setNextQuestion()}
              />
            </div>
          ) : category && difficulty ? (
            <div className="w-full min-h-[150px] flex items-center justify-center text-gray-500">
              Loading question...
            </div>
          ) : null}
        </div>

        {question ?
          <footer className="row-start-3 flex flex-col items-center justify-center">
            <Image
              aria-hidden
              src="/light-bulb.svg"
              alt="light bulb icon"
              className="cursor-pointer hover:scale-105"
              width={25}
              height={25}
              onClick={() => setIsHintRequested((prev) => !prev)}
            />

            <div className="flex border-0 w-full max-w-4xl mx-auto min-h-[100px] p-4">
              {isHintRequested && !isAnswerSubmitted && <HintView question={question}></HintView>}
            </div>

          </footer>
          : <div></div>
        }
      </div>
      <PointsView points={points}></PointsView>
      <PointsForQuestion points={pointsForQuestion} version={pointsForQuestionVersion}></PointsForQuestion>
    </div>
  );
}
