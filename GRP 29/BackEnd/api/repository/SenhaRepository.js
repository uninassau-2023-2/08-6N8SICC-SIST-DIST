const db = require('../infra/models')

class SenhaRepository {
    async create(payload) {
        await db.Atendimento.create(payload)
    }

    async pegarUltimaSenha() {
        return await db.Atendimento.findOne({
            order: [['senha', 'DESC']]
        })
    }

    async pegarUltimaSenhaChamada() {
        return await db.Atendimento.findOne({
            where: {
                isFoiChamada: true,
            },
            order: [['updatedAt', 'DESC']]
        })
    }
    async chamarSenha(senha) {
        return await db.Atendimento.findOne({
            where: {
                isFoiChamada: false,
                tipoSenha: senha
            },
            order: [['senha', 'DESC']]
        })
    }

    async findAll() {
        return await db.Atendimento.findAll({
            where: {
                isFoiChamada: true
            },
            order: [['updatedAt', 'DESC']],
            limit: 5
        })
    }

    async find(tipoSenha) {
        return await db.Atendimento.findOne({
            where: {
                isFoiChamada: false,
                tipoSenha: tipoSenha
            },
            order: [['senha', 'ASC']]
        })
    }

    async updateIsFoiChamada(id, guiche, hora) {
        await db.Atendimento.update({
            isFoiChamada: true,
            guiche: guiche,
            hora: hora
        },
            {
                where: {
                    id: id
                }
            }
        )
    }

    async qtdSenhasEmitidas(periodo) {
        return await db.Atendimento.findAll()
    }

    async qtdSenhasChamadas(periodo) {
        return await db.Atendimento.findAll({
            where: {
                isFoiChamada: true,
            }
        })
    }
}

module.exports = new SenhaRepository()