import { useState, useEffect } from 'react';

import wsSocket from '../ws/ws';

import UserList from './components/UserList';
interface Message {
  message: string;
}

// interface ChatMessage {
//   id: number;
//   message_text: string;
//   sender_id: number;
//   discussion_id: number;
//   created_at: string;
// }

const App = () => {
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [rooms, setRooms] = useState<[]>([]);

  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') ?? ''
  );

  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem('token')
  );
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
        .then((data) => {
          localStorage.setItem('token', data.token),
            setToken(data.token),
            localStorage.setItem('username', data.username.username);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Event listener for incoming messages from the WebSocket server
    const handleIncomingMessage = (event: MessageEvent) => {
      const newMessage: string = event.data;

      const parsedMessage = JSON.parse(newMessage);

      console.log(parsedMessage);

      setChatLog((prevLog) => [...prevLog, parsedMessage[0].message_text]);
    };

    // Set up the WebSocket event listener
    wsSocket.addMessageListener(handleIncomingMessage);

    // Clean up the WebSocket event listener on component unmount
    return () => {
      wsSocket.removeMessageListener(handleIncomingMessage);
    };
  }, []);

  useEffect(() => {
    if (token !== '' && token !== null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  useEffect(() => {
    const getRooms = async () => {
      const username = localStorage.getItem('username');
      const result = await fetch(
        `http://localhost:3000/rooms?username=${username}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        }
      );

      const data = await result.json();
      console.log(data);

      setRooms(data.rooms);
    };

    if (isAuthenticated) {
      getRooms();
    }
  }, [isAuthenticated, token, username]);

  const handleSendMessage = (): void => {
    console.log(chatLog);

    if (message.trim() !== '') {
      const newMessage: Message = { message };

      //make second arg dynamic *
      wsSocket.sendMessage(JSON.stringify(newMessage), 3);

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
        <>
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
          <div>
            <h2>Your chats</h2>
            <ul>
              {rooms?.map((room: { user1: string; user2: string }, index) => (
                <li key={index}>
                  {room.user1 === username ? room.user2 : room.user1}
                </li>
              ))}
            </ul>
          </div>

          <UserList />
        </>
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
