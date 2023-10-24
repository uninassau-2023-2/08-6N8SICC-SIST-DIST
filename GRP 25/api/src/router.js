const express = require('express');
const router = express.Router();
const endpointsController = require('./controllers/endpointsController');


router.get('/test', endpointsController.getAll);
router.get('/SenhaSP', endpointsController.insertSenhaSP); 
router.get('/SenhaSE', endpointsController.insertSenhaSE);
router.get('/SenhaSG', endpointsController.insertSenhaSG); 
router.get('/Atendido', endpointsController.atendido); 
router.get('/Display', endpointsController.displayTemp); 
router.get('/Proximo',endpointsController.proximo);
router.get('/relatorio', endpointsController.relatorio);
module.exports = router;


