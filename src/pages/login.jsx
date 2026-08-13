import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { useAuth } from '../context/useAuth';
import './Login.css';

const dictionary = {
    ru: {
        title: 'Вход в систему',
        subtitle: 'ИЗПИ · Панель управления',
        username: 'Имя пользователя',
        password: 'Пароль',
        submit: 'Войти',
        error: 'Неверные учётные данные',
        errorConnection: 'Ошибка соединения с сервером',
        footer: 'Институт законодательства и правовой информации РК',
        back: '← На главную',
    },
    kk: {
        title: 'Жүйеге кіру',
        subtitle: 'ЗҚАИ · Басқару панелі',
        username: 'Пайдаланушы аты',
        password: 'Құпия сөз',
        submit: 'Кіру',
        error: 'Тіркелгі деректері дұрыс емес',
        errorConnection: 'Серверге қосылу қатесі',
        footer: 'ҚР Заңнама және құқықтық ақпарат институты',
        back: '← Басты бетке',
    }
};

export default function Login() {
    const { login } = useAuth();
    const { language } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const t = dictionary[language] || dictionary.ru;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.user, data.token);
                navigate('/dashboard');
            } else {
                setError(t.error);
            }
        } catch {
            setError(t.errorConnection);
        }
    };

    return (
        <div className="login-container">
            {/* Decorative background circles */}
            <div className="login-bg-decor">
                <div className="login-bg-circle" />
                <div className="login-bg-circle" />
                <div className="login-bg-circle" />
            </div>

            <div className="login-box">
                {/* Icon */}
                <div className="login-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>

                <h2>{t.title}</h2>
                <p className="login-subtitle">{t.subtitle}</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            id="login-username"
                            type="text"
                            placeholder={t.username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <input
                            id="login-password"
                            type="password"
                            placeholder={t.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit">{t.submit}</button>
                </form>

                <div className="login-footer">
                    <p>{t.footer}</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        <Link to="/">{t.back}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
