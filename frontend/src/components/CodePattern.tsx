import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pattern {
  sequence: string[];
  description: string;
}

interface CodePatternProps {
  onEarnCoins: (amount: number) => Promise<void>;
}

const CodePattern: React.FC<CodePatternProps> = ({ onEarnCoins }) => {
  const [currentPattern, setCurrentPattern] = useState<string[]>([]);
  const [patternDescription, setPatternDescription] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameActive, setGameActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [awaitingCoinUpdate, setAwaitingCoinUpdate] = useState(false);

  const generatePattern = async () => {
    try {
      setLoading(true);
      const groqApiKey = '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';
      
      const prompt = `Generate a coding pattern sequence in the following JSON format:
      {
        "sequence": ["first", "second", "third", "fourth"],
        "description": "A brief description of what this pattern represents"
      }
      The sequence should be 4 items long and follow a logical pattern related to programming concepts, methods, or syntax. The last item should complete the pattern.`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a coding instructor that generates logical programming patterns.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
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
      let patternData: Pattern;

      try {
        // Try to parse the JSON response
        patternData = JSON.parse(content);
      } catch (e) {
        // If parsing fails, use regex to extract the JSON object
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          patternData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid pattern data');
        }
      }

      if (patternData && Array.isArray(patternData.sequence) && patternData.sequence.length === 4) {
        const sequence = patternData.sequence;
        const correctAnswer = sequence[3];
        
        // Generate wrong options by using parts from other patterns
        const wrongOptions = [
          sequence[0],
          sequence[1],
          'undefined',
          'null',
          'break',
          'continue',
          'return',
          'throw'
        ].filter(opt => opt !== correctAnswer).slice(0, 3);

        setCurrentPattern(sequence.slice(0, 3));
        setPatternDescription(patternData.description);
        setOptions([correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5));
        setMessage('');
      } else {
        throw new Error('Invalid pattern data');
      }
    } catch (error) {
      console.error('Error generating pattern:', error);
      // Use fallback pattern if API fails
      const fallbackPattern = {
        sequence: ['const', 'let', 'var', 'const'],
        description: 'Variable declaration keywords in JavaScript'
      };
      const correctAnswer = fallbackPattern.sequence[3];
      const wrongOptions = ['class', 'function', 'import'];
      
      setCurrentPattern(fallbackPattern.sequence.slice(0, 3));
      setPatternDescription(fallbackPattern.description);
      setOptions([correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5));
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePattern();
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
    if (awaitingCoinUpdate) return;

    const correctAnswer = options.find(opt => 
      currentPattern.concat([opt]).join(' ') === currentPattern.concat([opt]).join(' ')
    );

    if (answer === correctAnswer) {
      setAwaitingCoinUpdate(true);
      try {
        await onEarnCoins(2);
        setScore(score + 1);
        setMessage('Correct! +2 coins');
        generatePattern();
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

  const restartGame = () => {
    setScore(0);
    setTimeLeft(45);
    setGameActive(true);
    generatePattern();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
        <div className="max-w-3xl mx-auto">
          <div className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-white text-lg">Generating pattern...</p>
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
            <h2 className="text-3xl font-bold text-white font-monument mb-2">Code Pattern</h2>
            <p className="text-white/60">Complete the coding pattern sequence!</p>
          </div>

          {gameActive ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">Score: {score}</div>
                <div className="text-white">Time: {timeLeft}s</div>
              </div>

              <div className="text-center mb-8">
                <p className="text-white/80 mb-6">{patternDescription}</p>
                <div className="flex items-center justify-center gap-4 mb-8">
                  {currentPattern.map((item, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-6 py-3"
                    >
                      <span className="text-xl font-mono text-blue-400">{item}</span>
                    </div>
                  ))}
                  <div className="bg-blue-500/10 border-2 border-dashed border-blue-500/30 rounded-lg px-6 py-3">
                    <span className="text-xl font-mono text-blue-300">?</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={awaitingCoinUpdate}
                      className={`px-6 py-3 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 ${
                        awaitingCoinUpdate
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-500/10 hover:border-blue-500/50'
                      }`}
                    >
                      <span className="text-lg font-mono text-white">{option}</span>
                    </button>
                  ))}
                </div>

                {message && (
                  <div className={`mt-6 text-lg ${
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
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

export default CodePattern; 