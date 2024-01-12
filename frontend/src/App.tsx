import { useState, useEffect } from 'react';

import wsSocket from '../ws/ws';

interface Message {
  message: string;
}

const App = () => {
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<string[]>([]);

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
    </>
  );
};

export default App;
