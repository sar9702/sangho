import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getShareUser, getSearchUser, createShare, deleteShare, updateShare } from '@/api';
import '@/styles/modal/shareModal.css';

interface ShareData {
    weblink_id: number;
    shared: boolean;
}

interface User {
    id: number;
    username: string;
    permission: 'read' | 'write';
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareData: ShareData;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const isFetched = useRef(false);

    const fetchSharedUsers = useCallback(async () => {
        if (!shareData.shared || !shareData.weblink_id || isFetched.current) return;

        isFetched.current = true;
        try {
            const response = await getShareUser(shareData.weblink_id);
            setUsers(response.data);
        } catch (error) {
            console.error('유저 목록을 가져오는 데 실패했습니다:', error);
        }
    }, [shareData.weblink_id, shareData.shared]);

    useEffect(() => {
        fetchSharedUsers();
    }, [fetchSharedUsers]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers([]);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await getSearchUser(searchQuery);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error('유저 검색 실패:', error);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    const handleAddUser = async (user: User) => {
        const isNewUser = users.length === 0;
        const isUserAlreadyAdded = users.some((u) => u.id === user.id);
        if (!isUserAlreadyAdded) {
            setUsers((prevUsers) => [...prevUsers, user]);
            try {
                await createShare({ userId: user.id, weblinkId: shareData.weblink_id, isNewUser });
            } catch (err) {
                console.error('웹링크 공유 생성 실패:', err);
            }
        }
        setSearchQuery('');
        setFilteredUsers([]);
    };

    const handlePermissionChange = async (userId: number, permission: 'read' | 'write') => {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, permission } : user)));
        try {
            await updateShare({ userId, weblinkId: shareData.weblink_id, permission });
        } catch (err) {
            console.error('웹링크 공유 수정 실패:', err);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        const isUserExist = users.length - 1 === 0;
        try {
            await deleteShare(userId, shareData.weblink_id, isUserExist);
        } catch (err) {
            console.error('웹링크 공유 수정 실패:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">웹링크 공유</h2>

                <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="유저 검색..."
                />

                {searchQuery && (
                    <div className="dropdown show">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div key={user.id} className="dropdown-item" onClick={() => handleAddUser(user)}>
                                    {user.username}
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-item">검색된 유저가 없습니다.</div>
                        )}
                    </div>
                )}

                <div className="user-list">
                    {users.map((user) => (
                        <div key={user.id} className="user-item">
                            <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                                삭제
                            </button>
                            <span className="username">{user.username}</span>

                            <div className="permission-buttons">
                                <label className={`permission-label ${user.permission === 'read' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`permission-${user.id}`}
                                        checked={user.permission === 'read'}
                                        onChange={() => handlePermissionChange(user.id, 'read')}
                                    />
                                    읽기
                                </label>
                                <label className={`permission-label ${user.permission === 'write' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`permission-${user.id}`}
                                        checked={user.permission === 'write'}
                                        onChange={() => handlePermissionChange(user.id, 'write')}
                                    />
                                    쓰기
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="buttons">
                    <button
                        className="cancel-button"
                        onClick={() => {
                            onClose();
                            window.location.reload();
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
