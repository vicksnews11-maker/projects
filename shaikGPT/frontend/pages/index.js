import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const res = await axios.post("http://shaikgpt-backend:8000/chat", null, {
      params: { prompt }
    });

    setMessages([...messages, { q: prompt, a: res.data.response }]);
    setPrompt("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>ShaikGPT 🤖</h2>
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <b>You:</b> {m.q}<br/>
            <b>ShaikGPT:</b> {m.a}
            <hr/>
          </div>
        ))}
      </div>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
