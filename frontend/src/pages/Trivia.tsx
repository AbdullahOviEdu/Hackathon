import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AcademicCapIcon,
  BeakerIcon,
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Quiz from '../components/Quiz';
import WordScramble from '../components/WordScramble';
import CodeCompletion from '../components/CodeCompletion';
import CodePattern from '../components/CodePattern';
import axios from 'axios';
import CoinAnimation from '../components/CoinAnimation';
import AIBattle from '../components/AIBattle';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizResult {
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  date: string;
}

interface QuizHistory {
  difficulty: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const Trivia: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showCoin, setShowCoin] = useState(false);
  const [coinPosition, setCoinPosition] = useState({ x: 0, y: 0 });
  const [gameFinished, setGameFinished] = useState(false);
  const [activeGame, setActiveGame] = useState<'quiz' | 'wordscramble' | 'codecompletion' | 'codepattern' | 'aibattle' | null>(null);
  const [coins, setCoins] = useState(0);
  const [awaitingCoinUpdate, setAwaitingCoinUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    const token = localStorage.getItem('student_token');

    if (!token || userType !== 'student') {
      toast.error('Please sign in as a student to access the trivia section');
      navigate('/signin/student');
      return;
    }

    fetchQuizHistory();
    fetchCoinBalance();
  }, [navigate]);

  const getAuthToken = () => {
    const token = localStorage.getItem('student_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return token;
  };

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();

      const response = await fetch('http://localhost:5000/api/quiz/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please sign in again');
          navigate('/signin/student');
          return;
        }
        throw new Error('Failed to fetch quiz history');
      }

      const data = await response.json();
      if (data.success) {
        setQuizHistory(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch quiz history');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch quiz history';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinBalance = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/api/coins/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCoins(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching coin balance:', error);
    }
  };

  const fetchQuestions = async (difficulty: Difficulty) => {
    try {
      setLoading(true);
      
      const groqApiKey = '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';
      
      // Define the prompt based on difficulty
      let prompt = '';
      if (difficulty === 'easy') {
        prompt = 'Generate 10 easy programming and computer science questions. Topics should include basic concepts like variables, data types, loops, and simple algorithms. Questions should be suitable for beginners.';
      } else if (difficulty === 'medium') {
        prompt = 'Generate 10 medium difficulty programming and computer science questions. Topics should include object-oriented programming, data structures, web development concepts, and intermediate algorithms.';
      } else {
        prompt = 'Generate 10 challenging programming and computer science questions. Topics should include advanced algorithms, system design, database concepts, and complex programming patterns.';
      }
      
      prompt += ' Format the response as a JSON array of objects, each with "question" (string), "options" (array of 4 strings), and "correctAnswer" (string matching one of the options) fields. The correctAnswer must be one of the options.';
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a programming instructor that generates quiz questions. Focus on practical, real-world programming concepts.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const content = response.data.choices[0].message.content;
      let questionsData;
      
      try {
        questionsData = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          questionsData = JSON.parse(jsonMatch[0]);
        }
      }
      
      if (questionsData && Array.isArray(questionsData)) {
        const formattedQuestions = questionsData
          .map((q: any, index: number) => ({
            id: index,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
          .filter((q: Question) => 
            q.question && 
            Array.isArray(q.options) && 
            q.options.length === 4 && 
            q.correctAnswer && 
            q.options.includes(q.correctAnswer)
          );
        
        if (formattedQuestions.length >= 5) {
          setQuestions(formattedQuestions);
          setCurrentQuestion(0);
          setScore(0);
          setGameFinished(false);
          return;
        }
      }
      
      throw new Error('Failed to generate valid questions');
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to generate questions. Using backup questions instead.');
      
      const hardcodedQuestions = generateHardcodedQuestions(difficulty);
      setQuestions(hardcodedQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setGameFinished(false);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate hardcoded questions based on difficulty
  const generateHardcodedQuestions = (difficulty: Difficulty): Question[] => {
    if (difficulty === 'easy') {
      return [
        {
          id: 1,
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          correctAnswer: "Paris"
        },
        {
          id: 2,
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctAnswer: "Mars"
        },
        {
          id: 3,
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4"
        },
        {
          id: 4,
          question: "Who wrote Romeo and Juliet?",
          options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
          correctAnswer: "William Shakespeare"
        },
        {
          id: 5,
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "O2", "NaCl"],
          correctAnswer: "H2O"
        },
        {
          id: 6,
          question: "Which animal is known as man's best friend?",
          options: ["Cat", "Dog", "Horse", "Rabbit"],
          correctAnswer: "Dog"
        },
        {
          id: 7,
          question: "How many days are in a week?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7"
        },
        {
          id: 8,
          question: "What color is a banana?",
          options: ["Red", "Green", "Yellow", "Blue"],
          correctAnswer: "Yellow"
        },
        {
          id: 9,
          question: "What is the first letter of the English alphabet?",
          options: ["X", "A", "Z", "B"],
          correctAnswer: "A"
        },
        {
          id: 10,
          question: "How many sides does a triangle have?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "3"
        }
      ];
    } else if (difficulty === 'medium') {
      return [
        {
          id: 1,
          question: "Which element has the chemical symbol 'Au'?",
          options: ["Silver", "Gold", "Aluminum", "Argon"],
          correctAnswer: "Gold"
        },
        {
          id: 2,
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          correctAnswer: "1945"
        },
        {
          id: 3,
          question: "What is the largest organ in the human body?",
          options: ["Heart", "Liver", "Skin", "Brain"],
          correctAnswer: "Skin"
        },
        {
          id: 4,
          question: "Which planet has the most moons?",
          options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
          correctAnswer: "Saturn"
        },
        {
          id: 5,
          question: "Who painted the Mona Lisa?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
          correctAnswer: "Leonardo da Vinci"
        },
        {
          id: 6,
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctAnswer: "Canberra"
        },
        {
          id: 7,
          question: "Which of these is not a programming language?",
          options: ["Java", "Python", "Cobra", "Leopard"],
          correctAnswer: "Leopard"
        },
        {
          id: 8,
          question: "What is the square root of 144?",
          options: ["12", "14", "16", "18"],
          correctAnswer: "12"
        },
        {
          id: 9,
          question: "Which country is home to the Great Barrier Reef?",
          options: ["Brazil", "Australia", "Thailand", "Mexico"],
          correctAnswer: "Australia"
        },
        {
          id: 10,
          question: "Who wrote '1984'?",
          options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
          correctAnswer: "George Orwell"
        }
      ];
    } else {
      return [
        {
          id: 1,
          question: "What is the rarest blood type?",
          options: ["O negative", "B negative", "AB negative", "A negative"],
          correctAnswer: "AB negative"
        },
        {
          id: 2,
          question: "Which of these elements has the highest atomic number?",
          options: ["Uranium", "Plutonium", "Nobelium", "Lawrencium"],
          correctAnswer: "Lawrencium"
        },
        {
          id: 3,
          question: "Who developed the theory of general relativity?",
          options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Stephen Hawking"],
          correctAnswer: "Albert Einstein"
        },
        {
          id: 4,
          question: "What is the capital of Kazakhstan?",
          options: ["Astana", "Almaty", "Bishkek", "Tashkent"],
          correctAnswer: "Astana"
        },
        {
          id: 5,
          question: "Which algorithm is commonly used for public key cryptography?",
          options: ["AES", "RSA", "DES", "Blowfish"],
          correctAnswer: "RSA"
        },
        {
          id: 6,
          question: "In which year was the first successful human heart transplant performed?",
          options: ["1957", "1967", "1977", "1987"],
          correctAnswer: "1967"
        },
        {
          id: 7,
          question: "What is the Fibonacci sequence term after 13?",
          options: ["21", "20", "23", "24"],
          correctAnswer: "21"
        },
        {
          id: 8,
          question: "Which philosopher proposed the concept of the 'Übermensch'?",
          options: ["Immanuel Kant", "Friedrich Nietzsche", "Jean-Paul Sartre", "Søren Kierkegaard"],
          correctAnswer: "Friedrich Nietzsche"
        },
        {
          id: 9,
          question: "What is the half-life of Carbon-14?",
          options: ["5,730 years", "1,600 years", "8,400 years", "3,200 years"],
          correctAnswer: "5,730 years"
        },
        {
          id: 10,
          question: "Which of these programming paradigms emphasizes immutable data?",
          options: ["Object-oriented programming", "Procedural programming", "Functional programming", "Imperative programming"],
          correctAnswer: "Functional programming"
        }
      ];
    }
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    try {
      getAuthToken();
      setSelectedDifficulty(difficulty);
      setLoading(true);
      toast.info(`Generating ${difficulty} questions...`, { autoClose: 2000 });
      
      await fetchQuestions(difficulty);
      setIsQuizStarted(true);
    } catch (error) {
      toast.error('Please sign in as a student to play the quiz');
      navigate('/signin/student');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    try {
      const token = getAuthToken();

      const response = await fetch('http://localhost:5000/api/quiz/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please sign in again');
          navigate('/signin/student');
          return;
        }
        throw new Error('Failed to save quiz result');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Quiz result saved successfully!');
        setIsQuizStarted(false);
        setSelectedDifficulty(null);
        fetchQuizHistory();
      } else {
        throw new Error(data.error || 'Failed to save quiz result');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save quiz result';
      toast.error(message);
    }
  };

  const handleAnswer = async (selectedAnswer: string, event: React.MouseEvent) => {
    if (!questions[currentQuestion] || awaitingCoinUpdate) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const isLastQuestion = currentQuestion + 1 >= questions.length;
    
    if (isCorrect) {
      setAwaitingCoinUpdate(true);
      try {
        // Set coin animation position
        setCoinPosition({
          x: event.clientX - 24,
          y: event.clientY - 24
        });
        setShowCoin(true);
        
        // Add coin to user's balance
        const token = getAuthToken();
        const response = await axios.post('http://localhost:5000/api/coins/add', 
          { 
            amount: 1,
            questionId: `quiz-${questions[currentQuestion].id}-${Date.now()}`
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setCoins(response.data.newBalance);
          setScore(score + 1);
          
          // Show success message
          toast.success('Correct! +1 coin', {
            position: 'bottom-right',
            autoClose: 1000
          });
          
          // Wait for coin animation
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!isLastQuestion) {
            setCurrentQuestion(currentQuestion + 1);
            setShowCoin(false);
          } else {
            setGameFinished(true);
            // Save quiz result
            await axios.post('http://localhost:5000/api/quiz/results', 
              {
                difficulty: selectedDifficulty,
                score: score + 1, // Include the current correct answer
                totalQuestions: questions.length,
                coinsEarned: score + 1,
                date: new Date().toISOString()
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchQuizHistory();
          }
        }
      } catch (error) {
        console.error('Error updating coins:', error);
        toast.error('Failed to update coin balance');
      } finally {
        setAwaitingCoinUpdate(false);
      }
    } else {
      // Wrong answer
      toast.error('Incorrect answer. Try again!', {
        position: 'bottom-right',
        autoClose: 1000
      });
      
      if (isLastQuestion) {
        // Save quiz result even if last answer was wrong
        try {
          const token = getAuthToken();
          await axios.post('http://localhost:5000/api/quiz/results', 
            {
              difficulty: selectedDifficulty,
              score,
              totalQuestions: questions.length,
              coinsEarned: score,
              date: new Date().toISOString()
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setGameFinished(true);
          fetchQuizHistory();
        } catch (error) {
          console.error('Error saving results:', error);
          toast.error('Failed to save quiz results');
        }
      }
    }
  };

  const handleCoinAnimationComplete = () => {
    setShowCoin(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'hover:bg-ninja-green/10';
      case 'medium':
        return 'hover:bg-ninja-green/10';
      case 'hard':
        return 'hover:bg-ninja-green/10';
      default:
        return 'hover:bg-ninja-green/10';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <AcademicCapIcon className="w-8 h-8 text-ninja-green" />;
      case 'medium':
        return <BeakerIcon className="w-8 h-8 text-ninja-green" />;
      case 'hard':
        return <TrophyIcon className="w-8 h-8 text-ninja-green" />;
      default:
        return null;
    }
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Start your journey with basic questions';
      case 'medium':
        return 'Challenge yourself with intermediate concepts';
      case 'hard':
        return 'Test your mastery with advanced problems';
      default:
        return '';
    }
  };

  const addCoins = async (amount: number) => {
    try {
      const token = getAuthToken();
      const response = await axios.post('http://localhost:5000/api/coins/add', 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update the coins state with the new balance from the server
        setCoins(response.data.newBalance);
        setCoinPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        setShowCoin(true);
      }
    } catch (error) {
      console.error('Error adding coins:', error);
      toast.error('Failed to update coin balance');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-ninja-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent mb-4"></div>
        <p className="text-white text-lg">
          {selectedDifficulty ? `Generating ${selectedDifficulty} questions...` : 'Loading...'}
        </p>
        <p className="text-white/60 text-sm mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-ninja-black">
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-ninja-green text-white rounded-lg hover:bg-ninja-green/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderGameSection = () => {
    switch (activeGame) {
      case 'quiz':
        return (
          <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
            <div className="max-w-3xl mx-auto">
              <CoinAnimation
                show={showCoin}
                onComplete={handleCoinAnimationComplete}
                position={coinPosition}
              />
              
              {!selectedDifficulty ? (
                <div className="text-center">
                  <h2 className="text-3xl font-monument text-white mb-6">Select Difficulty</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['easy', 'medium', 'hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => handleDifficultySelect(difficulty as Difficulty)}
                        className={`
                          p-6 rounded-xl border border-white/10 backdrop-blur-xl
                          ${getDifficultyColor(difficulty)}
                          transition-all duration-300 group
                        `}
                      >
                        <div className="flex flex-col items-center gap-4">
                          {getDifficultyIcon(difficulty)}
                          <h3 className="text-xl font-bold text-white capitalize">
                            {difficulty}
                          </h3>
                          <p className="text-sm text-white/60">
                            {getDifficultyDescription(difficulty)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent mb-4"></div>
                  <p className="text-white text-lg">Loading questions...</p>
                </div>
              ) : gameFinished ? (
                <div className="text-center p-8">
                  <h2 className="text-3xl font-monument text-white mb-4">Quiz Complete!</h2>
                  <p className="text-xl text-white mb-4">Your Score: {score}/{questions.length}</p>
                  <p className="text-lg text-yellow-400 mb-8">Coins Earned: {score}</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => {
                        setActiveGame(null);
                        setSelectedDifficulty(null);
                        setQuestions([]);
                        setCurrentQuestion(0);
                        setScore(0);
                        fetchCoinBalance();
                      }}
                      className="bg-ninja-green text-white px-6 py-3 rounded-lg font-monument hover:bg-ninja-green/80 transition-colors"
                    >
                      Back to Games
                    </button>
                    <button
                      onClick={() => {
                        setGameFinished(false);
                        setScore(0);
                        setCurrentQuestion(0);
                        fetchQuestions(selectedDifficulty);
                      }}
                      className="bg-ninja-green/20 text-white px-6 py-3 rounded-lg font-monument hover:bg-ninja-green/30 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              ) : questions.length > 0 && currentQuestion < questions.length ? (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-monument text-white">
                        Question {currentQuestion + 1}/{questions.length}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className="text-white">Score: {score}</span>
                        <span className="text-yellow-400">Coins: {coins}</span>
                      </div>
                    </div>
                    <p className="text-lg text-white" dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }} />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleAnswer(option, e)}
                        disabled={awaitingCoinUpdate}
                        className={`
                          bg-ninja-green/10 text-white p-4 rounded-lg text-left transition-colors
                          ${awaitingCoinUpdate 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-ninja-green/20'
                          }
                        `}
                        dangerouslySetInnerHTML={{ __html: option }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="text-white text-lg">No questions available. Please try again.</p>
                  <button
                    onClick={() => {
                      setSelectedDifficulty(null);
                      setQuestions([]);
                      setCurrentQuestion(0);
                      setScore(0);
                    }}
                    className="mt-4 bg-ninja-green text-white px-6 py-3 rounded-lg hover:bg-ninja-green/80 transition-colors"
                  >
                    Select Difficulty
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'wordscramble':
        return <WordScramble onEarnCoins={addCoins} />;
      case 'codecompletion':
        return <CodeCompletion onEarnCoins={addCoins} />;
      case 'codepattern':
        return <CodePattern onEarnCoins={addCoins} />;
      case 'aibattle':
        return <AIBattle onEarnCoins={addCoins} />;
      default:
        return (
          <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <SparklesIcon className="w-10 h-10 text-ninja-green animate-pulse" />
                  <h1 className="text-5xl font-bold text-white font-monument tracking-tight">Knowledge Arena</h1>
                </div>
                <p className="text-lg text-white/60">Challenge yourself and earn coins through different games!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {/* Quiz Card */}
                <div 
                  onClick={() => setActiveGame('quiz')}
                  className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl hover:border-ninja-green/50 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AcademicCapIcon className="w-8 h-8 text-ninja-green" />
                    <h2 className="text-2xl font-bold text-white">Quiz Challenge</h2>
                  </div>
                  <p className="text-white/60">Test your knowledge with our classic quiz format!</p>
                  <div className="mt-4 text-ninja-green">Earn 1 coin per correct answer</div>
                </div>

                {/* Word Scramble Card */}
                <div 
                  onClick={() => setActiveGame('wordscramble')}
                  className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl hover:border-ninja-purple/50 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <PuzzlePieceIcon className="w-8 h-8 text-ninja-purple" />
                    <h2 className="text-2xl font-bold text-white">Word Scramble</h2>
                  </div>
                  <p className="text-white/60">Unscramble tech terms and programming concepts!</p>
                  <div className="mt-4 text-ninja-purple">Earn 2 coins per word solved</div>
                </div>

                {/* Code Completion Card */}
                <div 
                  onClick={() => setActiveGame('codecompletion')}
                  className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl hover:border-yellow-500/50 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CodeBracketIcon className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">Code Completion</h2>
                  </div>
                  <p className="text-white/60">Complete code snippets with the correct syntax!</p>
                  <div className="mt-4 text-yellow-500">Earn 3 coins per completion</div>
                </div>

                {/* Code Pattern Card */}
                <div 
                  onClick={() => setActiveGame('codepattern')}
                  className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl hover:border-blue-500/50 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <LightBulbIcon className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">Code Pattern</h2>
                  </div>
                  <p className="text-white/60">Complete the next item in coding patterns!</p>
                  <div className="mt-4 text-blue-500">Earn 2 coins per pattern solved</div>
                </div>

                {/* AI Battle Card */}
                <div 
                  onClick={() => setActiveGame('aibattle')}
                  className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl hover:border-red-500/50 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="w-8 h-8 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">AI Battle</h2>
                  </div>
                  <p className="text-white/60">Race against AI to answer questions!</p>
                  <div className="mt-4 text-red-500">Earn 2 coins per victory</div>
                </div>
              </div>

              {/* Coin Display */}
              <div className="mt-8 text-center">
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {activeGame && activeGame !== 'quiz' && (
        <button
          onClick={() => {
            setActiveGame(null);
            fetchCoinBalance();
          }}
          className="fixed top-6 left-6 bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 z-50 border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Games
        </button>
      )}
      <CoinAnimation
        show={showCoin}
        onComplete={handleCoinAnimationComplete}
        position={coinPosition}
      />
      <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black/90 p-8">
        <div className="max-w-7xl mx-auto pt-8">
          {!activeGame && (
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <SparklesIcon className="w-12 h-12 text-ninja-green animate-pulse" />
                <h1 className="text-6xl font-bold text-white font-monument tracking-tight">Knowledge Arena</h1>
              </div>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Challenge yourself, compete with AI, and earn coins through exciting programming games!
              </p>
            </div>
          )}

          {!activeGame && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {/* Quiz Card */}
              <div 
                onClick={() => setActiveGame('quiz')}
                className="group relative bg-gradient-to-br from-ninja-black/90 to-ninja-black border border-white/10 rounded-2xl p-8 hover:border-ninja-green/50 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-ninja-green/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-ninja-green/0 to-ninja-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-ninja-green/10 rounded-xl">
                      <AcademicCapIcon className="w-8 h-8 text-ninja-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quiz Challenge</h2>
                  </div>
                  <p className="text-white/60 mb-6 min-h-[48px]">Test your knowledge with our classic quiz format across different difficulty levels!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-ninja-green font-medium">Earn 1 coin per correct answer</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ninja-green/50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Word Scramble Card */}
              <div 
                onClick={() => setActiveGame('wordscramble')}
                className="group relative bg-gradient-to-br from-ninja-black/90 to-ninja-black border border-white/10 rounded-2xl p-8 hover:border-ninja-purple/50 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-ninja-purple/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-ninja-purple/0 to-ninja-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-ninja-purple/10 rounded-xl">
                      <PuzzlePieceIcon className="w-8 h-8 text-ninja-purple" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Word Scramble</h2>
                  </div>
                  <p className="text-white/60 mb-6 min-h-[48px]">Unscramble tech terms and programming concepts in this fast-paced word game!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-ninja-purple font-medium">Earn 2 coins per word solved</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ninja-purple/50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Code Completion Card */}
              <div 
                onClick={() => setActiveGame('codecompletion')}
                className="group relative bg-gradient-to-br from-ninja-black/90 to-ninja-black border border-white/10 rounded-2xl p-8 hover:border-yellow-500/50 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-yellow-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                      <CodeBracketIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Code Completion</h2>
                  </div>
                  <p className="text-white/60 mb-6 min-h-[48px]">Complete code snippets and improve your syntax knowledge!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-500 font-medium">Earn 3 coins per completion</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500/50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Code Pattern Card */}
              <div 
                onClick={() => setActiveGame('codepattern')}
                className="group relative bg-gradient-to-br from-ninja-black/90 to-ninja-black border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <LightBulbIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Code Pattern</h2>
                  </div>
                  <p className="text-white/60 mb-6 min-h-[48px]">Identify and complete coding patterns to enhance your logical thinking!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-500 font-medium">Earn 2 coins per pattern solved</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500/50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* AI Battle Card */}
              <div 
                onClick={() => setActiveGame('aibattle')}
                className="group relative bg-gradient-to-br from-ninja-black/90 to-ninja-black border border-white/10 rounded-2xl p-8 hover:border-red-500/50 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-red-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <SparklesIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Battle</h2>
                  </div>
                  <p className="text-white/60 mb-6 min-h-[48px]">Challenge our AI in a thrilling battle of programming knowledge!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 font-medium">Earn 2 coins per victory</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500/50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'quiz' && renderGameSection()}
          {activeGame === 'wordscramble' && <WordScramble onEarnCoins={addCoins} />}
          {activeGame === 'codecompletion' && <CodeCompletion onEarnCoins={addCoins} />}
          {activeGame === 'codepattern' && <CodePattern onEarnCoins={addCoins} />}
          {activeGame === 'aibattle' && <AIBattle onEarnCoins={addCoins} />}
        </div>
      </div>
    </>
  );
};

export default Trivia; 