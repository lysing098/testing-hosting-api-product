const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.upload.single("image"), productController.create);
router.put("/:id", productController.upload.single("image"), productController.update);
router.delete("/:id", productController.delete);

module.exports = router;
