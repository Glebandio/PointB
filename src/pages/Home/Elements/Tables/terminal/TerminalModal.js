import React, { useState, useEffect } from "react";
import "./TerminalModal.css";
import { ReactComponent as IconClose } from "./icon-close.svg";

const countries = {
    Russia: ["Moscow", "Saint Petersburg", "Novosibirsk"],
    USA: ["New York", "Los Angeles", "Chicago"],
};

export const TerminalModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        country: "",
        city: "",
        terminal: "",
        stock: "",
        adress: "",
        mail: "",
        phone: "",
        worktime: "",
        mechvid: "",
        prr20dc: "",
        prr40hc: "",
        storprr20: "",
        storprr40: "",
        photo: [],
        accs: ""
    });

    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (formData.country) {
            setCities(countries[formData.country] || []);
            setFormData(prevFormData => ({ ...prevFormData, city: "" }));
        }
    }, [formData.country]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photo") {
            setFormData({ ...formData, [name]: Array.from(files) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === "photo") {
                formData.photo.forEach(file => {
                    data.append("photo", file);
                });
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch("/api/terminal", {
                method: "POST",
                body: data
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Произошла ошибка при добавлении терминала");
            } else {
                const result = await response.json();
                console.log(result);
                alert("Терминал добавлен успешно");
                onClose();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Произошла ошибка при добавлении терминала");
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
                            <h2 className="header-modal">Добавить терминал</h2>
                            <div>
                                <p>Страна:</p>
                                <select name="country" value={formData.country} onChange={handleChange}>
                                    <option value="">Выберите страну</option>
                                    {Object.keys(countries).map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Город:</p>
                                <select name="city" value={formData.city} onChange={handleChange}>
                                    <option value="">Выберите город</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Терминал:</p>
                                <input
                                    name="terminal"
                                    value={formData.terminal}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Сток:</p>
                                <input
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Адрес:</p>
                                <input
                                    name="adress"
                                    value={formData.adress}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Контактная почта:</p>
                                <input
                                    name="mail"
                                    value={formData.mail}
                                    onChange={handleChange}
                                    type="email"
                                />
                            </div>
                            <div>
                                <p>Номер телефона:</p>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="phone"
                                />
                            </div>
                            <div>
                                <p>Часы работы:</p>
                                <input
                                    name="worktime"
                                    value={formData.worktime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Механика выдачи:</p>
                                <input
                                    name="mechvid"
                                    value={formData.mechvid}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>ПРР 20DC:</p>
                                <input
                                    name="prr20dc"
                                    value={formData.prr20dc}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>ПРР 40HC:</p>
                                <input
                                    name="prr40hc"
                                    value={formData.prr40hc}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Хранение 20DC (руб/сутки):</p>
                                <input
                                    name="storppr20"
                                    value={formData.storppr20}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Хранение 40HC (руб/сутки):</p>
                                <input
                                    name="storprr40"
                                    value={formData.storprr40}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Фото:</p>
                                <input
                                    type="file"
                                    name="photo"
                                    multiple
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Аккаунты:</p>
                                <input
                                    name="accs"
                                    value={formData.accs}
                                    onChange={handleChange}
                                />
                            </div>
                            <button className="button-modal" onClick={handleSubmit}>Добавить терминал</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
