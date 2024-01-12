class WebSocketInstance {
  private socket: WebSocket;
  private messageListeners: ((event: MessageEvent) => void)[] = [];

  constructor() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      this.handleIncomingMessage(event);
    };
  }

  sendMessage(message: string): void {
    fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwaWRlciIsImlhdCI6MTcwNTAwNDQyNCwiZXhwIjoxNzA1MTcwMDI0fQ.wux8pf1-Ot3pStzerEUZqnt4vA6xeeIGQYCGONHnKM4`,
        'content-type': 'application/json',
      },
      body: message,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  addMessageListener(listener: (event: MessageEvent) => void): void {
    this.messageListeners.push(listener);
    console.log(MessageEvent);
  }

  removeMessageListener(listener: (event: MessageEvent) => void): void {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }

  private handleIncomingMessage(event: MessageEvent): void {
    this.messageListeners.forEach((listener) => {
      listener(event);
    });
  }
}

const wsSocket = new WebSocketInstance();

export default wsSocket;
