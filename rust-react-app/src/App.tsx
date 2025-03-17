import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the custom CSS file

function App() {
  const [message, setMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedOption, setSelectedOption] = useState("Summarize");
  const [error, setError] = useState("");

  // Handle form submission and send POST request to the backend
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text.");
      return; // Prevent submission if no text is entered
    }
    setError(""); // Clear any existing errors

    const data = {
      text: inputText,
      option: selectedOption,
    };

    try {
      // const response = await axios.post("http://127.0.0.1:3000/process", data);
      const response = await axios.post(
        `http://127.0.0.1:8080/process`,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false, // Set to true if using cookies or credentials
        }
      );
      setMessage(response.data.message); // Assuming backend returns { message: ... }
    } catch (error) {
      console.error("Error sending data", error);
      setMessage("Failed to generate output.");
    }
  };

  // Clear the input text and reset the state
  const handleClear = () => {
    setInputText("");
    setMessage("");
    setError("");
  };

  return (
    <div className="container">
      <h1>Text Manipulator App</h1>
      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <h2>Enter the Input</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here..."
          className="textarea"
        ></textarea>

        {/* Error message for empty input */}
        {error && <p className="error">{error}</p>}

        {/* Dynamic dropdown options */}
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="select"
        >
          <option key="option1" value="Summarize">
            Summarize
          </option>
          <option key="option2" value="Paraphrase">
            Paraphrase
          </option>
          <option key="option3" value="Expand">
            Expand
          </option>
          <option key="option4" value="Translate">
            Translate
          </option>
        </select>

        <div className="button-group">
          <button type="button" onClick={handleGenerate} className="button">
            Generate
          </button>
          <button type="button" onClick={handleClear} className="button-clear">
            Clear
          </button>
        </div>
      </form>

      <h2>Generated Output</h2>
      <div className="card card-output">
        <div>
          {message ? (
            <p>{message}</p>
          ) : (
            <p className="placeholder">No output yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
