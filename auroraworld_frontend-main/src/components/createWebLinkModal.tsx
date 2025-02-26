import React, { useState } from 'react';
import '@/styles/modal/createWebLinkModal.css';
import { createWeblink } from '@/api';

type Category = 'favorites' | 'work' | 'reference' | 'education';

interface CreateWebLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const categoryMap: { [key in Category]: string } = {
    favorites: '개인즐겨찾기',
    work: '업무 활용자료',
    reference: '참고자료',
    education: '교육 및 학습자료',
};

const CreateWebLinkModal: React.FC<CreateWebLinkModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCreateSubmit = async () => {
        if (!name || !url || !category) {
            setError('모든 필드를 채워주세요.');
            return;
        }
        try {
            await createWeblink({ name, url, category: category as Category });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError('웹링크 생성에 실패했습니다. 올바르게 입력했는지 다시한번 확인바랍니다.');
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>웹링크 생성</h2>

                <div className="input-wrapper-inline">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="이름을 입력하세요"
                        />
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="input-field"
                            placeholder="URL을 입력하세요"
                        />
                    </div>
                </div>

                <div className="category-container">
                    <div className="category-radio">
                        {Object.entries(categoryMap).map(([key, label]) => (
                            <label key={key} className={category === key ? 'selected' : ''}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={key}
                                    checked={category === key}
                                    onChange={handleCategoryChange}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="modal-actions">
                    <button onClick={handleCreateSubmit} className="create-button">
                        생성
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWebLinkModal;
