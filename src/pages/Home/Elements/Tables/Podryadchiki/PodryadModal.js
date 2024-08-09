import React, { useState } from "react";
import "./PodryadModal.css";
import { ReactComponent as IconClose } from "./icon-close.svg";

export const PodryadModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        namecontr: "",
        inn: "",
        soprdocs: []
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "soprdocs") {
            setFormData({ ...formData, [name]: Array.from(files) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        const data = new FormData();
        data.append("namecontr", formData.namecontr);
        data.append("inn", formData.inn);
        formData.soprdocs.forEach((file) => {
            data.append("soprdocs", file);
        });

        try {
            const response = await fetch("/api/Podryad", {
                method: "POST",
                body: data
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Произошла ошибка при добавлении подрядчика");
            } else {
                const result = await response.json();
                console.log(result)
                alert("Подрядчик добавлен успешно");
                onClose();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Произошла ошибка при добавлении подрядчика");
        }
    };

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
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
                            <h2 className="header-modal">Добавить подрядчика</h2>
                            <div>
                                <p>Имя контрагента:</p>
                                <input
                                    name="namecontr"
                                    value={formData.namecontr}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>ИНН:</p>
                                <input
                                    name="inn"
                                    value={formData.inn}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Сопроводительные документы:</p>
                                <input
                                    type="file"
                                    name="soprdocs"
                                    multiple
                                    onChange={handleChange}
                                />
                            </div>
                            <button className="button-modal" onClick={handleSubmit}>Добавить подрядчика</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
