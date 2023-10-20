const endpoints = require('../models/endpoints');
//criar controles diferentes para cada freature cliente, relatorio e etc

const getAll = async (req,res) => {

    const test = await endpoints.getAll();

    return res.status(200).json(test);

};


const insertSenhaSP = async (req, res) => {
   
    const SP = await endpoints.insertSenhaSP();
    return res.status(200).json(SP);
   
    
};

const insertSenhaSE = async (req, res) => {
   
    const SE = await endpoints.insertSenhaSE();
    return res.status(200).json(SE);
   
    
};

const insertSenhaSG = async (req, res) => {
   
    const SG = await endpoints.insertSenhaSG();
    return res.status(200).json(SG);
   
    
};

const atendido = async (req, res) => {
   
    const atend = await endpoints.atendido();
    return res.status(200).json(atend);
   
    
};

const displayTemp = async ( req, res) => {
   
    const display = await endpoints.displayTemp();
    return res.status(200).json(display);
   
    
};


const proximo = async ( req, res) => {
   
    const prox = await endpoints.proximo();
    return res.status(200).json(prox);
   
    
};
const relatorio = async (req, res) => {
    const { dia, mes, numeroRelatorio } = req.query;
    if (isNaN(mes) || isNaN(numeroRelatorio)) {
        return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }
    
    const relat = await endpoints.relatorio(dia, mes, numeroRelatorio);
    return res.status(200).json(relat);
};




module.exports = {
    getAll,
    insertSenhaSP,
    insertSenhaSE,
    insertSenhaSG,
    atendido,
    displayTemp,
    proximo,
    relatorio
};


