const express = require("express");
const router = express.Router();
const atendimentoController = require("../controllers/atendimentoController");

router.post("/emitir-senha-sp", atendimentoController.emitirSenhaSP);
router.post("/emitir-senha-sg", atendimentoController.emitirSenhaSG);
router.post("/emitir-senha-se", atendimentoController.emitirSenhaSE);
router.get("/proxima-senha", atendimentoController.proximaSenha);
router.get("/relatorio-diario", atendimentoController.relatorioDiario);
router.get("/relatorio-mensal", atendimentoController.relatorioMensal);
module.exports = router;
