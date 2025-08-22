import words from "./data/words.json";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [targetWord, setTargetWord] = useState("");
  const [board, setBoard] = useState(Array(6).fill("").map(() => Array(5).fill("")));
  const [colors, setColors] = useState(Array(6).fill("").map(() => Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Pick random word at start
  useEffect(() => {
    resetGame();
  }, []);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !targetWord) return;
      handleInput(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleInput = (key) => {
    if (/^[A-Za-z]$/.test(key)) {
      if (currentCol < 5) {
        const newBoard = board.map((row) => [...row]);
        newBoard[currentRow][currentCol] = key.toUpperCase();
        setBoard(newBoard);
        setCurrentCol(currentCol + 1);
      }
    } else if (key === "Backspace") {
      if (currentCol > 0) {
        const newBoard = board.map((row) => [...row]);
        newBoard[currentRow][currentCol - 1] = "";
        setBoard(newBoard);
        setCurrentCol(currentCol - 1);
      }
    } else if (key === "Enter") {
      if (currentCol === 5) {
        checkGuess();
      }
    }
  };

  const checkGuess = () => {
    const guess = board[currentRow].join("");

    // ✅ Check if guess is a valid word
    if (!words.includes(guess.toLowerCase())) {
      setMessage("❗ Not a valid word");
      return;
    }

    const newColors = [...colors];

    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetWord[i]) {
        newColors[currentRow][i] = "green";
      } else if (targetWord.includes(guess[i])) {
        newColors[currentRow][i] = "yellow";
      } else {
        newColors[currentRow][i] = "gray";
      }
    }

    setColors(newColors);

    if (guess === targetWord) {
      setGameOver(true);
      setMessage("🎉 You Win!");
    } else if (currentRow === 5) {
      setGameOver(true);
      setMessage("❌ Game Over! The word was " + targetWord);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
      setMessage(""); // clear any old error
    }
  };

  // ✅ Restart game
  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setTargetWord(words[randomIndex].toUpperCase());
    setBoard(Array(6).fill("").map(() => Array(5).fill("")));
    setColors(Array(6).fill("").map(() => Array(5).fill("")));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setMessage("");
  };

  // ✅ On-screen keyboard layout
  const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <div className="App">
      <h1>Wordle Clone</h1>

      {/* Game board */}
      <div className="board">
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((letter, c) => (
              <div key={c} className={`cell ${colors[r][c]}`}>
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Message */}
      {message && <p className="result">{message}</p>}

      {/* Restart button */}
      {gameOver && (
        <button className="restart" onClick={resetGame}>
          🔄 Play Again
        </button>
      )}

      {/* On-screen keyboard */}
      <div className="keyboard">
        {keyboardRows.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.split("").map((k) => (
              <button
                key={k}
                onClick={() => handleInput(k)}
                className="key-btn"
              >
                {k}
              </button>
            ))}
            {i === 2 && (
              <>
                <button onClick={() => handleInput("Enter")} className="key-btn wide">Enter</button>
                <button onClick={() => handleInput("Backspace")} className="key-btn wide">⌫</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
