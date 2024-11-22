import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // Estado para guardar los datos del usuario

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedUserData = localStorage.getItem('user_data');
        if (storedAccessToken && storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8085/api/auth/login/', {
                email: username,
                contraseña: password,
            });

            const { access, refresh, rol, nombre } = response.data;

            // Guardar tokens y datos del usuario en localStorage
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_data', JSON.stringify({ nombre, rol }));
            
            setUserData({ nombre, rol });
            setIsLoggedIn(true);
            alert(`Bienvenido, ${nombre}`);
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setIsLoggedIn(false);
        setUserData(null);
        alert('Sesión cerrada');
    };

    return (
        <div>
            <h2>{isLoggedIn ? 'Bienvenido' : 'Iniciar Sesión'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <div>
                    <p><strong>Nombre:</strong> {userData.nombre}</p>
                    <p><strong>Rol:</strong> {userData.rol}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Login;
