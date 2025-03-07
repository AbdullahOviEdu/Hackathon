import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CodeChallenge {
  code: string;
  missing: string;
  options: string[];
  explanation: string;
}

interface CodeCompletionProps {
  onEarnCoins: (amount: number) => Promise<void>;
}

const CodeCompletion: React.FC<CodeCompletionProps> = ({ onEarnCoins }) => {
  const [currentChallenge, setCurrentChallenge] = useState<CodeChallenge | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [awaitingCoinUpdate, setAwaitingCoinUpdate] = useState(false);

  const generateChallenge = async () => {
    try {
      setLoading(true);
      const groqApiKey = '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';
      
      const prompt = `Generate a code completion challenge with the following format:
      {
        "code": "A short code snippet with a missing part (marked as ___)",
        "missing": "The correct missing part",
        "options": ["correct answer", "wrong option 1", "wrong option 2", "wrong option 3"],
        "explanation": "Brief explanation of what this code does"
      }
      Make it educational and focus on JavaScript/TypeScript concepts. The code should be 3-5 lines long.`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a coding instructor that generates code completion challenges.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      let challengeData;

      try {
        // Try to parse the JSON response
        challengeData = JSON.parse(content);
      } catch (e) {
        // If parsing fails, use regex to extract the JSON object
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          challengeData = JSON.parse(jsonMatch[0]);
        }
      }

      if (challengeData && challengeData.code && challengeData.missing) {
        setCurrentChallenge(challengeData);
      } else {
        throw new Error('Invalid challenge data');
      }
    } catch (error) {
      console.error('Error generating challenge:', error);
      // Fallback to a default challenge
      setCurrentChallenge({
        code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.___((num) => num * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]",
        missing: "map",
        options: ["map", "filter", "reduce", "forEach"],
        explanation: "The map method creates a new array with the results of calling a function for every array element."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateChallenge();
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

  const handleAnswer = async (answer: string) => {
    if (!currentChallenge || awaitingCoinUpdate) return;

    if (answer === currentChallenge.missing) {
      setAwaitingCoinUpdate(true);
      try {
        await onEarnCoins(3);
        setScore(score + 1);
        setMessage('Correct! +3 coins');
        generateChallenge();
      } catch (error) {
        setMessage('Correct, but failed to update coins');
        console.error('Error updating coins:', error);
      } finally {
        setAwaitingCoinUpdate(false);
      }
    } else {
      setMessage('Try again! Hint: ' + currentChallenge.explanation);
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    generateChallenge();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent mb-4"></div>
              <p className="text-white text-lg">Generating challenge...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
      <div className="max-w-3xl mx-auto">
        <div className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white font-monument mb-2">Code Completion</h2>
            <p className="text-white/60">Complete the missing code!</p>
          </div>

          {gameActive && currentChallenge ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">Score: {score}</div>
                <div className="text-white">Time: {timeLeft}s</div>
              </div>

              <div className="mb-8">
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm md:text-base font-mono text-white whitespace-pre-wrap">
                    {currentChallenge.code}
                  </code>
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={awaitingCoinUpdate}
                    className={`px-6 py-4 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 ${
                      awaitingCoinUpdate
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-ninja-green/10 hover:border-ninja-green/50'
                    }`}
                  >
                    <span className="text-lg font-mono text-white">{option}</span>
                  </button>
                ))}
              </div>

              {message && (
                <div className={`mt-4 text-lg text-center ${
                  message.includes('Correct!') 
                    ? 'text-ninja-green' 
                    : message.includes('failed') 
                      ? 'text-yellow-500'
                      : 'text-yellow-500'
                }`}>
                  {message}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-xl text-white mb-2">Final Score: {score}</p>
              <p className="text-lg text-yellow-400 mb-6">Coins Earned: {score * 3}</p>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-ninja-green text-white rounded-lg hover:bg-ninja-green/80 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeCompletion; 