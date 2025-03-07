import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CpuChipIcon, UserIcon } from '@heroicons/react/24/outline';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface AIBattleProps {
  onEarnCoins: (amount: number) => Promise<void>;
}

const AIBattle: React.FC<AIBattleProps> = ({ onEarnCoins }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [gameActive, setGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [aiThinking, setAiThinking] = useState(false);
  const [roundWinner, setRoundWinner] = useState<'player' | 'ai' | null>(null);
  const [awaitingCoinUpdate, setAwaitingCoinUpdate] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'ai' | null>(null);
  const MAX_QUESTIONS = 10;
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  const aiTaunts = {
    wrong: [
      "Ha! Even my training data could do better!",
      "Are you sure you're not a broken API?",
      "Error 404: Correct Answer Not Found in Human!",
      "Maybe you should try debugging your knowledge base!",
      "Is your cache memory full? That was an easy one!"
    ],
    right: [
      "Lucky guess, human!",
      "Not bad... for a carbon-based lifeform.",
      "You must have good training data!",
      "Your neural networks are functioning well today.",
      "Impressive. Have you been upgrading your knowledge base?"
    ],
    winning: [
      "Calculating your defeat...",
      "My victory probability is increasing!",
      "Your processing power seems limited today.",
      "Should I run in debug mode to give you a chance?"
    ]
  };

  const generateQuestion = async () => {
    try {
      setLoading(true);
      setRoundWinner(null);
      setAiThinking(false);
      setAiMessage('');
      
      const groqApiKey = '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';
      
      const prompt = `Generate a beginner-friendly programming question in the following JSON format:
      {
        "question": "Write a simple question about basic programming concepts",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "one of the options exactly"
      }

      Focus on these beginner-friendly topics:
      - Basic variables and data types
      - Simple operators and expressions
      - Common programming terms
      - Basic HTML/CSS concepts
      - Fundamental programming logic
      - Simple JavaScript concepts
      
      Make the question easy to understand, even for beginners.
      Ensure the options are clear and unambiguous.
      The correct answer should be obvious for someone who knows the basic concept.`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a coding instructor that generates beginner-friendly programming questions. Never repeat a question that was previously asked.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      let questionData;

      try {
        questionData = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          questionData = JSON.parse(jsonMatch[0]);
        }
      }

      if (questionData && questionData.question && Array.isArray(questionData.options)) {
        // Check if question has been used before
        if (usedQuestions.has(questionData.question)) {
          // If question is repeated, try generating again
          return generateQuestion();
        }

        // Add question to used questions set
        setUsedQuestions(prev => new Set(prev).add(questionData.question));
        setCurrentQuestion(questionData);
        setQuestionCount(prev => prev + 1);
        
        if (Math.random() < 0.6) {
          setCurrentTurn('ai');
          simulateAIAnswer(questionData);
        } else {
          setCurrentTurn('player');
        }
      } else {
        throw new Error('Invalid question format');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      // Use fallback questions - now with multiple beginner-friendly options
      const fallbackQuestions = [
        {
          question: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Link", "Home Tool Markup Language"],
          correctAnswer: "Hyper Text Markup Language"
        },
        {
          question: "Which symbol is used for single-line comments in JavaScript?",
          options: ["//", "/*", "#", "<!--"],
          correctAnswer: "//"
        },
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["let myVar", "variable myVar", "var = myVar", "const: myVar"],
          correctAnswer: "let myVar"
        },
        {
          question: "Which data type is used for whole numbers in JavaScript?",
          options: ["number", "integer", "float", "digit"],
          correctAnswer: "number"
        },
        {
          question: "What is the correct way to write a string in JavaScript?",
          options: ['"Hello"', "Hello", "'Hello", "Hello'"],
          correctAnswer: '"Hello"'
        }
      ];

      // Select a random unused fallback question
      const unusedFallbacks = fallbackQuestions.filter(q => !usedQuestions.has(q.question));
      const fallbackQuestion = unusedFallbacks[Math.floor(Math.random() * unusedFallbacks.length)] || fallbackQuestions[0];
      
      setUsedQuestions(prev => new Set(prev).add(fallbackQuestion.question));
      setCurrentQuestion(fallbackQuestion);
      setQuestionCount(prev => prev + 1);

      if (Math.random() < 0.6) {
        setCurrentTurn('ai');
        simulateAIAnswer(fallbackQuestion);
      } else {
        setCurrentTurn('player');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestion();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const simulateAIAnswer = async (question: Question) => {
    if (roundWinner) return;

    setAiThinking(true);
    setCurrentTurn('ai');
    // Random delay between 1.5-3 seconds
    const delay = Math.random() * 1500 + 1500; // Min 1.5s, Max 3s
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // 70% chance to get it right
    const willBeCorrect = Math.random() < 0.7;
    
    if (willBeCorrect) {
      handleAIAnswer(question.correctAnswer);
    } else {
      const wrongAnswers = question.options.filter(opt => opt !== question.correctAnswer);
      const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      handleAIAnswer(randomWrong);
    }
  };

  const handleAIAnswer = (answer: string) => {
    if (!currentQuestion || roundWinner) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect && !roundWinner) {
      setAiScore(prev => prev + 1);
      setAiMessage(aiTaunts.winning[Math.floor(Math.random() * aiTaunts.winning.length)]);
      setRoundWinner('ai');
      if (questionCount < MAX_QUESTIONS) {
        setTimeout(() => {
          generateQuestion();
        }, 1500);
      } else {
        setGameActive(false);
      }
    } else {
      setAiMessage("Oops, my circuits misfired!");
      setCurrentTurn('player');
    }
    setAiThinking(false);
  };

  const handlePlayerAnswer = async (answer: string) => {
    if (!currentQuestion || roundWinner || awaitingCoinUpdate || currentTurn !== 'player') return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect && !roundWinner) {
      setAwaitingCoinUpdate(true);
      try {
        await onEarnCoins(2);
        setPlayerScore(prev => prev + 1);
        setRoundWinner('player');
        setAiMessage(aiTaunts.right[Math.floor(Math.random() * aiTaunts.right.length)]);
        if (questionCount < MAX_QUESTIONS) {
          setTimeout(() => {
            generateQuestion();
          }, 1500);
        } else {
          setGameActive(false);
        }
      } catch (error) {
        console.error('Error updating coins:', error);
        toast.error('Failed to update coins');
      } finally {
        setAwaitingCoinUpdate(false);
      }
    } else {
      setAiMessage(aiTaunts.wrong[Math.floor(Math.random() * aiTaunts.wrong.length)]);
      if (!roundWinner && !aiThinking) {
        setCurrentTurn('ai');
        simulateAIAnswer(currentQuestion);
      }
    }
  };

  const restartGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setAiMessage('');
    setRoundWinner(null);
    setQuestionCount(0);
    setUsedQuestions(new Set()); // Clear used questions when restarting
    generateQuestion();
  };

  if (loading && questionCount === 0) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent mb-4"></div>
            <p className="text-white text-lg">Initializing AI battle...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-ninja-black to-ninja-black/95 p-4">
      <div className="h-full max-w-5xl mx-auto flex flex-col">
        {/* Header Section - Compact */}
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold text-white font-monument">AI Battle Arena</h2>
        </div>

        {gameActive && currentQuestion ? (
          <div className="flex-1 flex flex-col space-y-3">
            {/* Stats and Turn Bar - Combined */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-2">
              <div className="grid grid-cols-3 items-center">
                {/* Score */}
                <div className="flex items-center gap-4 justify-start">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-ninja-green" />
                    <span className="text-white text-sm">
                      You: <span className="text-ninja-green">{playerScore}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CpuChipIcon className="w-4 h-4 text-red-500" />
                    <span className="text-white text-sm">
                      AI: <span className="text-red-500">{aiScore}</span>
                    </span>
                  </div>
                </div>

                {/* Turn Indicator */}
                <div className="flex justify-center items-center gap-2">
                  <div className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    currentTurn === 'player' 
                      ? 'bg-ninja-green/20 text-ninja-green' 
                      : currentTurn === 'ai'
                      ? 'bg-red-500/20 text-red-500'
                      : 'text-white/60'
                  }`}>
                    {currentTurn === 'player' ? 'Your Turn' : currentTurn === 'ai' ? 'AI Turn' : 'Waiting...'}
                  </div>
                </div>

                {/* Timer and Progress */}
                <div className="flex items-center gap-3 justify-end">
                  <div className="text-white/80 text-sm">
                    {questionCount}/{MAX_QUESTIONS}
                  </div>
                  <div className="text-white text-sm">
                    {timeLeft}s
                  </div>
                </div>
              </div>
            </div>

            {/* Question Display - Compact */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-white/90 text-sm">{currentQuestion.question}</p>
            </div>

            {/* Battle Arena - Compact */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Player Side */}
              <div className="bg-gradient-to-br from-ninja-black/80 to-ninja-black border border-ninja-green/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-ninja-green/10 p-1 rounded">
                    <UserIcon className="w-4 h-4 text-ninja-green" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Your Answer</h3>
                </div>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlayerAnswer(option)}
                      disabled={roundWinner !== null || awaitingCoinUpdate || currentTurn !== 'player'}
                      className={`w-full p-2 text-left rounded transition-all text-sm
                        ${roundWinner
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-ninja-green/20 border border-ninja-green text-ninja-green'
                            : 'bg-white/5 border border-white/10 opacity-50'
                          : currentTurn === 'player'
                          ? 'bg-white/5 border border-white/10 hover:bg-ninja-green/10 hover:border-ninja-green/50'
                          : 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className="text-white">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Side */}
              <div className="bg-gradient-to-br from-ninja-black/80 to-ninja-black border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-500/10 p-1 rounded">
                    <CpuChipIcon className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white">AI Response</h3>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[160px]">
                  {aiThinking ? (
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="animate-pulse text-white/60 text-sm">Processing</div>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : aiMessage && (
                    <div className="text-center">
                      <div className="text-red-400 text-sm italic">{aiMessage}</div>
                      {roundWinner === 'ai' && (
                        <div className="text-red-500/60 text-xs mt-1">AI wins this round!</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md w-full text-center">
              <h3 className="text-xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-lg text-white mb-4">
                {playerScore > aiScore 
                  ? "🎉 Victory!" 
                  : playerScore < aiScore 
                    ? "🤖 AI Wins!" 
                    : "🤝 It's a tie!"}
              </p>
              <div className="flex justify-center gap-6 text-sm mb-4">
                <p className="text-ninja-green">You: {playerScore}</p>
                <p className="text-red-500">AI: {aiScore}</p>
              </div>
              <button
                onClick={restartGame}
                className="px-6 py-2 bg-ninja-green text-white rounded-lg text-sm
                          hover:bg-ninja-green/90 transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBattle; 