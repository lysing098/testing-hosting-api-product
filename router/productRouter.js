const express  = require('express')
const productController = require('../controller/productController')
const router = express.Router()

router.get('/getall',productController.getAll)
router.get('/get/:id',productController.getById)
router.post('/create',productController.create)
router.put('/update/:id',productController.update)
router.delete('/delete/:id',productController.delete)

module.exports = router