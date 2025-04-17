import React from 'react';
import Chatbot from './components/Chatbot';
import './App.css';
import oipImage from './assets/OIP.jpeg'; // ✅ Correct import

function App() {
  return (
    <div className="App">
      <img src={oipImage} alt="chatbot" className="chatbot-image" />
      <h2 style={{ textAlign: 'center', fontSize: '2rem' }}>
        Hello User, Welcome to our Chatbot. Please ask your query.
      </h2>
      <Chatbot />
    </div>
  );
}

export default App;
