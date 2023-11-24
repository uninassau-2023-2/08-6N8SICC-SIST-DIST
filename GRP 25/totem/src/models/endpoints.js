const connection = require('../models/connection');
//criar lógica do tempo de atendimento para chamar senhas
const insertSenhaSP = async () => {
    const prioridade = 'SP';
    const [result] = await connection.execute(
        'SELECT MAX(ordem) as maxOrdem FROM Senhas WHERE prioridade = ? AND DAY(data_emissao) = DAY(CURDATE())',
        [prioridade]
    );
    let ordem = 1;
    if (result[0].maxOrdem !== null && result[0].maxOrdem >= 1) {
        ordem = result[0].maxOrdem + 1;
    }
    try {
        await connection.execute(
            'INSERT INTO Senhas (prioridade, data_emissao, ordem) VALUES (?, now(), ?)',
            [prioridade, ordem]
        );
        await connection.execute(
            'INSERT INTO FilaTemp (prioridade, data_emissao, ordem) VALUES (?,now(), ?)',
            [prioridade, ordem]
        );
    } catch (error) {
        return error;
    }
    return {
        "Senhas":"Pressione para retirar sua senha de Prioridade",
        "Senhas Prioridade(SP) emitidas":ordem };
};
const insertSenhaSE = async () => {
    const prioridade = 'SE';
    const [result] = await connection.execute(
        'SELECT MAX(ordem) as maxOrdem FROM Senhas WHERE prioridade = ? AND DAY(data_emissao) = DAY(CURDATE())',
        [prioridade]
    );
    let ordem = 1;
    if (result[0].maxOrdem !== null && result[0].maxOrdem >= 1) {
        ordem = result[0].maxOrdem + 1;
    }
    try {
        await connection.execute(
            'INSERT INTO Senhas (prioridade, data_emissao, ordem) VALUES (?, now(), ?)',
            [prioridade,  ordem]
        );
        await connection.execute(
            'INSERT INTO FilaTemp (prioridade, data_emissao, ordem) VALUES (?,now(), ?)',
            [prioridade, ordem]
        );
    } catch (error) {
        return error;
    }
    return {
        "Senhas":"Pressione para retirar sua senha de Prioridade",
        "Senhas Prioridade(SE) emitidas":ordem };
};
const insertSenhaSG = async () => {
    const prioridade = 'SG';
    const [result] = await connection.execute(
        'SELECT MAX(ordem) as maxOrdem FROM Senhas WHERE prioridade = ? AND DAY(data_emissao) = DAY(CURDATE())',
        [prioridade]
    );
    let ordem = 1;
    if (result[0].maxOrdem !== null && result[0].maxOrdem >= 1) {
        ordem = result[0].maxOrdem + 1;
    }
    try {
        await connection.execute(
            'INSERT INTO Senhas (prioridade, data_emissao, ordem) VALUES (?, now(), ?)',
            [prioridade, ordem]
        );
        await connection.execute(
            'INSERT INTO FilaTemp (prioridade, data_emissao, ordem) VALUES (?,now(), ?)',
            [prioridade, ordem]
        );
    } catch (error) {
        return error;
    }
    return {
        "Senhas":"Pressione para retirar sua senha de Prioridade",
        "Senhas Prioridade(SG) emitidas":ordem };
};
const atendido = async () => {
    const guiche = '01';
    const result = await connection.execute(
        'SELECT data_atendimento FROM DataTemp'
    );
    //console.log(result)
    old_date=result[0][0].data_atendimento
    await connection.execute(
        'UPDATE DataTemp SET data_atendimento = NOW()'
    );    
    const [lastpResult] = await connection.execute(
        'SELECT prioridade FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp) AND DAY(data_emissao) = DAY(CURDATE())'
        );
        let lastp = lastpResult[0] ? lastpResult[0].prioridade : null;
        let ultimasenha = lastpResult[0] ? lastpResult[0].prioridade : null;
        //console.log('teste:',lastp)
        if(lastp=== null){
            await proximo();
            const text='Nenhuma senha na foi chamada para ser atendida! A próxima senha foi chamada caso haja senhas na fila, verifique no Display';
            return text;
        };
        let count = 0;
        let senhaAtendida;
        while (count  <2 & !senhaAtendida) {
            //console.log('check value',lastp)
            if (lastp=== null || lastp==='SG'){
                const [spResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SP" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass1')
                count++;
                //console.log('teste length?:',spResult.length)
                if (spResult.length > 0) {
                    senhaAtendida = spResult[0];
                    //console.log('teste1', spResult, count);
                    break;
                } else{
                    lastp='SP';
                }     
            }
            if (!senhaAtendida && lastp === 'SP' ) {
                const [seResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SE" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass2')
                count++;
                if (seResult.length > 0) {
                    senhaAtendida = seResult[0];
                    //console.log('teste2', seResult);
                    break;
                }else{
                    lastp = 'SE';
                }
            }
            if (!senhaAtendida && lastp === 'SE') {
                const [sgResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SG" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass3')
                count++;

                //console.log(sgResult);
                if (sgResult.length > 0) {
                    senhaAtendida = sgResult[0];
                    //console.log('teste3', sgResult);
                    break;
                } else{
                    lastp = 'SP';
                }  
            }
            
        }    
        if (!senhaAtendida) {
            
            return 'Não existem senhas na fila.';

        }
        const { prioridade, data_emissao, ordem } = senhaAtendida;
        prioridade1=prioridade;
        ordem1=ordem;
        data_emissao.setHours(data_emissao.getHours() - 3);
        data_emissao1 = data_emissao.toISOString().slice(0, 19).replace('T', ' ');
        //onsole.log('Filatemp:',prioridade1,data_emissao1,ordem1)
    const [rows, fields] = await connection.execute(
        'SELECT prioridade, ordem, data_emissao, guiche FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp)'
      );
     //console.log('Nome:',(rows));
      //console.log('name2:',(date_now));
        if (rows.length > 0) {
           const{ prioridade, ordem,data_emissao} = rows[0];
           prioridade2=prioridade;
           ordem2=ordem;
           data_emissao.setHours(data_emissao.getHours() - 3);
           data_emissao2=data_emissao.toISOString().slice(0, 19).replace('T', ' ');
    //console.log('teste:',prioridade2, ordem2,data_emissao2, guiche)
        }
    await connection.execute(
        'UPDATE DisplayTemp JOIN (SELECT MAX(id_dpstemp) as max_id FROM DisplayTemp) AS subquery SET DisplayTemp.guiche = ? WHERE DisplayTemp.id_dpstemp = subquery.max_id',
        [guiche]
    );  
    await connection.execute(
        'DELETE FROM DisplayTemp WHERE id_dpstemp IN (SELECT id_dpstemp FROM (SELECT id_dpstemp FROM DisplayTemp ORDER BY id_dpstemp DESC LIMIT 5, 9999999 ) AS subquery)'
        );
    await connection.execute(
        'DELETE FROM FilaTemp WHERE prioridade=? and ordem=?',
            [prioridade1,ordem1]
        );
    await connection.execute(
            'INSERT INTO DisplayTemp (prioridade,guiche, data_emissao, ordem) VALUES ( ?,? , ?, ?)',
            [prioridade1,guiche,data_emissao1,ordem1]
        );           
    await connection.execute(
      'UPDATE Senhas SET data_atendimento = ?,atendido = 1,guiche = ?,tempo_atendimento = now() WHERE prioridade = ? AND DATE(data_emissao) = DATE(?) AND ordem = ?',
      [old_date,guiche,prioridade2,data_emissao2,ordem2]  
        );
        //console.log(old_date,guiche,prioridade2,data_emissao2,ordem2);
    return ['Senha:',prioridade1,ordem1,'ordem anterior',ultimasenha]
};
const displayTemp = async () => {
    const [results] = await connection.execute(`SELECT CONCAT(DATE_FORMAT(data_emissao, "%y%m%d"),
     "-", prioridade, ordem) AS Senha, guiche 
    FROM DisplayTemp ORDER BY id_dpstemp DESC LIMIT 5`);
    const senhas = results.map(result => result.Senha);
    const next = results.shift();
    //console.log(results);
    //console.log(next);
    return ['Próxima senha',next, senhas,];
}

const truncateDia = async () =>{
    await connection.execute( `DELETE FROM Senhas
    WHERE (prioridade, ordem, DATE(data_emissao))
    IN (SELECT prioridade, ordem, DATE(data_emissao) FROM FilaTemp);
    `  );
    await connection.execute( ' TRUNCATE TABLE DataTemp'  );
    await connection.execute( ' TRUNCATE TABLE DisplayTemp'  );
    await connection.execute( ' TRUNCATE TABLE FilaTemp'  );
    await connection.execute('INSERT INTO DataTemp (data_atendimento) VALUES (NOW())');
    const result ='Dia encerrado, todas as senhas restantes foram apagadas'
    return result  
};
const proximo = async () =>{
    const guiche = '01';
    const [lastpResult] =await connection.execute(
            `SELECT prioridade 
            FROM DisplayTemp 
            WHERE id_dpstemp = (
                SELECT MAX(id_dpstemp) 
                FROM DisplayTemp) AND
                DAY(data_emissao) = DAY(CURDATE()
            )`
        );
        let lastp = lastpResult[0] ? lastpResult[0].prioridade : null;
        let ultimasenha = lastpResult[0] ? lastpResult[0].prioridade : null;
        let count = 0;
        let senhaAtendida;
        while (count  <2 & !senhaAtendida) {
            //console.log('check value',lastp)
            if (lastp=== null || lastp==='SG'){
                const [spResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SP" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass1')
                count++;
                //console.log('teste length?:',spResult.length)
                if (spResult.length > 0) {
                    senhaAtendida = spResult[0];
                    //console.log('teste1', spResult, count);
                    break;
                } else{
                    lastp='SP';
                }    
            }
            if (!senhaAtendida && lastp === 'SP' ) {
                const [seResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SE" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass2')
                count++;
                if (seResult.length > 0) {
                    senhaAtendida = seResult[0];
                    //console.log('teste2', seResult);
                    break;
                }else{
                    lastp = 'SE';
                }
            }
            if (!senhaAtendida && lastp === 'SE') {
                const [sgResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SG" ORDER BY ordem LIMIT 1'
                );
                //console.log('pass3')
                count++;

                //console.log(sgResult);
                if (sgResult.length > 0) {
                    senhaAtendida = sgResult[0];
                    //console.log('teste3', sgResult);
                    break;
                } else{
                    lastp = 'SP';
                }
            } 
        }
        if (!senhaAtendida) {
            
            return 'Não existem senhas na fila.';
        }   
        const { prioridade, data_emissao, ordem } = senhaAtendida;
        prioridade1=prioridade;
        ordem1=ordem;
        //console.log(data_emissao)
        data_emissao.setHours(data_emissao.getHours() - 3);
        data_emissao1 = data_emissao.toISOString().slice(0, 19).replace('T', ' '); 
            //console.log('Filatemp:',prioridade1,data_emissao1,ordem1)
    const [rows, fields] = await connection.execute(
        'SELECT prioridade, ordem, data_emissao, guiche FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp)'
      );
      //console.log('Nome:',(rows));
      //console.log('name2:',(date_now));
        if (rows.length > 0) {
           const{ prioridade, ordem,data_emissao, guiche } = rows[0];
           prioridade2=prioridade;
           ordem2=ordem;
           data_emissao.setHours(data_emissao.getHours() - 3);
           data_emissao2=data_emissao.toISOString().slice(0, 19).replace('T', ' ');
    //console.log('teste:',prioridade2, ordem2,data_emissao2, guiche2)       
        }
    await connection.execute(
        'UPDATE DisplayTemp JOIN (SELECT MAX(id_dpstemp) as max_id FROM DisplayTemp) AS subquery SET DisplayTemp.guiche = ? WHERE DisplayTemp.id_dpstemp = subquery.max_id',
        [guiche]
    );  
    await connection.execute(
        'DELETE FROM DisplayTemp WHERE id_dpstemp IN (SELECT id_dpstemp FROM (SELECT id_dpstemp FROM DisplayTemp ORDER BY id_dpstemp DESC LIMIT 5, 9999999 ) AS subquery)'
        );
    await connection.execute(
        'DELETE FROM FilaTemp WHERE prioridade=? and ordem=?',
            [prioridade1,ordem1]
        );
    await connection.execute(
            'INSERT INTO DisplayTemp (prioridade,guiche, data_emissao, ordem) VALUES ( ?,? , ?, ?)',
            [prioridade1,guiche,data_emissao1,ordem1]
        );                
        //console.log(lastp);
        return ['Senha:',prioridade1,ordem1,'ordem anterior',ultimasenha]

}
const relatorio = async (dia, mes, numeroRelatorio) => {
    try {
        let query;
        switch (numeroRelatorio) {
            case '1':
                query = 'SELECT COUNT(*) AS total_emitidas FROM Senhas WHERE DAY(data_emissao) = ? AND MONTH(data_emissao) = ?';
                break;
            case '2':
                query = 'SELECT COUNT(*) AS total_atendidas FROM Senhas WHERE atendido = 1 AND DAY(data_atendimento) = ? AND MONTH(data_atendimento) = ?';
                break;
            case '3':
                query = 'SELECT prioridade, COUNT(*) AS total_emitidas_por_prioridade FROM Senhas WHERE DAY(data_emissao) = ? AND MONTH(data_emissao) = ? GROUP BY prioridade';
                break;
            case '4':
                query = 'SELECT prioridade, COUNT(*) AS total_atendidas_por_prioridade FROM Senhas WHERE atendido = 1 AND DAY(data_atendimento) = ? AND MONTH(data_atendimento) = ? GROUP BY prioridade';
                break;
            case '5':
                query = 'SELECT id, prioridade, data_emissao, guiche, ordem, CASE WHEN atendido = 1 THEN data_atendimento ELSE NULL END AS data_atendimento FROM Senhas WHERE DAY(data_emissao) = ? AND MONTH(data_emissao) = ?';
                break;
            case '6':
                query = `SELECT ROUND(AVG(TIMESTAMPDIFF(SECOND, data_atendimento, tempo_atendimento)) / 60, 2) AS media_atendimento_minutos 
                FROM Senhas 
                WHERE atendido = 1 AND DAY(data_emissao) = ? AND MONTH(data_emissao) = ?
                
                `;
                break;
            default:
                throw new Error('Número de relatório inválido.');
        }
        const [results] = await connection.query(query, [dia, mes]);

        return [results];
    } catch (error) {
        throw error;
    }
};
module.exports = {
    truncateDia,
    insertSenhaSP,
    insertSenhaSE,
    insertSenhaSG,
    atendido,
    displayTemp,
    proximo,
    relatorio
};