import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from './Timer';
import CoinAnimation from './CoinAnimation';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (result: {
    difficulty: string;
    score: number;
    totalQuestions: number;
    date: string;
  }) => void;
}

const Quiz: React.FC<QuizProps> = ({ difficulty, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCoin, setShowCoin] = useState(false);
  const [coinPosition, setCoinPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      setOptions(shuffleArray([
        ...questions[currentQuestion].incorrect_answers,
        questions[currentQuestion].correct_answer
      ]));
    }
  }, [currentQuestion, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
      );
      
      if (response.data.response_code === 0) {
        setQuestions(response.data.results);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = (answer: string, event: React.MouseEvent) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    
    if (isCorrect && !showCoin) { // Only add coin if correct and coin animation not already shown
      setScore(score + 1);
      
      // Show coin animation
      setCoinPosition({
        x: event.clientX - 24,
        y: event.clientY - 24
      });
      setShowCoin(true);
      
      // Add coin to user's balance - only once per correct answer
      try {
        const token = localStorage.getItem('student_token');
        if (token) {
          axios.post('http://localhost:5000/api/coins/add', 
            { 
              amount: 1,
              questionId: `quiz-${currentQuestion}-${Date.now()}` // Unique ID for this question attempt
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(`Added 1 coin for correct answer to question ${currentQuestion}`);
        }
      } catch (error) {
        console.error('Error adding coin:', error);
      }
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowCoin(false); // Reset coin animation for next question
      } else {
        handleQuizComplete();
      }
    }, 1500);
  };

  const handleQuizComplete = () => {
    onComplete({
      difficulty,
      score,
      totalQuestions: questions.length,
      date: new Date().toISOString()
    });
  };

  const handleTimeUp = () => {
    handleQuizComplete();
  };
  
  const handleCoinAnimationComplete = () => {
    setShowCoin(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-white">Failed to load questions. Please try again.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <CoinAnimation
        show={showCoin}
        onComplete={handleCoinAnimationComplete}
        position={coinPosition}
      />
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Question {currentQuestion + 1}/{questions.length}
          </h2>
          <div className="text-white">
            Score: {score}
          </div>
        </div>
        
        <Timer duration={60} onTimeUp={handleTimeUp} />
        
        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <p className="text-lg text-white" dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={(e) => handleAnswer(option, e)}
            disabled={selectedAnswer !== null}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedAnswer === option
                ? option === questions[currentQuestion].correct_answer
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-red-500/20 border border-red-500'
                : selectedAnswer !== null && option === questions[currentQuestion].correct_answer
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: option }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz; 