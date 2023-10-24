const NotFound = require('../erros/NotFound')
const SenhaRepository = require('../repository/SenhaRepository')
const moment = require('moment');

class SenhaService {
    async create(payload) {

        const ultimaSenha = await SenhaRepository.pegarUltimaSenha()
        let senha
        if (ultimaSenha) {
            senha = ultimaSenha.senha + 1
        } else {
            senha = 1
        }
        const entity = {
            tipoSenha: payload.tipoSenha,
            data: new Date(),
            isFoiChamada: false,
            senha: senha
        }

        const senhaComp = entity.senha.toString().padStart(2, '0')

        const date = entity.data;
        const year = String(date.getFullYear()).slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;

        const formatSenha = `${formattedDate}-${entity.tipoSenha}${senhaComp}`
        const response = {}
        response.senha = formatSenha

        await SenhaRepository.create(entity)

        return response
    }
    async find(guiche) {

        const ultimaSenha = await SenhaRepository.pegarUltimaSenhaChamada()
        let senha
        if (ultimaSenha) {

            const { tipoSenha } = ultimaSenha

            if (ultimaSenha.tipoSenha == 'SP') {
                senha = await SenhaRepository.find('SE')
                if (!senha) {
                    senha = await SenhaRepository.find('SG')
                    if (!senha) {
                        senha = await SenhaRepository.find('SP')
                        if (!senha) {
                            throw new NotFound()
                        }
                    }
                }
            } else if (ultimaSenha.tipoSenha == 'SE' || ultimaSenha.tipoSenha == 'SG') {
                senha = await SenhaRepository.find('SP')
                if (!senha) {
                    senha = await SenhaRepository.find('SE')
                    if (!senha) {
                        senha = await SenhaRepository.find('SG')
                        if (!senha) {
                            throw new NotFound()
                        }
                    }
                }
            } else {
                throw new NotFound()
            }
        } else {
            senha = await SenhaRepository.find('SE')
            if (!senha) {
                senha = await SenhaRepository.find('SG')
                if (!senha) {
                    senha = await SenhaRepository.find('SP')
                    if (!senha) {
                        throw new NotFound()
                    }
                }
            }
        }
        const dataConvertida = new Date()
        const hour = String(dataConvertida.getHours()).padStart(2, '0');
        const minute = String(dataConvertida.getMinutes()).padStart(2, '0');
        const formattedTime = `${hour}:${minute}`;
        await SenhaRepository.updateIsFoiChamada(senha.id, guiche, formattedTime)

        const senhaComp = senha.senha.toString().padStart(2, '0')

        const date = senha.data;
        const year = String(date.getFullYear()).slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}${month}${day}`;

        const formatSenha = `${formattedDate}-${senha.tipoSenha}${senhaComp}`
        senha.senha = formatSenha
        return senha
    }

    async findAll() {
        const response = await SenhaRepository.findAll()

        if (!response) {
            throw new NotFound()
        }

        response.forEach(element => {
            const senhaComp = element.senha.toString().padStart(2, '0')

            const date = element.data;
            const year = String(date.getFullYear()).slice(-2);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const formattedDate = `${year}${month}${day}`;

            const formatSenha = `${formattedDate}-${element.tipoSenha}${senhaComp}`
            element.senha = formatSenha
            const options = {
                timeZone: 'America/Rio_Branco',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            return element
        });

        return response
    }

    async solicitarSenhaService(senha, guiche) {
        const senhaRetorno = await SenhaRepository.chamarSenha(senha)
        if (senhaRetorno == null) throw new NotFound(`Não temos mais senhas do tipo ${senha}`)
        const dataConvertida = new Date()
        const hour = String(dataConvertida.getHours()).padStart(2, '0');
        const minute = String(dataConvertida.getMinutes()).padStart(2, '0');
        const formattedTime = `${hour}:${minute}`;
        await SenhaRepository.updateIsFoiChamada(senhaRetorno.id, guiche, formattedTime)

        return senhaRetorno
    }

    async relatorio(periodo) {
        const qtdSenhas = await SenhaRepository.qtdSenhasEmitidas()
        const qtdSenhasChamadas = await SenhaRepository.qtdSenhasChamadas()
        const todasSenha = await SenhaRepository.findAll()

        const senhasSG = qtdSenhas.filter((element) => element.tipoSenha == 'SG')
        const senhasSP = qtdSenhas.filter((element) => element.tipoSenha == 'SP')
        const senhasSE = qtdSenhas.filter((element) => element.tipoSenha == 'SE')

        const senhasSGChamadas = qtdSenhasChamadas.filter((element) => element.tipoSenha == 'SG')
        const senhasSEChamadas = qtdSenhasChamadas.filter((element) => element.tipoSenha == 'SE')
        const senhasSPChamadas = qtdSenhasChamadas.filter((element) => element.tipoSenha == 'SP')



        const response = {
            quantitativoSenhasEmitidas: qtdSenhas.length + 1,
            quantitativoSenhasAtendidas: qtdSenhasChamadas.length + 1,
            quantitativoSenhasEmitidasPorPrioridade: {
                SG: senhasSG.length + 1,
                SE: senhasSE.length + 1,
                SP: senhasSP.length + 1
            },
            quantitativoSenhasAtendidasPorPrioridade: {
                SG: senhasSGChamadas.length + 1,
                SE: senhasSEChamadas.length + 1,
                SP: senhasSPChamadas.length + 1
            },
            RelatorioDetalhadoSenhas: [
                ...qtdSenhas
            ]


        }

        return response
    }
}

module.exports = new SenhaService()