const express = require("express")
const router = express.Router()
const itemController = require("../controllers/itemController")

// /grocery_list => GET
router.get("/", itemController.getItems)

// /grocery_list => post
router.post("/", itemController.createItem)

// /grocery_list/:itemId => put
router.put("/:itemId", itemController.updateItem)

// /grocery_list => patch
router.patch("/", itemController.patchAllItems)

// /grocery_list/delete_selected => delete
router.delete("/delete_selected", itemController.deleteSelectedItems)

// /grocery_list/:itemId => delete
router.delete("/:itemId", itemController.deleteItem)

module.exports = router