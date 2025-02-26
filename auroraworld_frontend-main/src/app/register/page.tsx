'use client';

import { useState, useEffect } from 'react';
import { register, checkUsername } from '@/api';
import '@/styles/register.css';
import '@/styles/modal/registerModal.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem('accessToken');
        if (isLoggedIn) {
            window.location.href = '/weblink';
        }
    }, []);

    const validatePassword = (password: string) => {
        const isValid = password.length >= 8;
        setIsPasswordValid(isValid);
        setPasswordError(isValid ? '사용 가능한 비밀번호입니다.' : '비밀번호는 8자 이상이어야 합니다.');
    };

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    useEffect(() => {
        const validateAndCheckUsername = async (username: string) => {
            if (username.length < 5) {
                setIsUsernameValid(false);
                setUsernameError('아이디는 5자 이상의 영문자와 숫자만 조합할 수 있습니다.');
                return;
            }

            const isValid = /^(?=[a-zA-Z0-9]{5,}$)([a-zA-Z]+|(?=.*[a-zA-Z])(?=.*[0-9]))/.test(username);

            setIsUsernameValid(isValid);
            setUsernameError(isValid ? '사용 가능한 아이디입니다.' : '아이디는 5자 이상의 영문자와 숫자만 조합할 수 있습니다.');

            if (!isValid) return;

            try {
                await checkUsername({ username });
                setUsernameError('사용 가능한 아이디입니다.');
            } catch (err) {
                console.error('아이디 중복 체크 실패:', err);
                setUsernameError('이미 사용 중인 아이디입니다.');
                setIsUsernameValid(false);
            }
        };

        validateAndCheckUsername(username);
    }, [username]);

    const isFormValid = isUsernameValid && isPasswordValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            setError('아이디 또는 비밀번호가 유효하지 않습니다.');
            return;
        }

        try {
            await register({ username, password });
            setIsModalOpen(true);
        } catch (err) {
            console.error('회원가입 실패:', err);
            setError('회원가입에 실패했습니다.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.location.href = '/';
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>회원가입</h1>
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
                        {usernameError && (
                            <div className={`${isUsernameValid ? 'valid-message' : 'error-message'}`}>{usernameError}</div>
                        )}
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
                        {passwordError && (
                            <div className={`${isPasswordValid ? 'valid-message' : 'error-message'}`}>{passwordError}</div>
                        )}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className={isFormValid ? 'active-button' : 'disabled-button'} disabled={!isFormValid}>
                        가입하기
                    </button>
                </form>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>회원가입이 완료되었습니다.</h2>
                        <button onClick={closeModal}>로그인하러가기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
