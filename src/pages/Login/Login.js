import React, { useState } from 'react';
import './Login.css';
import {  useHistory } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const history = useHistory();

  const users = [
    { "username": "gleb_m", 
      "password": "123", 
      "name": "Глеб Мишагин", 
      "position": "Админ" 
    }, 
    { 
      "username": "andrey_e", 
      "password": "Ezhov05", 
      "name": "Ежов Андрей", 
      "position": "Директор" 
    }, 
    { 
      "username": "anna_k", 
      "password": "Anya06", 
      "name": "Киршина Анна", 
      "position": "Менеджер cнабжения" 
    }, 
    { "username": "evgeniy_k",
      "password": "nGM@3ZmI", 
      "name": "Кузовой Евгений", 
      "position": "Менеджер по продажам" 
    }, 
    { 
      "username": "dana_p", 
      "password": "dana1234", 
      "name": "Дана Проскурина", 
      "position": "Менеджер по продажам" 
    }, 
    { "username": "dmitriy_n",
      "password": "Novozh123", 
      "name": "Дмитрий Новожилов", 
      "position": "Менеджер по продажам" 
    }, 
    { 
      "username": "andrey_v", 
      "password": "AndreyV", 
      "name": "Андрей Ворончихин", 
      "position": "Операционный менеджер" 
    },
    {
      "username": "lopatinaT", 
      "password": "GU6po7nu", 
      "name": "Татьяна Лопатина", 
      "position": "Экономист" 
    },
    {
      "username": "liza_k", 
      "password": "LizaKur", 
      "name": "Елизавета Курченко", 
      "position": "Менеджер документооборота" 
    }
  ];

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      history.push(`/home/${user.name}/${user.position}`);
    } else {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <div className="Login">
      <div className="container">
        <div className="rectangle rectangle-1">
          <div className='NOC'>
            <h1 className='h1'>PointB</h1>
          </div>
          <div className='Textfields'>
            <input type="text" placeholder="Логин" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="button" onClick={handleLogin}>Вход</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>  
      </div>
    </div>
  );
}
