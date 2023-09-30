const express = require("express");
const senhaController = require("../controllers/senhaController");

const router = express.Router();

router.post("/api/emitirSenha", senhaController.emitirSenha);
router.get("/api/chamarProximaSenha", senhaController.chamarProximaSenha);
router.get("/api/relatorioSenhas", senhaController.relatorioSenhas);

module.exports = router;
