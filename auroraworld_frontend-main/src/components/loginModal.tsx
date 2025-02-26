'use client';

import React from 'react';
import '@/styles/modal/loginModal.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>로그인 후 이용 가능합니다.</p>
                <button className="close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
