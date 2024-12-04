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

const questionsService = new QuestionsService();

export default function Home() {
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [points, setPoints] = useState(0);
  const [pointsForQuestion, setPointsForQuestion] = useState<number | null>(null);

  const getQuestion = async () => {
    if (category && difficulty) {
      try {
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

    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + pointsForCurrentQuestion)
    }

    getQuestion();
  }

  useEffect(() => {
    questionsService.reset()
    getQuestion();
  }, [category, difficulty]);
  return (
    <div>
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
              />
            </div>
          ) : category && difficulty ? (
            <div className="w-full min-h-[150px] flex items-center justify-center text-gray-500">
              Loading question...
            </div>
          ) : null}
        </div>

        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
        </footer>
      </div>
      <PointsView points={points}></PointsView>
      <PointsForQuestion points={pointsForQuestion}></PointsForQuestion>
    </div>
  );
}
