import './KPPartner.css'; // Connect CSS file
import React, { useEffect, useState, useCallback } from 'react';

export default function Folder() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [folderNames, setFolderNames] = useState([]);
    const [documents, setDocuments] = useState([]);

    const fetchFolders = useCallback(async () => {
        try {
            const response = await fetch('/api/getfolder');
            const data = await response.json();
            const folders = data.map(item => item.folder);
            setFolderNames(folders);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
        const interval = setInterval(fetchFolders, 5000);
        return () => clearInterval(interval);
    }, [fetchFolders]);

    const fetchDocuments = useCallback(async (folderName) => {
        try {
            const response = await fetch(`/api/getdoc?folder=${encodeURIComponent(folderName)}`);
            const data = await response.json();
            setDocuments(data.map(item => item.doc));
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }, []);

    const handleFolderClick = (folderName) => {
        setSelectedFolder(folderName);
        setIsModalVisible(true);
        fetchDocuments(folderName);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedFolder(null);
        setDocuments([]);
    };

    const handleDownload = async (filePath) => {
        const fileName = filePath.split('/').pop();
        const url = `/api/download/${encodeURIComponent(fileName.trim())}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileName.trim());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    return (
        <>
            {folderNames.map((folderName, index) => (
                <div className="folder" key={index} onClick={() => handleFolderClick(folderName)}>
                    <div className="folder-icon" style={{ fontSize: "50px", color: "#666" }}>📁</div>
                    <div className="folder-label">{folderName}</div>
                </div>
            ))}
            {isModalVisible && (
                <div className={`modal ${isModalVisible ? 'visible' : ''}`}>
                    <div className="modal-wrapper">
                        <div className="modal-content">
                            <button className="modal-close-button" onClick={handleCloseModal}>✖</button>
                            <h2 className="header-modal">{selectedFolder}</h2>
                            <div>
                                {documents.map((doc, index) => (
                                    <div key={index} onClick={() => handleDownload(doc)} style={{ cursor: 'pointer' }}>
                                        📄 {decodeURIComponent(doc.split('/').pop())}
                                    </div>
                                ))}
                            </div>
                            <button className="button-modal" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
