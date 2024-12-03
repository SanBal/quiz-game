'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

import CategorySelector from "./components/CategorySelector";
import { Category } from './model/Category';
import DifficultySelector from "./components/DifficultySelector";
import { Difficulty } from './model/Difficulty';
import { Question, QuestionsService } from "./services/QuestionsService";
import { log } from "console";
import QuestionView from "./components/QuestionView";
import PointsView from "./components/Points";
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
    getQuestion();
  }, [category, difficulty]);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            <CategorySelector onCategoryClick={(category) => setCategory(category)} />
          </li>
          <li className="mb-2">
            <DifficultySelector onDifficultyClick={(difficulty) => setDifficulty(difficulty)} />
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {question && <QuestionView question={question} onAnswerSubmit={(answer) => handleAnswerSubmit(answer)}></QuestionView>}
        </div>

        
       <PointsView points={points}></PointsView>
       <PointsForQuestion points={pointsForQuestion} ></PointsForQuestion>
      </main>

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
  );
}
