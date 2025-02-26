import React from 'react';
import '@/styles/modal/deleteWebLinkModal.css';
import { deleteWeblink } from '@/api';

interface DeleteWebLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    linkId: number | null;
}
const DeleteWebLinkModal: React.FC<DeleteWebLinkModalProps> = ({ isOpen, onClose, linkId }) => {
    const handleDelete = async () => {
        if (linkId !== null) {
            await deleteWeblink(linkId);
        }
        onClose();
        window.location.reload();
    };

    if (!isOpen || linkId === null) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>정말로 삭제하시겠습니까?</h3>
                <div className="modal-buttons">
                    <button className="modal-delete-button" onClick={handleDelete}>
                        삭제
                    </button>
                    <button className="modal-cancel-button" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteWebLinkModal;
