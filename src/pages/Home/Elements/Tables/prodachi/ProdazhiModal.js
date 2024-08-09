import React, { useState, useEffect } from 'react';
import { ReactComponent as IconClose } from "./icon-close.svg";

const managers = [
    "Киршина Анна Михайловна",
    "Ежов Андрей Андреевич",
    "Кузовой Евгений Дмитриевич"
];

const status = [
    "Заведена",
    "Выдана",
    "Оплачена частично",
    "Оплачена полностью",
    "Закрыта"
];

export const ProdazhiModal = ({ isOpen, onClose }) => {
    const [contractors, setContractors] = useState([]);
    const [conts, setConts] = useState([]);
    const [formData, setFormData] = useState({
        klient: "",
        datas: "",
        status: "",
        marzha: "",
        stoimost: "",
        vid: "",
        nds: "",
        kolvo: "1",
        city: "",
        manager: "",
        containers: "",
    });

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };

    useEffect(() => {
        const fetchContractors = async () => {
            const response = await fetch("/api/forzakup");
            const result = await response.json();
            setContractors(result);
        };
        fetchContractors();
    }, []);

    useEffect(() => {
        const fetchConts = async () => {
            const response = await fetch("/api/getconts");
            const result = await response.json();
            setConts(result);
        };
        fetchConts();
    }, []);

    useEffect(() => {
        if (formData.containers && formData.stoimost) {
            const selectedCont = conts.find(cont => cont.numcont === formData.containers);
            if (selectedCont) {
                const marzha = parseInt(formData.stoimost) - selectedCont.sebes;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    marzha: marzha.toString()
                }));
            }
        }
    }, [formData.containers, formData.stoimost, conts]);

    useEffect(() => {
        if (formData.containers) {
            const selectedCont = conts.find(cont => cont.numcont === formData.containers);
            if (selectedCont) {
                const city = selectedCont.city;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    city: city
                }));
            }
        }
    }, [formData.containers, conts]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async () => {
        const response = await fetch("/api/prodazhi", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Контейнер продан успешно");
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
                            <h2 className="header-modal">Добавить сделку</h2>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Выберите контрагента</label>
                                    <p>
                                    <select className="input" name="klient" value={formData.klient} onChange={handleChange}>
                                        <option value="">Выберите подрядчика</option>
                                        {contractors.map((contractor, index) => (
                                            <option key={contractor.namecontr + index} value={contractor.namecontr}>{contractor.namecontr}</option>
                                        ))}
                                    </select>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>Статус</label>
                                    <p>
                                    <select className="input" name="status" value={formData.status} onChange={handleChange}>
                                        <option value="">Выберите статус</option>
                                        {status.map((status, index) => (
                                            <option key={status + index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>Стоимость продажи</label>
                                    <p>
                                        <input 
                                            className="input"
                                            type="text"
                                            name="stoimost"
                                            value={formData.stoimost}
                                            onChange={handleChange} 
                                        />
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>Дата</label>
                                    <p>
                                        <input 
                                            className="input"
                                            type="date"
                                            name='datas'
                                            value={formData.datas}
                                            onChange={handleChange}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p>Тип оплаты:</p>
                                    <label>
                                        <input
                                            className="input"
                                            type="checkbox"
                                            name="vid"
                                            checked={formData.vid === "Наличные"}
                                            onChange={() => setFormData({ ...formData, vid: formData.vid === "Наличные" ? "" : "Наличные" })}
                                        />
                                        Наличные
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="vid"
                                            checked={formData.vid === "Рассчетный счет"}
                                            onChange={() => setFormData({ ...formData, vid: formData.vid === "Рассчетный счет" ? "" : "Рассчетный счет" })}
                                        />
                                        Расчетный счет
                                    </label>
                                </div>
                                {formData.vid === "Рассчетный счет" && (
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
                                <div className="form-group">
                                    <label>Номера контейнеров</label>
                                    <p>
                                    <select className="input" name="containers" value={formData.containers} onChange={handleChange}>
                                        <option value="">Выберите контейнер</option>
                                        {conts.map((cont, index) => (
                                            <option key={cont.numcont + index} value={cont.numcont}>{cont.numcont}</option>
                                        ))}
                                    </select>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>Ответственный менеджер</label>
                                    <p>
                                    <select className="input" name="manager" value={formData.manager} onChange={handleChange}>
                                        <option value="">Выберите менеджера</option>
                                        {managers.map((manager, index) => (
                                            <option key={manager + index} value={manager}>{manager}</option>
                                        ))}
                                    </select>
                                    </p>
                                </div>
                                <button className="button-modal" onClick={handleSubmit}>Добавить сделку</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
