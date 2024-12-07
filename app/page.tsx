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
  const [isHintRequested, setIsHintRequested] = useState(false)

  const setNextQuestion = async () => {
    if (category && difficulty) {
      try {
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
    <div className="grid grid-cols-10 min-h-screen">
      {/* Left Column (10%) */}
      <div className="col-span-10 md:col-span-2 flex flex-col justify-around h-full bg-slate-700">
        <DifficultySelector onDifficultyClick={(difficulty) => setDifficulty(difficulty)} />
        <CategorySelector onCategoryClick={(category) => setCategory(category)} />
      </div>

      {/* Middle Column (70%) */}
      <div className="col-span-10 md:col-span-6 flex flex-col justify-around items-center">
        <h2 className="text-xl md:text-5xl font-bold text-center text-cyan-400">CHALLENGE YOURSELF</h2>
        {question ? (
          <div className="w-full flex items-center justify-center">
            <QuestionView
              question={question}
              onAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
              onNext={() => setNextQuestion()}
            />
          </div>
        ) : category && difficulty ? (
          <div className="w-full flex items-center justify-center text-gray-500">
            Loading question...
          </div>
        ) : null}

        {question && (
          <div className="flex flex-col items-center">
            <Image
              aria-hidden
              src="/light-bulb.svg"
              alt="light bulb icon"
              className="cursor-pointer hover:scale-105"
              width={40}
              height={40}
              onClick={() => setIsHintRequested((prev) => !prev)}
            />
            <div className="flex border-0 w-full max-w-2xl mx-auto min-h-[100px] p-4">
              {isHintRequested && <HintView question={question}></HintView>}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (20%) */}
      <div className="col-span-10 md:col-span-2 flex flex-col items-center">
        <PointsView points={points} />
        <PointsForQuestion points={pointsForQuestion} version={pointsForQuestionVersion} />
      </div>
    </div>
  );
}
