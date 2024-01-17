import { useEffect, useState } from 'react';

interface Users {
  id: number;
  username: string;
}

const UserList = () => {
  const [users, setUsers] = useState<Users[]>([]);
  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem('token');
      fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.users);
          console.log(data);
        });
    };

    getUsers();
  }, []);
  return (
    <>
      <div>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserList;
