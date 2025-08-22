// App.jsx
import axios from "axios";
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

  // Fetch random word once
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await axios.get("/api/api/fe/wordle-words");
        const words = res.data;
        const randomIndex = Math.floor(Math.random() * words.length);
        setTargetWord(words[randomIndex].toUpperCase());
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };
    fetchWords();
  }, []);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !targetWord) return;

      if (/^[A-Za-z]$/.test(e.key)) {
        if (currentCol < 5) {
          const newBoard = board.map((row) => [...row]);
          newBoard[currentRow][currentCol] = e.key.toUpperCase();
          setBoard(newBoard);
          setCurrentCol(currentCol + 1);
        }
      } else if (e.key === "Backspace") {
        if (currentCol > 0) {
          const newBoard = board.map((row) => [...row]);
          newBoard[currentRow][currentCol - 1] = "";
          setBoard(newBoard);
          setCurrentCol(currentCol - 1);
        }
      } else if (e.key === "Enter") {
        if (currentCol === 5) {
          checkGuess();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const checkGuess = () => {
    const guess = board[currentRow].join("");
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
  }
  };
console.log(targetWord);
  return (
    <div className="App">
      <h1>Wordle Clone</h1>
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
      {message && <p className="result">{message}</p>}
    </div>
  );
}

export default App;
