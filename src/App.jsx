import { useState } from "react";
import "./App.css";

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  function calculateWinner(board) {
    for (let pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: pattern };
      }
    }
    return null;
  }

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];

  const isDraw = !winner && board.every((cell) => cell !== null);

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <div className="status">
        {winner
          ? `🏆 Winner: ${winner}`
          : isDraw
          ? "🤝 Game Draw!"
          : `Turn: ${isXTurn ? "X" : "O"}`}
      </div>

      <div className="board">
        {board.map((cell, index) => {
          const isWinningCell = winningLine.includes(index);

          return (
            <button
              key={index}
              className={`cell ${cell ? "filled" : ""} ${
                isWinningCell ? "winner-cell" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}