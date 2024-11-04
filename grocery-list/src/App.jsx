import './App.css';
import React, {useEffect, useState} from "react";
import {Toaster} from 'react-hot-toast';
import axios from "axios"
import ItemRow from "./components/ItemRow";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import FormAddItem from "./components/FormAddItem";

function App() {
    useEffect(() => {
        document.title = "Liste d'épicerie"
        getItems()
    })

    const [items, setItems] = useState([])

    const getItems = async () => {
        const {data} = await axios.get("http://localhost:3001/grocery_list")
        setItems(data.sort((a, b) => a.createdAt - b.createdAt))
    }

    const handleCheckboxChange = async e => {
        await axios.patch("http://localhost:3001/grocery_list", {isSelected: e.target.checked})
    }

    const deleteSelectedItems = async () => {
        await axios.delete("http://localhost:3001/grocery_list/delete_selected")
    }

    const selectedItemsCount = items.filter(x => x.isSelected).length

    return (
        <>
            <div className="w-full  sm:max-w-3xl mt-32 mb-6 px-6 py-8 bg-white shadow-md sm:rounded-lg mx-auto ">
                <p className="font-bold">{selectedItemsCount} / {items.length}</p>
                <progress className="progress progress-primary mb-3" value={selectedItemsCount} max={items.length}/>
                <table className="table table-pin-rows">
                    <thead>
                        <tr className="bg-white">
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" checked={items.every(item => item.isSelected)} onChange={handleCheckboxChange}/>
                                </label>
                            </th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">Item</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">Quantité</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">Prix unitaire</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
                                <div className="tooltip tooltip-bottom float-end" data-tip="Supprimer les items sélectionnés">
                                    <button className="btn btn-circle btn-sm hover:bg-error" onClick={deleteSelectedItems}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {items.map(item => <ItemRow item={item} key={item._id}/>)}
                    <FormAddItem/>
                    </tbody>
                </table>
            </div>
            <Toaster/>
        </>
  );
}

export default App;
