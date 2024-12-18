'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import CategorySelector from "./components/CategorySelector";
import { Category } from './model/Category';
import DifficultySelector from "./components/DifficultySelector";
import { Difficulty } from './model/Difficulty';
import { Question, QuestionsService } from "./services/QuestionsService";
import QuestionView from "./components/QuestionView";
import PointsForQuestion from "./components/PointsForQuestion";
import HintView from "./components/HintView";
import StatsView from "./components/StatsView";
import { TagSelectorRef } from "./components/shared/TagSelector";

const questionsService = new QuestionsService();

export default function Home() {
  const MAX_ROUNDS = 5;
  const MAX_QUESTIONS = 5;

  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [round, setRound] = useState(1)
  const [numProcessedQuestions, setNumProcessedQuestions] = useState(0)
  const [question, setQuestion] = useState<Question | null>(null);
  const [pointsPerRound, setPointsPerRound] = useState<number[]>([0]);
  const [pointsForQuestion, setPointsForQuestion] = useState<number | null>(null);
  const [pointsForQuestionVersion, setPointsForQuestionVersion] = useState<number>(0);
  const [isHintRequested, setIsHintRequested] = useState(false)

  const categorySelectorRef = useRef<TagSelectorRef>(null);
  const difficultySelectorRef = useRef<TagSelectorRef>(null);

  const setNextQuestion = async () => {
    setIsHintRequested(false)
    if (category && difficulty) {
      try {
        setQuestion(null)
        const fetchedQuestion = await questionsService.fetchQuestion(category, difficulty);
        setQuestion(fetchedQuestion);
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    } else {
      setQuestion(null)
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    setNumProcessedQuestions((prev) => prev + 1)

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

    setPointsPerRound((prevPoints) => {
      const updatedPoints = [...prevPoints];
      updatedPoints[round - 1] = updatedPoints[round - 1] + pointsForCurrentQuestion;
      return updatedPoints;
    });
  }

  const handleOnNext = () => {
    if (numProcessedQuestions === MAX_QUESTIONS && round !== MAX_ROUNDS) {
      setNumProcessedQuestions(0);
      setPointsPerRound((prevPoints) => {
        return [...prevPoints, 0];
      });
      setRound((prev) => prev + 1)
    }
    setNextQuestion()
  }

  useEffect(() => {
    questionsService.reset()
    setNextQuestion();
  }, [category, difficulty]);

  useEffect(() => {
    setTimeout(() => {
      if (numProcessedQuestions === MAX_QUESTIONS && round === MAX_ROUNDS) {
        const maxPoints = Math.max(...pointsPerRound);
        alert(`5 rounds completed, congrats! Your highscore are ${maxPoints} points. Try to beat it and choose maybe different category and difficulty!`);
        setNumProcessedQuestions(0);
        setRound(1);
        setPointsForQuestion(null);
        setPointsPerRound([0]);
        setDifficulty(null);
        setCategory(null);

        if (difficultySelectorRef?.current) {
          difficultySelectorRef.current.reset();
        }

        if (categorySelectorRef?.current) {
          categorySelectorRef.current.reset();
        }
      }
    }, 1000)

  }, [numProcessedQuestions, round, pointsPerRound]);

  return (
    <div className="grid grid-cols-10 min-h-screen">
      {/* Left Column (10%) */}
      <div className="col-span-10 md:col-span-2 flex flex-col justify-around h-full bg-slate-700">
        <DifficultySelector ref={difficultySelectorRef} onDifficultyClick={(difficulty) => setDifficulty(difficulty)} />
        <CategorySelector ref={categorySelectorRef} onCategoryClick={(category) => setCategory(category)} />
      </div>

      {/* Middle Column (70%) */}
      <div className="col-span-10 md:col-span-6 flex flex-col justify-around items-center">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-5xl font-bold text-center text-cyan-400">CHALLENGE YOURSELF</h2>
          <div className="text-center text-cyan-400 text-lg">Select difficulty & category</div>
          <div className="text-center text-cyan-400 text-sm">{MAX_ROUNDS} Rounds  & {MAX_QUESTIONS} Questions per Round</div>
        </div>

        {question ? (
          <div className="w-full flex items-center justify-center">
            <QuestionView
              question={question}
              onAnswerSubmit={(answer) => handleAnswerSubmit(answer)}
              onNext={handleOnNext}
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
              src="./light-bulb.svg"
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
      <div className="col-span-10 md:col-span-2 flex flex-col h-full mt-8">
        <StatsView points={pointsPerRound} currentRound={round}></StatsView>
        <PointsForQuestion points={pointsForQuestion} version={pointsForQuestionVersion} />
      </div>
    </div>
  );
}
