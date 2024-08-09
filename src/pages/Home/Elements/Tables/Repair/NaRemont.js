import React, { useState, useEffect } from "react";
import './RepairModal.css';
import { ReactComponent as IconClose } from "./icon-close.svg";

export const NaRemont = ({ isOpen, onClose }) => {
    const [containers, setContainers] = useState([]);
    const [selectedContainer, setSelectedContainer] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetch('/api/naremont')
                .then(response => response.json())
                .then(data => {
                    setContainers(data);
                })
                .catch(error => console.error('Error fetching containers:', error));
        }
    }, [isOpen]);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    const handleContainerChange = (event) => {
        setSelectedContainer(event.target.value);
    };

    const handleReturnClick = () => {
        if (selectedContainer) {
            fetch('http://localhost:8080/api/naremont', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numcont: selectedContainer }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        alert('Контейнер успешно отправлен');
                        onClose();
                    } else {
                        alert('Ошибка при отправке контейнера на ремонт');
                    }
                })
                .catch(error => console.error('Error returning container:', error));
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
                            <h2 className="header-modal">Отправить на ремонт</h2>
                            <div className="modal-body">
                                <p>Выберите контейнер</p>
                                <select 
                                    value={selectedContainer} 
                                    onChange={handleContainerChange}
                                    className="container-select"
                                >
                                    <option value="">Выберите контейнер</option>
                                    {containers.map((container, index) => (
                                        <option key={index} value={container.numcont}>
                                            {container.numcont}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    className="button-modal" 
                                    onClick={handleReturnClick}
                                    disabled={!selectedContainer}
                                >
                                    На ремонт
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
