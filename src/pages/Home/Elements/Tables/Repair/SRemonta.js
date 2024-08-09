import React, { useState, useEffect } from "react";
import './RepairModal.css';
import { ReactComponent as IconClose } from "./icon-close.svg";

export const SRemonta = ({ isOpen, onClose }) => {
    const [containers, setContainers] = useState([]);
    const [selectedContainer, setSelectedContainer] = useState('');

    const [formData, setFormData] = useState({
        okazrem: "",
        repphoto: [],  // Change to an array to hold multiple files
    });

    useEffect(() => {
        if (isOpen) {
            fetch('/api/sremont')
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevFormData => ({ 
            ...prevFormData, 
            [name]: Array.from(files)  // Store files as an array
        }));
    };

    const handleReturnClick = () => {
        if (selectedContainer) {
            const data = new FormData();
            data.append('numcont', selectedContainer);
            data.append('okazrem', formData.okazrem);

            // Append each file in the repphoto array
            formData.repphoto.forEach(file => {
                data.append('repphoto', file);
            });

            console.log('Sending data:', {
                numcont: selectedContainer,
                okazrem: formData.okazrem,
                repphoto: formData.repphoto
            });

            fetch('/api/fromremont', {
                method: 'POST',
                body: data,
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response:', data);
                    if (data.status) {
                        alert('Контейнер успешно обновлен и возвращен');
                        onClose();
                    } else {
                        alert('Ошибка при обновлении и возвращении контейнера');
                    }
                })
                .catch(error => console.error('Error updating container:', error));
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
                            <h2 className="header-modal">Выпустить с ремонта</h2>
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
                                <div>
                                    <p>Оказанный ремонт:</p>
                                    <input
                                        type="text"
                                        name="okazrem"
                                        value={formData.okazrem}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <p>Фото после ремонта:</p>
                                    <input type="file" name="repphoto" onChange={handleFileChange} multiple />
                                </div>
                                <button 
                                    className="button-modal" 
                                    onClick={handleReturnClick}
                                    disabled={!selectedContainer}
                                >
                                    Вернуть в свод
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
