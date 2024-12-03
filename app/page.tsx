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

export default function Home() {
  const questionsService = new QuestionsService();

  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)


  const handleAnswerSubmit = (answer: string) => {
    console.log("print answer", answer)
    setSelectedAnswer(answer)
  }

  useEffect(() => {
    console.log("useEffect triggered");
    const getQuestion = async () => {
      console.log("getQuestions triggered");
      if (category && difficulty) {
        try {
          const fetchedQuestion = await questionsService.fetchQuestion(category, difficulty);
          console.log("Fetched Question: ", fetchedQuestion);
          setQuestion(fetchedQuestion);
        } catch (error: any) {
          console.log("Could not fetch question", error);
        }
      }
    };
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
