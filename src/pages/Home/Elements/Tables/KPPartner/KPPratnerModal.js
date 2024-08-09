import './KPPartnerModal.css';
import { ReactComponent as IconClose } from "./icon-close.svg";
import React, { useEffect, useState } from 'react';

export const KPpartnerModal = ({ isOpen, onClose }) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetch('/api/getfolder')
                .then(response => response.json())
                .then(data => setFolders(data))
                .catch(error => console.error('Error fetching folders:', error));
        }
    }, [isOpen]);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('folder', selectedFolder);
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('File uploaded successfully');
                onClose(); // Close the modal after successful upload
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-wrapper" onClick={onWrapperClick}>
                        <div className="modal-content">
                            <button className="modal-close-button" onClick={onClose}>
                                <IconClose />
                            </button>
                            <h2 className="header-modal">Добавить документ</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <p>Выберите папку:</p>
                                    <select
                                        value={selectedFolder}
                                        onChange={(e) => setSelectedFolder(e.target.value)}
                                    >
                                        <option value="" disabled>Выберите папку</option>
                                        {folders.map((folder, index) => (
                                            <option key={index} value={folder.folder}>{folder.folder}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Загрузить документ:</p>
                                    <input type="file" onChange={handleFileChange} />
                                </div>
                                <button type="submit" className="button-modal">
                                    Загрузить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
