import React, {useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faPen, faTrash, faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import {getFormErrors} from "./utils/FormValidation";

const ItemRow = ({item, addForm}) => {
    let moneyFormat = new Intl.NumberFormat('fr-ca', {
        style: 'currency',
        currency: 'CAD',
    });

    const [isEditing, setIsEditing] = useState(addForm)
    const [formData, setFormData] = useState({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    })
    const [formHasErrors, setFormHasErrors] = useState({})


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value
        })
    }

    const openForm = () => {
        setFormData({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })
        setFormHasErrors({})
        setIsEditing(true)
    }

    const handleRadioButtonChange = async e => {
        console.log(e.target.checked)
        item.isSelected = e.target.checked
        await axios.put(`http://localhost:3001/grocery_list/${item._id}`, item)
    }

    const deleteItem = async () => {
        try {
            await axios.delete(`http://localhost:3001/grocery_list/${item._id}`)

            toast.custom((
                <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
                        <FontAwesomeIcon icon={faCircleXmark}/>
                    </div>
                    <div className="ms-3 text-sm font-normal">{item.name} a été supprimé</div>
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

    const updateItem = async () => {
        const validation = getFormErrors(formData)
        setFormHasErrors(validation)
        if (validation.name || validation.quantity || validation.price)
            return

        try {
            await axios.put(`http://localhost:3001/grocery_list/${item._id}`, formData)
            setIsEditing(false)

            toast.custom((
                <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow" role="alert">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                        <FontAwesomeIcon icon={faCheck}/>
                    </div>
                    <div className="ms-3 text-sm font-normal">{item.name} a été modifié</div>
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
        <tr>
            <td>
                <label>
                    <input type="checkbox" className="checkbox" checked={item.isSelected} onChange={handleRadioButtonChange}/>
                </label>
            </td>
            {isEditing ? (
                <>
                    <td className="px-6 pl-3 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        <input
                            type="text"
                            placeholder="Nom" name="name" value={formData.name} onChange={handleChange}
                            className={`input input-sm w-full max-w-xs ${formHasErrors.name ? "input-error" : ""}`}/>
                        {formHasErrors.name && <div className="label py-0">
                            <span className="label-text-alt text-error">Le nom est requis</span>
                        </div>}
                    </td>
                    <td className="px-6 pl-3 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        <input
                            type="number" min="1" pattern="[0-9]"
                            placeholder="Quantité" name="quantity" value={formData.quantity} onChange={handleChange}
                            className={`input input-sm w-full max-w-xs ${formHasErrors.quantity ? "input-error" : ""}`}/>
                        {formHasErrors.quantity && <div className="label py-0">
                            <span className="label-text-alt text-error">La quantité doit être au moins 1</span>
                        </div>}
                    </td>
                    <td className="px-6 pl-3 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        <input
                            type="number"
                            placeholder="Prix unitaire" name="price" value={formData.price} onChange={handleChange}
                            className={`input input-sm w-full max-w-xs ${formHasErrors.price ? "input-error" : ""}`}/>
                        {formHasErrors.price && <div className="label py-0">
                            <span className="label-text-alt text-error">Le prix doit être suppérieur à zéro</span>
                        </div>}
                    </td>
                    <td className="pl-6 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 w-fit">
                        <div className="join">
                            <div className="tooltip tooltip-bottom" data-tip="Confirmer">
                                <button className="btn join-item btn-sm hover:bg-success" onClick={updateItem}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                            </div>
                            <div className="tooltip tooltip-bottom" data-tip="Annuler">
                                <button className="btn join-item btn-sm hover:bg-error"
                                        onClick={() => setIsEditing(false)}>
                                    <FontAwesomeIcon icon={faX}/>
                                </button>
                            </div>
                        </div>
                    </td>
                </>
                ) : (
                <>
                    <td className="px-6 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        {item.name}
                    </td>
                    <td className="px-6 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        {item.quantity}
                    </td>
                    <td className="px-6 whitespace-no-wrap border-b border-gray-500 text-sm leading-5">
                        {moneyFormat.format(item.price)}
                    </td>
                    <td className="pl-6 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 w-fit">
                        <div className="join">
                            <div className="tooltip tooltip-bottom" data-tip="Modifier">
                                <button className="btn join-item btn-sm hover:bg-info" onClick={openForm}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>
                            </div>
                            <div className="tooltip tooltip-bottom" data-tip="Supprimer">
                                <button className="btn join-item btn-sm hover:bg-error" onClick={deleteItem}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </div>
                        </div>
                    </td>
                </>
            )}
        </tr>
    )
}

export default ItemRow
