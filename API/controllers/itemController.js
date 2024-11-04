const Item = require("../models/item")

exports.createItem = (req, res, next) => {
    validate(req)

    const item = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        isSelected: false
    })

    item.save().then(result => {
        res.status(201).json(result)
    }).catch(err => { next(err) })
}

exports.updateItem = (req, res, next) => {
    const id = req.params.itemId

    validate(req)

    Item.findById(id).then(item => {
        if (!item) {
            const error = new Error("L'item n'existe pas.")
            error.statusCode = 404
            throw error
        }

        item.name = req.body.name
        item.quantity = req.body.quantity
        item.price = req.body.price
        item.isSelected = req.body.isSelected
        return item.save()
    }).then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
}

exports.patchAllItems = (req, res, next) => {
    Item.updateMany({}, req.body).then(items => {
        res.json(items)
    }).catch(err => {
        next(err)
    })
}

exports.deleteItem = (req, res, next) => {
    const id = req.params.itemId
    Item.findByIdAndDelete(id).then(() => {
        res.status(204).send()
    }).catch(err => { next(err) })
}

exports.deleteSelectedItems = (req, res, next) => {
    Item.deleteMany({isSelected: true}).then(() => {
        res.status(204).send()
    }).catch(err => { next(err) })
}

exports.getItems = (req, res, next) => {
    Item.find().then(items => {
        res.json(items)
    }).catch(err => {
        next(err)
    })
}

const validate = req => {
    if (!req.body.name) {
        const error = new Error("Le nom est requis.")
        error.statusCode = 422
        throw error
    }

    if (!req.body.quantity || req.body.quantity < 1) {
        const error = new Error("La quantité est requise et doit être au moin un.")
        error.statusCode = 422
        throw error
    }

    if (!req.body.price || req.body.price <= 0) {
        const error = new Error("Le prix est requis et doit être suppérieur à zéro.")
        error.statusCode = 422
        throw error
    }
}