import React, { useState, useEffect } from 'react';
import { updateWeblink } from '@/api';
import '@/styles/modal/updateWebLinkModal.css';

type Category = 'favorites' | 'work' | 'reference' | 'education';

interface UpdateWebLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    linkData: { weblink_id: number; name: string; url: string; category: Category };
}

const categoryMap: { [key in Category]: string } = {
    favorites: '개인즐겨찾기',
    work: '업무 활용자료',
    reference: '참고자료',
    education: '교육 및 학습자료',
};

const UpdateWebLinkModal: React.FC<UpdateWebLinkModalProps> = ({ isOpen, onClose, linkData }) => {
    const [weblink_id, setWeblink_id] = useState(Number);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState<Category>('favorites');
    const [error, setError] = useState('');

    useEffect(() => {
        if (linkData) {
            setWeblink_id(linkData.weblink_id);
            setName(linkData.name);
            setUrl(linkData.url);
            setCategory(linkData.category);
        }
    }, [linkData]);

    if (!isOpen) return null;

    const handleUpdateSubmit = async () => {
        if (!name || !url || !category) {
            setError('모든 필드를 채워주세요.');
            return;
        }
        try {
            await updateWeblink({ weblink_id, name, url, category });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError('웹링크 수정에 실패했습니다. 올바르게 입력했는지 다시한번 확인바랍니다.');
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.target.value as Category);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>웹링크 수정</h2>
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
                    <button onClick={handleUpdateSubmit} className="update-button">
                        수정
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateWebLinkModal;
