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

    const prompt =
      {
        Summarize: `Summarize the following text: ${data.text}`,
        Paraphrase: `Paraphrase the following text: ${data.text}`,
        Expand: `Expand on the following text: ${data.text}`,
        Translate: `Translate the following text to Spanish: ${data.text}`,
      }[data.option] || "Invalid option selected.";

    try {
      // OpenAI API call
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o", // Ensure this is the correct model name
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ response });
      const generatedText = response.data.choices[0].text.trim();
      console.log(`Processed successfully: ${generatedText}`);

      if (!response.status) {
        throw new Error("Failed to fetch data");
      }

      const data = await response?.data?.json();
      console.log("Response from OpenAI:", data);
      setMessage(data); // Assuming backend returns { message: ... }
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
