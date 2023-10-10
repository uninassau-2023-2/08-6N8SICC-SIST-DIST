const express = require('express');
const router = express.Router();

// Simulação de dados para os relatórios (substituir por dados reais)
const dadosRelatorios = {
  diario: {
    quantidadeEmitidas: 100,
    quantidadeAtendidas: 80,
    prioridadeSE: 30,
    prioridadeSG: 40,
    prioridadeSP: 30,
    atendidasSE: 20,
    atendidasSG: 40,
    atendidasSP: 20,
  },
  mensal: {
    quantidadeEmitidas: 1200,
    quantidadeAtendidas: 950,
    prioridadeSE: 400,
    prioridadeSG: 500,
    prioridadeSP: 300,
    atendidasSE: 250,
    atendidasSG: 450,
    atendidasSP: 250,
  },
  detalhado: [
    {
      numeracao: 1,
      tipoSenha: 'SE',
      dataHoraEmissao: '01/10/2023 10:00',
      dataHoraAtendimento: '01/10/2023 10:30',
      guicheSA: 'Guichê 5',
    },
  ],
  tm: {
    tempoMedio: 15, // Em minutos
  },
};

// Rota para a página de relatórios
router.get('/', function (req, res, next) {
  res.render('relatorios', {
    title: 'Relatórios',
    diario: dadosRelatorios.diario,
    mensal: dadosRelatorios.mensal,
    detalhado: dadosRelatorios.detalhado,
    tm: dadosRelatorios.tm,
  });
});

module.exports = router;
