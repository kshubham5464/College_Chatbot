import React from 'react';
import Chatbot from './components/Chatbot';
import './App.css';
// import KeyPressInput from './components/KeyPressInput';

function App() {
  return (
    <div className="App">
      <h2 style={{ textAlign: 'center' ,fontSize: '2rem', }}>Hello User, Welcome to our Chatbot. Please type your query.</h2>
      <Chatbot />
      {/* <KeyPressInput /> */}
    </div>
  );
}

export default App;
