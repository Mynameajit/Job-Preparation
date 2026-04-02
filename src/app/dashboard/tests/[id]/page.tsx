"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchSingleTest } from "@/feature/test/testService";
import { Button } from "@/components/ui/button";
import { submitTest } from "@/feature/result/resultService";
import { ArrowLeft } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function TestPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.user)
  const params = useParams<{ id: string }>();
  const testId = params?.id;
  const userId = user?._id;


  const { singleTest } = useAppSelector((state) => state.test);
  const questions = singleTest?.questions || [];



  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [time, setTime] = useState(3600);

  // fetch
  useEffect(() => {
    if (testId) dispatch(fetchSingleTest(testId));
  }, [testId, dispatch]);

  // timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // load
  useEffect(() => {
    if (!testId) return;
    const saved = localStorage.getItem(`test_${testId}_answers`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [testId]);

  const handleAnswer = (index: number, value: string) => {
    const updated = { ...answers, [index]: value };
    setAnswers(updated);
    if (testId) {
      localStorage.setItem(`test_${testId}_answers`, JSON.stringify(updated));
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((p) => p + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };



  const handleSubmit = async () => {
    try {
      const res = await dispatch(
        submitTest({
          testId,
          answers,
          timeTaken: 3600 - time,
          userId,
        })
      ).unwrap();
      localStorage.removeItem(`test_${testId}_answers`);

      router.back();

    } catch (error) {
      console.log("Submit Error:", error);
    }
  };

  const handleExit = () => {
    localStorage.removeItem(`test_${testId}_answers`);
  };

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentQuestion = questions?.[current];
  const answeredCount = Object.keys(answers).length;

  const progress =
    questions.length > 0
      ? (answeredCount / questions.length) * 100
      : 0;

  const isAllAnswered =
    questions.length > 0 &&
    answeredCount === questions.length;

  if (!singleTest) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen text-gray-900 dark:text-white pb-1 sm:pb-8">

      {/* LEFT */}
      <div className="flex-1 p-4 md:p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-xl font-semibold flex gap-2 items-center" >
            <div >
              <Button className="bg-transparent cursor-pointer " size="lg" onClick={() => router.back()}>
                <ArrowLeft className="text-violet-700 scale-150 " />
              </Button>
            </div>
            {singleTest.title}
          </h1>

          <div className="text-red-500 font-bold">
            ⏱ {formatTime()}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Answered {answeredCount}/{questions.length}
          </p>

          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-2">
            <div
              className="h-2 bg-violet-700 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className=" border dark:border-gray-700 p-4 md:p-6 rounded-2xl shadow">

          <h2 className="mb-4 font-medium text-base md:text-lg">
            {currentQuestion?.title}
          </h2>

          <div className="space-y-3">
            {currentQuestion?.options?.map((opt: string, i: number) => (
              <div
                key={i}
                onClick={() => handleAnswer(current, opt)}
                className={`p-3 border rounded-xl cursor-pointer transition ${answers[current] === opt
                  ? "bg-blue-100 dark:bg-violet-700 border-violet-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {opt}
              </div>
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={current === 0}
              className="p-4 cursor-pointer"

            >
              Prev
            </Button>

            <Button
              onClick={handleNext}
              disabled={current === questions.length - 1}
              className="p-4 cursor-pointer "

            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-72 border-t md:border-l   p-4 flex flex-col ">
        <h2 className="font-semibold mb-4 text-sm md:text-base">
          Question Palette
        </h2>
        <div className="flex gap-3 text-sm mb-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-violet-700 rounded-full" />
            Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 border rounded" />
            Not Answered
          </span>
        </div>
        <div>


          <div className="grid grid-cols-6 md:grid-cols-5 gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`p-2 rounded text-xs md:text-sm border ${answers[i]
                  ? "bg-violet-700 text-white"
                  : current === i
                    ? "border-violet-700"
                    : "bg-gray-100 dark:bg-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-8">

          <Button variant="outline" className="w-full" onClick={handleExit}>
            Exit Test
          </Button>

          <Button
            className="w-full bg-violet-700 hover:bg-violet-900 text-white cursor-pointer"
            disabled={!isAllAnswered}
            onClick={handleSubmit}
          >
            Submit Test
          </Button>

        </div>
      </div>
    </div>
  );
}