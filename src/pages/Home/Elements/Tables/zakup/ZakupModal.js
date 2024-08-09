import React, { useState, useEffect } from "react";
import "./ZakupModal.css";
import { ReactComponent as IconClose } from "./icon-close.svg";

const containerTypes = ["20DC", "40HC"];
const conditions = ["NEW", "IICL", "CW", "WWT"];
const paymentStatuses = ["оплачен", "не оплачен", "предоплата"];
const managers = [
    "Киршина Анна Михайловна",
    "Ежов Андрей Андреевич",
    "Кузовой Евгений Дмитриевич"
];

export const ZakupModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        country: "",
        city: "",
        terminal: "",
        stock: "",
        numcont: "",
        tip: "",
        photo: "",
        yom: "",
        sost: "",
        vidras: "",
        costzak: "",
        nds: "",
        gtd: "",
        podryad: "",
        dataprih: "",
        statusopl: "",
        termhran: "",
        rprcon: false,
        prr: "",
        izder: "",
        comm: "",
        maneger: "",
    });

    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [terminals, setTerminals] = useState([]);
    const [contractors, setContractors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/terminalsforzakup");
            const result = await response.json();
            if (result.status) {
                setData(result.data);
                const uniqueCountries = [...new Set(result.data.map(item => item.country))];
                setCountries(uniqueCountries);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchContractors = async () => {
            const response = await fetch("/api/forzakup");
            const result = await response.json();
            setContractors(result);
        };
        fetchContractors();
    }, []);

    useEffect(() => {
        if (formData.country) {
            const filteredCities = data
                .filter(item => item.country === formData.country)
                .map(item => item.city);
            setCities([...new Set(filteredCities)]);
            setFormData(prevFormData => ({ ...prevFormData, city: "", terminal: "" }));
        }
    }, [formData.country, data]);

    useEffect(() => {
        if (formData.city) {
            const filteredTerminals = data
                .filter(item => item.city === formData.city)
                .map(item => item.terminal);
            setTerminals([...new Set(filteredTerminals)]);
            setFormData(prevFormData => ({ ...prevFormData, terminal: "" }));
        }
    }, [formData.city, data]);

    useEffect(() => {
        if (formData.terminal) {
            const selectedTerminal = data.find(item => item.terminal === formData.terminal);
            if (selectedTerminal) {
                const prrValue = formData.tip === "20DC" ? selectedTerminal.prr20dc : formData.tip === "40HC" ? selectedTerminal.prr40hc : "";
                const termhranValue = formData.tip === "20DC" ? selectedTerminal.storppr20 : formData.tip === "40HC" ? selectedTerminal.storprr40 : "";
                setFormData(prevFormData => ({
                    ...prevFormData,
                    stock: selectedTerminal.stock,
                    prr: prrValue,
                    termhran: termhranValue
                }));
                console.log(`PRR updated to: ${prrValue}`);
            }
        }
    }, [formData.terminal, formData.tip, data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: files[0] }));
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        let sebes = parseInt(formData.costzak);
        if (formData.nds === 'С НДС') {
            sebes = sebes * 1.2 + parseInt(formData.prr) * 2 + parseInt(formData.izder);
        } else{
            sebes = sebes + parseInt(formData.prr)*2 + parseInt(formData.izder);
        }

        formDataToSend.append('sebes', sebes);

        const response = await fetch("/api/zakup", {
            method: "POST",
            body: formDataToSend
        });

        if (response.ok) {
            alert("Контейнер добавлен успешно");
            onClose();
        } else {
            alert("Произошла ошибка при добавлении контейнера");
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
                            <h2 className="header-modal">Добавить контейнер</h2>
                            <div>
                                <p>Страна:</p>
                                <select className="input" name="country" value={formData.country} onChange={handleChange}>
                                    <option value="">Выберите страну</option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Город:</p>
                                <select className="input" name="city" value={formData.city} onChange={handleChange}>
                                    <option value="">Выберите город</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Терминал:</p>
                                <select className="input" name="terminal" value={formData.terminal} onChange={handleChange}>
                                    <option value="">Выберите терминал</option>
                                    {terminals.map((terminal) => (
                                        <option key={terminal} value={terminal}>{terminal}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Номер контейнера:</p>
                                <input
                                    className="input"
                                    name="numcont"
                                    value={formData.numcont}
                                    onChange={handleChange}
                                    pattern="[A-Za-z]{4}\d{7}"
                                    title="Номер контейнера должен состоять из 4 букв и 7 цифр"
                                />
                            </div>
                            <div>
                                <p>Тип:</p>
                                <select className="input" name="tip" value={formData.tip} onChange={handleChange}>
                                    <option value="">Выберите тип</option>
                                    {containerTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Фото:</p>
                                <input className="input" type="file" name="photo" onChange={handleFileChange} />
                            </div>
                            <div>
                                <p>YOM:</p>
                                <input
                                className="input"
                                    name="yom"
                                    value={formData.yom}
                                    onChange={handleChange}
                                    type="number"
                                    max="9999"
                                    title="Год выпуска должен состоять из не более чем 4 цифр"
                                />
                            </div>
                            <div>
                                <p>Состояние:</p>
                                <select className="input" name="sost" value={formData.sost} onChange={handleChange}>
                                    <option value="">Выберите состояние</option>
                                    {conditions.map((condition) => (
                                        <option key={condition} value={condition}>{condition}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Тип оплаты:</p>
                                <label>
                                    <input
                                        className="input"
                                        type="checkbox"
                                        name="vidras"
                                        checked={formData.vidras === "Наличные"}
                                        onChange={() => setFormData({ ...formData, vidras: formData.vidras === "Наличные" ? "" : "Наличные" })}
                                    />
                                    Наличные
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="vidras"
                                        checked={formData.vidras === "Рассчетный счет"}
                                        onChange={() => setFormData({ ...formData, vidras: formData.vidras === "Рассчетный счет" ? "" : "Рассчетный счет" })}
                                    />
                                    Расчетный счет
                                </label>
                            </div>
                            {formData.vidras === "Рассчетный счет" && (
                                <div>
                                    <p>Налог:</p>
                                    <label>
                                        <input
                                            type="radio"
                                            name="nds"
                                            value="С НДС"
                                            checked={formData.nds === "С НДС"}
                                            onChange={handleChange}
                                        />
                                        С НДС
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="nds"
                                            value="Без НДС"
                                            checked={formData.nds === "Без НДС"}
                                            onChange={handleChange}
                                        />
                                        Без НДС
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="nds"
                                            value="С НДС 0%"
                                            checked={formData.nds === "С НДС 0%"}
                                            onChange={handleChange}
                                        />
                                        С НДС 0%
                                    </label>
                                </div>
                            )}
                            <div>
                                <p>Цена закупа:</p>
                                <input
                                    className="input"
                                    name="costzak"
                                    value={formData.costzak}
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    title="Введите числовое значение"
                                />
                            </div>
                            <div>
                                <p>ГТД:</p>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="gtd"
                                        checked={formData.gtd}
                                        onChange={handleChange}
                                    />
                                    Есть
                                </label>
                            </div>
                            {formData.gtd && (
                                <div>
                                    <p>Загрузите документ:</p>
                                    <input className="input" type="file" name="gtd" onChange={handleFileChange} />
                                </div>
                            )}
                            <div>
                                <p>Подрядчик:</p>
                                <select className="input" name="podryad" value={formData.podryad} onChange={handleChange}>
                                    <option value="">Выберите подрядчика</option>
                                    {contractors.map((contractor) => (
                                        <option key={contractor.namecontr} value={contractor.namecontr}>{contractor.namecontr}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Дата поступления:</p>
                                <input
                                 className="input"
                                    name="dataprih"
                                    value={formData.dataprih}
                                    onChange={handleChange}
                                    type="date"
                                />
                            </div>
                            <div>
                                <p>Статус оплаты:</p>
                                <select className="input" name="statusopl" value={formData.statusopl} onChange={handleChange}>
                                    <option value="">Выберите статус оплаты</option>
                                    {paymentStatuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>Терминальное хранение:</p>
                                <span>{formData.termhran}</span>
                            </div>
                            <div>
                                <p>Нуждается в ремонте:</p>
                                <input
                                    type="checkbox"
                                    name="rprcon"
                                    checked={formData.rprcon}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>ПРР:</p>
                                <span>{formData.prr}</span>
                            </div>
                            <div>
                                <p>Издержки:</p>
                                <input
                                    className="input"
                                    name="izder"
                                    value={formData.izder}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Комментарий от терминала о состоянии контейнера:</p>
                                <textarea
                                    className="input"
                                    name="comm"
                                    value={formData.comm}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <p>Ответственный менеджер:</p>
                                <select className="input" name="maneger" value={formData.maneger} onChange={handleChange}>
                                    <option value="">Выберите менеджера</option>
                                    {managers.map((manager) => (
                                        <option key={manager} value={manager}>{manager}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="button-modal" onClick={handleSubmit}>Добавить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
