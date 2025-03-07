import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  match: string;
}

interface MemoryMatchProps {
  onEarnCoins: (amount: number) => void;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onEarnCoins }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const cardContents = [
    { content: '{ }', match: 'Object' },
    { content: 'Object', match: '{ }' },
    { content: '[ ]', match: 'Array' },
    { content: 'Array', match: '[ ]' },
    { content: '( )', match: 'Function' },
    { content: 'Function', match: '( )' },
    { content: '<>', match: 'Component' },
    { content: 'Component', match: '<>' },
    { content: '=>', match: 'Arrow' },
    { content: 'Arrow', match: '=>' },
    { content: 'async', match: 'await' },
    { content: 'await', match: 'async' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards and shuffle them
    const shuffledCards = [...cardContents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8) // Take 8 pairs for a 4x4 grid
      .flatMap((item, index) => [
        {
          id: index * 2,
          content: item.content,
          isFlipped: false,
          isMatched: false,
          match: item.match
        },
        {
          id: index * 2 + 1,
          content: item.match,
          isFlipped: false,
          isMatched: false,
          match: item.content
        }
      ])
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (id: number) => {
    // Prevent clicking if two cards are already flipped or the same card is clicked
    if (flippedCards.length === 2 || flippedCards.includes(id)) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.content === secondCard.match) {
        // Match found
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(matchedPairs + 1);
          setFlippedCards([]);
          onEarnCoins(3); // Award 3 coins for each match
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === 8) { // All pairs found
      setGameOver(true);
    }
  }, [matchedPairs]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-ninja-black to-ninja-black/95">
      <div className="max-w-4xl mx-auto">
        <div className="bg-ninja-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white font-monument mb-2">Memory Match</h2>
            <p className="text-white/60">Match the programming concepts with their symbols!</p>
          </div>

          {gameOver ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Congratulations!</h3>
              <p className="text-xl text-white mb-2">Moves: {moves}</p>
              <p className="text-lg text-yellow-400 mb-6">Coins Earned: {matchedPairs * 3}</p>
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">Moves: {moves}</div>
                <div className="text-yellow-400">Matches: {matchedPairs}/8</div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {cards.map(card => (
                  <div
                    key={card.id}
                    onClick={() => !card.isMatched && handleCardClick(card.id)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg cursor-pointer
                      transition-all duration-300 transform hover:scale-105
                      ${card.isMatched
                        ? 'bg-yellow-500/20 border-2 border-yellow-500'
                        : flippedCards.includes(card.id)
                        ? 'bg-white/10 border-2 border-white/30'
                        : 'bg-white/5 border border-white/10 hover:border-yellow-500/50'
                      }
                    `}
                  >
                    <span className={`
                      text-xl font-mono
                      ${card.isMatched
                        ? 'text-yellow-500'
                        : flippedCards.includes(card.id)
                        ? 'text-white'
                        : 'text-transparent'
                      }
                    `}>
                      {card.content}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryMatch; 