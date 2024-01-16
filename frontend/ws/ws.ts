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

  sendMessage(message: string, discussion_id: number): void {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/chat?discussion_id=${discussion_id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
