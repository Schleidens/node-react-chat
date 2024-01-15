import { useState, useEffect } from 'react';

import wsSocket from '../ws/ws';

interface Message {
  message: string;
}

const App = () => {
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const [username, setUsername] = useState<string>('');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    try {
      await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => response.json())
        .then((data) => localStorage.setItem('token', data.token));

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    window.location.reload();
  };

  useEffect(() => {
    // Event listener for incoming messages from the WebSocket server
    const handleIncomingMessage = (event: MessageEvent) => {
      const newMessage: string = event.data;
      console.log(event.data);

      setChatLog((prevLog) => [...prevLog, newMessage]);
    };

    // Set up the WebSocket event listener
    wsSocket.addMessageListener(handleIncomingMessage);

    // Clean up the WebSocket event listener on component unmount
    return () => {
      wsSocket.removeMessageListener(handleIncomingMessage);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token !== '' && token !== null) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSendMessage = (): void => {
    if (message.trim() !== '') {
      const newMessage: Message = { message };

      // Send the message to the WebSocket server
      wsSocket.sendMessage(JSON.stringify(newMessage));

      // Update the local chat log
      // setChatLog((prevLog) => [...prevLog, newMessage]);
      setMessage('');
    }
  };

  return (
    <>
      {!isAuthenticated && (
        <div className='login'>
          <div className='form'>
            <input
              type='text'
              name='username'
              id=''
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>

          <div>Please login to access the chat</div>
        </div>
      )}
      {isAuthenticated && (
        <div className='chat'>
          <ul>
            {chatLog.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>

          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type your message...'
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      {isAuthenticated && (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default App;
