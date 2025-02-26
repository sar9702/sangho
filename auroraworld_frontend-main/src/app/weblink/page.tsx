'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateWebLinkModal from '@/components/createWebLinkModal';
import DeleteWebLinkModal from '@/components/deleteWebLinkModal';
import UpdateWebLinkModal from '@/components/updateWebLinkModal';
import ShareModal from '@/components/shareModal';
import LoginModal from '@/components/loginModal';
import { logout, getWeblink } from '@/api';
import '@/styles/weblink.css';

type Category = 'favorites' | 'work' | 'reference' | 'education';
type getCategory = 'all' | 'favorites' | 'work' | 'reference' | 'education' | 'shared';

interface WebLink {
    id: number;
    name: string;
    url: string;
    category: Category;
    isShared: boolean;
    imageUrl?: string;
    canDelete: boolean;
    canEdit: boolean;
}

interface updateLinkData {
    weblink_id: number;
    name: string;
    url: string;
    category: Category;
}

interface shareData {
    weblink_id: number;
    shared: boolean;
}

const categoryMap: { [key: string]: string } = {
    favorites: '개인즐겨찾기',
    work: '업무 활용자료',
    reference: '참고자료',
    education: '교육 및 학습자료',
    shared: '공유',
};

const WebLinkPage = () => {
    const [isAuthChecked, setIsAuthChecked] = useState<boolean | null>(null);
    const [webLinks, setWebLinks] = useState<WebLink[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLinkId, setDeleteLinkId] = useState<number | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateLinkData, setUpdateLinkData] = useState<updateLinkData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareData, setShareData] = useState<shareData | null>(null);

    const router = useRouter();

    const fetchWebLinks = async (category: getCategory = 'all', keyword: string = '') => {
        try {
            const response = await getWeblink(category, keyword);

            if (response && Array.isArray(response.data)) {
                const formattedData: WebLink[] = response.data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    url: item.url,
                    category: item.category as Category,
                    isShared: item.shared,
                    imageUrl: item.image_url,
                    canDelete: item.can_delete,
                    canEdit: item.can_edit,
                }));
                setWebLinks(formattedData);
            }
        } catch (error) {
            console.error('웹링크 데이터를 불러오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const checkAuthAndFetchLinks = async () => {
            const isLoggedIn = !!localStorage.getItem('accessToken');
            setIsAuthChecked(isLoggedIn);

            if (isLoggedIn) {
                setIsLoading(true);
                try {
                    await fetchWebLinks();
                } catch (error) {
                    console.error('웹링크 데이터를 불러오는 중 오류 발생:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setShowModal(true);
                setIsLoading(false);
            }
        };

        checkAuthAndFetchLinks();
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <p>로딩 중...</p>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    const handleShare = (shareData: shareData) => {
        setShareData(shareData);
        setShowShareModal(true);
    };

    const handleUpdate = (data: updateLinkData) => {
        setUpdateLinkData(data);
        setShowUpdateModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteLinkId(id);
        setShowDeleteModal(true);
    };

    const handleSearchAndCategoryChange = async (keyword: string, category: getCategory) => {
        await fetchWebLinks(category, keyword);
    };

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchAndCategoryChange(searchQuery, selectedCategory as getCategory);
        }
    };

    const handleCategoryClick = (category: getCategory) => {
        setSelectedCategory(category);
        handleSearchAndCategoryChange(searchQuery, category);
    };

    if (isAuthChecked === false && showModal) {
        return (
            <LoginModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    router.push('/');
                }}
            />
        );
    }

    return (
        <div className="container">
            <header className="header">
                <button className="createButton" onClick={handleCreateClick}>
                    생성
                </button>
                <button className="logoutButton" onClick={handleLogout}>
                    로그아웃
                </button>
            </header>
            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="웹링크 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="searchInput"
                />
            </div>

            <div className="categoryButtons">
                {['all', 'favorites', 'work', 'reference', 'education', 'shared'].map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category as getCategory)}
                        className={`categoryButton ${selectedCategory === category ? 'selected' : ''}`}
                    >
                        {category === 'all' ? '전체' : categoryMap[category]}
                    </button>
                ))}
            </div>
            {webLinks.length > 0 ? (
                <main className="main">
                    {webLinks.map((link) => (
                        <div key={link.id} className="card">
                            <div className="image-container">
                                <img
                                    src={link.imageUrl || '/favicon.ico'}
                                    alt={link.name}
                                    className="web-link-image"
                                    onClick={() => window.open(link.url, '_blank')}
                                />
                            </div>
                            <div className="link-info">
                                <div className="title-category">
                                    <h3>{link.name}</h3>
                                    <p className="category">{categoryMap[link.category]}</p>
                                </div>
                                <div className="button-group">
                                    <span className={`shared-badge ${link.isShared ? 'shared' : 'not-shared'}`}>공유</span>
                                    {link.canDelete && (
                                        <button
                                            className="card-share-button"
                                            onClick={() => {
                                                handleShare({ weblink_id: link.id, shared: link.isShared });
                                            }}
                                        >
                                            공유
                                        </button>
                                    )}
                                    {link.canEdit && (
                                        <button
                                            className="card-update-button"
                                            onClick={() =>
                                                handleUpdate({
                                                    weblink_id: link.id,
                                                    name: link.name,
                                                    url: link.url,
                                                    category: link.category,
                                                })
                                            }
                                        >
                                            수정
                                        </button>
                                    )}
                                    {link.canDelete && (
                                        <button className="card-delete-button" onClick={() => handleDelete(link.id)}>
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            ) : (
                <div className="no-data">
                    <p>웹링크가 없습니다. 새로운 링크를 추가해보세요!</p>
                </div>
            )}
            {showCreateModal && <CreateWebLinkModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />}
            <DeleteWebLinkModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} linkId={deleteLinkId} />
            {showUpdateModal && updateLinkData && (
                <UpdateWebLinkModal
                    isOpen={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    linkData={updateLinkData}
                />
            )}
            {showShareModal && shareData && (
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)} // 모달 닫기
                    shareData={shareData} // 공유할 링크 id 전달
                />
            )}
        </div>
    );
};

export default WebLinkPage;
