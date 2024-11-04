import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleXmark, faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {getFormErrors} from "./utils/FormValidation";

const FormAddItem = () => {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        price: ""
    })
    const [formHasErrors, setFormHasErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        // isFormValid({...formData, [name]: value})
        setFormData({
            ...formData, [name]: value
        })
    }

    const resetForm = () => {
        setFormData({
            name: "",
            quantity: "",
            price: ""
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const validation = getFormErrors(formData)
        setFormHasErrors(validation)
        if (validation.name || validation.quantity || validation.price)
            return

        try {
            await axios.post(`http://localhost:3001/grocery_list`, formData)
            resetForm()
            toast.custom((
                <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                        <FontAwesomeIcon icon={faCheck}/>
                    </div>
                    <div className="ms-3 text-sm font-normal">{formData.name} a été ajouté à la liste</div>
                </div>
            ), { duration: 1000 })
        }
        catch (err) {
            toast.custom((
                <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
                        <FontAwesomeIcon icon={faCircleXmark}/>
                    </div>
                    <div className="ms-3 text-sm font-normal">{err.message}</div>
                </div>
            ), { duration: 1000 })
        }
    }

    return (
        <>
            <tr>
                <td>
                    <form id="formAddItem" onSubmit={handleSubmit}></form>
                    <div className="tooltip tooltip-bottom" data-tip="Ajouter">
                        <button type="submit" form="formAddItem" className="btn btn-square btn-sm hover:bg-success">
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                    </div>
                </td>
                <td className="px-6 pl-3 whitespace-no-wrap text-sm leading-5">
                    <input type="text" form="formAddItem"
                        placeholder="Nom" name="name" value={formData.name} onChange={handleChange}
                        className={`input input-sm w-full max-w-xs ${formHasErrors.name ? "input-error" : ""}`}/>
                    {formHasErrors.name && <div className="label py-0">
                        <span className="label-text-alt text-error">Le nom est requis</span>
                    </div>}
                </td>
                <td className="px-6 pl-3 whitespace-no-wrap text-sm leading-5">
                    <input type="number" min="1" pattern="[0-9]" form="formAddItem"
                        placeholder="Quantité" name="quantity" value={formData.quantity} onChange={handleChange}
                        className={`input input-sm w-full max-w-xs ${formHasErrors.quantity ? "input-error" : ""}`}/>
                    {formHasErrors.quantity && <div className="label py-0">
                        <span className="label-text-alt text-error">La quantité doit être au moins 1</span>
                    </div>}
                </td>
                <td className="px-6 pl-3 whitespace-no-wrap text-sm leading-5">
                    <input type="number" form="formAddItem"
                        placeholder="Prix unitaire" name="price" value={formData.price} onChange={handleChange}
                        className={`input input-sm w-full max-w-xs ${formHasErrors.price ? "input-error" : ""}`}/>
                    {formHasErrors.price && <div className="label py-0">
                        <span className="label-text-alt text-error">Le prix doit être suppérieur à zéro</span>
                    </div>}
                </td>
            </tr>
        </>
    )
}

export default FormAddItem