import { useEffect, useState } from 'react';

interface Message {
  id: number;
  sender_id: number;
  message_text: string;
  created_at: string;
}

interface Users {
  id: number;
  username: string;
}

function ChatRoom(props: { discussion_id: number }) {
  const [messages, setMessage] = useState<Message[]>([]);
  const [participant, setParticipant] = useState<Users[]>([]);

  useEffect(() => {
    const getRoom = async () => {
      const token = localStorage.getItem('token');
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/messages?discussion_id=${
          props.discussion_id
        }`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setMessage(data.messages);
          setParticipant(data.participant);
          console.log(data);
        });
    };
  }, [props.discussion_id]);
  return <div>index</div>;
}

export default ChatRoom;
