import React, { useState } from "react";
import "./ZakupModal.css";
import { ReactComponent as IconClose } from "./icon-close.svg";
import axios from "axios";

export const ParserModal = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleParse = async () => {
        if (!file) {
            alert("Пожалуйста, выберите файл.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/parserZakup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Файл успешно загружен и данные сохранены');
                onClose();
            } else {
                alert('Произошла ошибка при загрузке файла');
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            alert('Произошла ошибка при загрузке файла');
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
                            <h2 className="header-modal">Спарсить с Excel</h2>
                            <div>
                                <input type="file" onChange={handleFileChange} />
                            </div>
                            <button className="button-modal" onClick={handleParse}>Спарсить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
