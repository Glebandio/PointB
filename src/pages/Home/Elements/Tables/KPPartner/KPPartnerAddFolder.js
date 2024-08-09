import { useState } from 'react';
import './KPPartnerModal.css';
import { ReactComponent as IconClose } from "./icon-close.svg";

export const KPpartnerAddFolder = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        folder: ""
    });

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/postfolder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Folder added successfully');
                setFormData({ folder: "" }); // Clear the form after successful submission
                onClose(); // Close the modal
            } else {
                console.error('Failed to add folder');
            }
        } catch (error) {
            console.error('Error:', error);
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
                            <h2 className="header-modal">Добавить папку</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <p>Введите название новой папки</p>
                                    <input
                                        name="folder"
                                        value={formData.folder}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="button-modal">
                                    Добавить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
