import { useState } from "react"; // lets react store changing data
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState(""); // stores what user types
  const [summary, setSummary] = useState(""); // stores AI response
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function summarizeText() {
    if (!text.trim()) {
      setError("Please enter text first.");
      return;
    }

    setError("");
    setSummary("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/summarize", {
        text: text,
      });

      setSummary(response.data.summary);
    } catch (err) {
      setError(
        "Something went wrong. Make sure the backend and Ollama are running.",
      );
    }

    setLoading(false);
  }

  function clearText() {
    setText("");
    setSummary("");
    setError("");
  }

  return (
    <div className="page">
      <h1>Summarizer Agent</h1>

      <textarea
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            summarizeText();
          }
        }}
      />

      <p className="char-count">{text.length} characters</p>

      {error && <p className="error">{error}</p>}
      <button onClick={summarizeText} disabled={loading}>
        {loading ? "Loading..." : "Summarize"}
      </button>
<button onClick={clearText}>
  Clear
</button>
      {summary && (
        <div className="summary-box">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
