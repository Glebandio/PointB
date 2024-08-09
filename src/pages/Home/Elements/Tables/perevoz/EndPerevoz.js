import { ReactComponent as IconClose } from "./icon-close.svg";
import { useState, useEffect } from "react";

export const EndPerevoz = ({isOpen, onClose}) => {

    const [contractors, setContractors] = useState([]);


    const [formData, setFormData] = useState({
        numcont: ""
    })
    const onWrapperClick = (event) => {
        if (event.target.classList.contains("modal-wrapper")) onClose();
    };


    useEffect(() => {
        if (isOpen) {
            fetch("/api/perevozendcont")
                .then(response => response.json())
                .then(data => {
                    setContractors(data);
                })
                .catch(error => {
                    console.error("Error fetching contractors:", error);
                });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return(
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-wrapper" onClick={onWrapperClick}>
                        <div className="modal-content">
                            <button className="modal-close-button" onClick={onClose}>
                                <IconClose />
                            </button>
                            <h2 className="header-modal">Закончить перевозку</h2>
                            <div className="modal-body">
                            <div className="form-group">
                            <div>
                                    Выберите подрядчика:
                                    <p>
                                        <select className="input" name="podryad" value={formData.numcont} onChange={handleChange}>
                                            <option key="" value="">Выберите подрядчика</option>
                                            {contractors.map((contractor) => (
                                                <option key={contractor.numcont} value={contractor.numcont}>
                                                    {contractor.numcont}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                </div>
                                    <button className="button-modal">Закончить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}