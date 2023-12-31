const express = require('express');
const router = express.Router();
const path = require('path');


const multer = require('multer');

const productsController = require('../controllers/productsController');



const upload = multer({ storage: multer.memoryStorage() });


router.get("/", productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get("/create", productsController.create); 
router.post("/create", upload.single('imageProduct'), productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get("/detail/:id", productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/edit/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete("/:id", productsController.destroy); 


module.exports = router;
