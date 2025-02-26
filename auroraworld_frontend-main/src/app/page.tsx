'use client';

import { useState, useEffect } from 'react';
import { login } from '@/api/index';
import '@/styles/login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem('accessToken');
        if (isLoggedIn) {
            window.location.href = '/weblink';
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login({ username, password });
            window.location.href = '/weblink';
        } catch (err) {
            console.error('로그인 실패:', err);
            setError('아이디와 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const goToRegister = () => {
        window.location.href = '/register';
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className="register-link">
                    <span>회원이 아니신가요?</span>
                    <button className="register-button" onClick={goToRegister}>
                        가입하러 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
