import { ReactComponent as IconClose } from "./icon-close.svg";
import { useState, useEffect } from "react";

const containerTypes = ["20DC", "40HC"];
const paymentStatuses = ["Мы оплатили", "Нам оплатили", "Нулевая перевозка"];
const managers = [
    "Киршина Анна Михайловна",
    "Ежов Андрей Андреевич",
    "Кузовой Евгений Дмитриевич"
];

export const NaPerevoz = ({ isOpen, onClose }) => {
    const [data, setData] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [containers, setContainers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [terminals, setTerminals] = useState([]);

    const [formData, setFormData] = useState({
        podryad: "",
        date: "",
        kolvo: "1",
        countrya: "",
        citya: "",
        terminala: "",
        stocka: "",
        countryb: "",
        cityb: "",
        terminalb: "",
        stockb: "",
        count: "",
        price: "",
        statusopl: "",
        manager: "",
        stavkasnp: "",
        kolvodays: "",
        numcont: "",
        tip: ""
    });

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
        if (formData.countrya) {
            const filteredCities = data
                .filter(item => item.country === formData.countrya)
                .map(item => item.city);
            setCities([...new Set(filteredCities)]);
            setFormData(prevFormData => ({ ...prevFormData, citya: "", terminala: "" }));
        }
    }, [formData.countrya, data]);

    useEffect(() => {
        if (formData.citya) {
            const filteredTerminals = data
                .filter(item => item.city === formData.citya)
                .map(item => item.terminal);
            setTerminals([...new Set(filteredTerminals)]);
            setFormData(prevFormData => ({ ...prevFormData, terminala: "" }));
        }
    }, [formData.citya, data]);

    useEffect(() => {
        if (formData.countryb) {
            const filteredCities = data
                .filter(item => item.country === formData.countryb)
                .map(item => item.city);
            setCities([...new Set(filteredCities)]);
            setFormData(prevFormData => ({ ...prevFormData, cityb: "", terminalb: "" }));
        }
    }, [formData.countryb, data]);

    useEffect(() => {
        if (formData.cityb) {
            const filteredTerminals = data
                .filter(item => item.city === formData.cityb)
                .map(item => item.terminal);
            setTerminals([...new Set(filteredTerminals)]);
            setFormData(prevFormData => ({ ...prevFormData, terminalb: "" }));
        }
    }, [formData.cityb, data]);

    useEffect(() => {
        if (isOpen) {
            fetch("/api/perevpodr")
                .then(response => response.json())
                .then(data => {
                    setContractors(data);
                })
                .catch(error => {
                    console.error("Error fetching contractors:", error);
                });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetch("/api/perevozcont")
                .then(response => response.json())
                .then(data => {
                    setContainers(data);
                })
                .catch(error => {
                    console.error("Error fetching contractors:", error);
                });
        }
    }, [isOpen]);

    useEffect(() => {
        if (formData.terminala) {
            const selectedTerminal = data.find(item => item.terminal === formData.terminala);
            if (selectedTerminal) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    stocka: selectedTerminal.stock,
                }));
            }
        }
    }, [formData.terminala, formData.tip, data]);

    useEffect(() => {
        if (formData.terminalb) {
            const selectedTerminal = data.find(item => item.terminal === formData.terminalb);
            if (selectedTerminal) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    stockb: selectedTerminal.stock,
                }));
            }
        }
    }, [formData.terminalb, formData.tip, data]);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async () => {
        const response = await fetch("/api/perevozadd", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Контейнер отправлен успешно");
            onClose();
        } else {
            alert("Произошла ошибка при продаже контейнера");
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
                            <h2 className="header-modal">Добавить перевозку</h2>
                            <div className="modal-body">
                                <div>
                                    Выберите подрядчика:
                                    <p>
                                        <select className="input" name="podryad" value={formData.podryad} onChange={handleChange}>
                                            <option key="" value="">Выберите подрядчика</option>
                                            {contractors.map((contractor) => (
                                                <option key={contractor.namecontr} value={contractor.namecontr}>
                                                    {contractor.namecontr}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                </div>
                                <div>
                                    Выберите контейнер:
                                    <p>
                                        <select className="input" name="numcont" value={formData.numcont} onChange={handleChange}>
                                            <option key="" value="">Выберите контейнер</option>
                                            {containers.map((container) => (
                                                <option key={container.numcont} value={container.numcont}>
                                                    {container.numcont}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                </div>
                                <div>
                                    Тип:
                                    <p>
                                        <select className="input" name="tip" value={formData.tip} onChange={handleChange}>
                                            <option value="">Выберите тип</option>
                                            {containerTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </p>
                                </div>
                                <div>
                                    Количество дней пользования:
                                    <p>
                                        <input
                                            className="input"
                                            name="kolvodays"
                                            value={formData.kolvodays}
                                            onChange={handleChange}
                                        />
                                    </p>
                                </div>
                                <div>
                                    Ставка СНП:
                                    <p>
                                        <input
                                            className="input"
                                            name="stavkasnp"
                                            value={formData.stavkasnp}
                                            onChange={handleChange}
                                        />
                                    </p>
                                </div>
                                <div>
                                    Дата подписания сделки:
                                    <p>
                                        <input
                                            className="input"
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p>Страна A:</p>
                                    <select className="input" name="countrya" value={formData.countrya} onChange={handleChange}>
                                        <option value="">Выберите страну</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Город A:</p>
                                    <select className="input" name="citya" value={formData.citya} onChange={handleChange}>
                                        <option value="">Выберите город</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Терминал A:</p>
                                    <select className="input" name="terminala" value={formData.terminala} onChange={handleChange}>
                                        <option value="">Выберите терминал</option>
                                        {terminals.map((terminal) => (
                                            <option key={terminal} value={terminal}>{terminal}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <p>Страна Б:</p>
                                    <select className="input" name="countryb" value={formData.countryb} onChange={handleChange}>
                                        <option value="">Выберите страну</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Город Б:</p>
                                    <select className="input" name="cityb" value={formData.cityb} onChange={handleChange}>
                                        <option value="">Выберите город</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Терминал Б:</p>
                                    <select className="input" name="terminalb" value={formData.terminalb} onChange={handleChange}>
                                        <option value="">Выберите терминал</option>
                                        {terminals.map((terminal) => (
                                            <option key={terminal} value={terminal}>{terminal}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p></p>
                                    <label>
                                        <input
                                            type="radio"
                                            name="count"
                                            value="-"
                                            checked={formData.count === "-"}
                                            onChange={handleChange}
                                        />
                                        -
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="count"
                                            value="+"
                                            checked={formData.count === "+"}
                                            onChange={handleChange}
                                        />
                                        +
                                    </label>
                                </div>
                                <div>
                                    Цена:
                                    <p>
                                        <input
                                            className="input"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </p>
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
                                    <p>Ответственный менеджер:</p>
                                    <select className="input" name="manager" value={formData.manager} onChange={handleChange}>
                                        <option value="">Выберите менеджера</option>
                                        {managers.map((manager) => (
                                            <option key={manager} value={manager}>{manager}</option>
                                        ))}
                                    </select>
                                    <p></p>
                                </div>
                                <button className="button-modal" onClick={handleSubmit}>Добавить</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
