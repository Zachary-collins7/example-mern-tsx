import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import MainTemplate from './templates/main';


function App() {
  useEffect(() => {
    fetch('/api/v1/test', {
      method: 'GET',
      headers: {
        'accepts': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => console.log(`Api test responded with status: ${res.status} ${res.statusText}`))
      .catch(err => console.warn("Api not connected"))
  }, []);

  
  const loginTest = () => {
    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'accepts': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'bob@example.com',
        password: 'password'
      })
    }).then(res => {
      console.log(res.ok);
      verifyCookies()
    })
    .catch(err => {
      console.log(err);
    })
  }

  const verifyCookies = () => {
    fetch('/api/v1/auth/test', {
      headers: {
        'accepts': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res.ok);
    })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <MainTemplate>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <button onClick={loginTest}>Test Login</button>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </MainTemplate>
  );
}

export default App;