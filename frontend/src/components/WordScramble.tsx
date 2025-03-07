import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WordData {
  word: string;
  description: string;
}

interface WordScrambleProps {
  onEarnCoins: (amount: number) => Promise<void>;
}

const WordScramble: React.FC<WordScrambleProps> = ({ onEarnCoins }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [awaitingCoinUpdate, setAwaitingCoinUpdate] = useState(false);

  const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const getNewWord = async () => {
    try {
      setLoading(true);
      const groqApiKey = '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';
      
      const prompt = `Generate a programming or technology-related term and its description in the following JSON format:
      {
        "word": "a single programming or tech term (no spaces)",
        "description": "A brief description of what this term means"
      }
      The word should be a single term related to programming, technology, or computer science.`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a coding instructor that generates programming terms and their descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      let wordData: WordData;

      try {
        // Try to parse the JSON response
        wordData = JSON.parse(content);
      } catch (e) {
        // If parsing fails, use regex to extract the JSON object
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          wordData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid word data');
        }
      }

      if (wordData && wordData.word && wordData.description) {
        setCurrentWord(wordData.word.toLowerCase());
        setCurrentDescription(wordData.description);
        let scrambled = scrambleWord(wordData.word.toLowerCase());
        while (scrambled === wordData.word.toLowerCase()) {
          scrambled = scrambleWord(wordData.word.toLowerCase());
        }
        setScrambledWord(scrambled);
      } else {
        throw new Error('Invalid word data');
      }
    } catch (error) {
      console.error('Error generating word:', error);
      // Use fallback word if API fails
      const fallbackWords = [
        { word: 'algorithm', description: 'A step-by-step procedure for solving a problem or accomplishing a task' },
        { word: 'function', description: 'A reusable block of code that performs a specific task' },
        { word: 'variable', description: 'A container for storing data values' }
      ];
      const fallback = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      setCurrentWord(fallback.word);
      setCurrentDescription(fallback.description);
      setScrambledWord(scrambleWord(fallback.word));
    } finally {
      setLoading(false);
      setUserInput('');
      setMessage('');
    }
  };

  const checkAnswer = async () => {
    if (awaitingCoinUpdate) return;

    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setAwaitingCoinUpdate(true);
      try {
        await onEarnCoins(2);
        setScore(score + 1);
        setMessage('Correct! +2 coins');
        getNewWord();
      } catch (error) {
        setMessage('Correct, but failed to update coins');
        console.error('Error updating coins:', error);
      } finally {
        setAwaitingCoinUpdate(false);
      }
    } else {
      setMessage('Try again!');
    }
  };

  useEffect(() => {
    getNewWord();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !awaitingCoinUpdate) {
      checkAnswer();
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    getNewWord();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-purple border-t-transparent mb-4"></div>
              <p className="text-white text-lg">Generating word...</p>
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
            <h2 className="text-3xl font-bold text-white font-monument mb-2">Word Scramble</h2>
            <p className="text-white/60">Unscramble the programming terms!</p>
          </div>

          {gameActive ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">Score: {score}</div>
                <div className="text-white">Time: {timeLeft}s</div>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-ninja-purple mb-4">{scrambledWord}</div>
                <p className="text-white/80 mb-6">{currentDescription}</p>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full max-w-md px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-xl focus:outline-none focus:border-ninja-purple"
                  placeholder="Type your answer..."
                  disabled={awaitingCoinUpdate}
                  autoFocus
                />
                <div className="mt-4">
                  <button
                    onClick={checkAnswer}
                    disabled={awaitingCoinUpdate}
                    className={`px-6 py-2 bg-ninja-purple text-white rounded-lg transition-colors ${
                      awaitingCoinUpdate 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-ninja-purple/80'
                    }`}
                  >
                    {awaitingCoinUpdate ? 'Updating...' : 'Submit'}
                  </button>
                </div>
                {message && (
                  <div className={`mt-4 text-lg ${
                    message.includes('Correct!') 
                      ? 'text-ninja-green' 
                      : message.includes('failed') 
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-xl text-white mb-2">Final Score: {score}</p>
              <p className="text-lg text-yellow-400 mb-6">Coins Earned: {score * 2}</p>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-ninja-purple text-white rounded-lg hover:bg-ninja-purple/80 transition-colors"
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

export default WordScramble; 