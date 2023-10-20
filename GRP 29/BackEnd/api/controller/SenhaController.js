const SenhaService = require('../service/SenhaService')
const ErrorStatus = require('../erros/ErrorStatus');

class SenhaController {
    async create(req, res) {
        try {
            const response = await SenhaService.create(req.body);
            return res.status(201).json(response);
        } catch (error) {
            console.log(error)
            return res.status(ErrorStatus(error)).json(error);
        }
    }

    async find(req, res) {
        try {
            const { guiche } = req.params
            const data = await SenhaService.find(guiche);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }

    async findAll(req, res) {
        try {
            const data = await SenhaService.findAll()
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }
    async chamarSenhaSG(req, res) {
        try {
            const { guiche } = req.params
            const data = await SenhaService.solicitarSenhaService('SG', guiche)
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }

    async chamarSenhaSP(req, res) {
        try {
            const { guiche } = req.params
            const data = await SenhaService.solicitarSenhaService('SP', guiche)
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }

    async chamarSenhaSE(req, res) {
        try {
            const { guiche } = req.params
            const data = await SenhaService.solicitarSenhaService('SE', guiche)
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }

    async relatorio(req, res) {
        try {
            const data = await SenhaService.relatorio()
            return res.status(200).json(data);
        } catch (error) {
            return res.status(ErrorStatus(error)).json(error);
        }
    }

}

module.exports = new SenhaController()