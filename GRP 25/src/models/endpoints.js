
const connection = require('../models/connection');
//ajustar identação

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
        "Senhas Prioridade(SG) emitidas":ordem };
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
        "Senhas Prioridade(SG) emitidas":ordem };
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
    old_date=result[0][0].data_atendimento
  
    
   
    await connection.execute(
        'UPDATE DataTemp SET data_atendimento = NOW()'
    );    


    const [lastpResult] = await connection.execute(
        'SELECT prioridade FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp) AND DAY(data_emissao) = DAY(CURDATE())'
        );
       
       //console.log(lastpResult)
    
        let lastp = lastpResult[0] ? lastpResult[0].prioridade : null;
        let count = 0;
        let senhaAtendida;
        while (count < 3 & !senhaAtendida) {
            if (lastp === 'SP') {
                const [seResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SE" ORDER BY ordem LIMIT 1'
                );
                count++;
                //console.log(seResult);
                lastp = 'SE';
                if (seResult.length > 0) {
                    senhaAtendida = seResult[0];
                } 
            }
        
            if (!senhaAtendida && (lastp === 'SE' || !lastp)) {
                const [sgResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SG" ORDER BY ordem LIMIT 1'
                );
                count++;
                lastp = 'SG';
                if (sgResult.length > 0) {
                    senhaAtendida = sgResult[0];
                } 
            }
        
            if (!senhaAtendida && (lastp === 'SG' || !lastp)) {
                const [spResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SP" ORDER BY ordem LIMIT 1'
                );
                count++;
                lastp = 'SP';
                //console.log(spResult);
                if (spResult.length > 0) {
                    senhaAtendida = spResult[0];
                } 
                    
                
            }
            //console.log(count,lastp)
        }
        
  
        if (!senhaAtendida) {
            
            return 'Não existem senhas na fila.';
        }
       
        
        
        const { prioridade, data_emissao, ordem } = senhaAtendida;
        prioridade1=prioridade;
        ordem1=ordem;
        data_emissao1 = data_emissao.toISOString().slice(0, 19).replace('T', ' ');
        //onsole.log('Filatemp:',prioridade1,data_emissao1,ordem1)
        


    const [rows, fields] = await connection.execute(
        'SELECT prioridade, ordem, data_emissao, guiche FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp)'
      );
      //console.log('Nome:',(rows));
      //console.log('name2:',(date_now));
        if (rows.length > 0) {
           const{ prioridade, ordem,data_emissao, guiche } = rows[0];
           prioridade2=prioridade;
           ordem2=ordem;
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
    
    await connection.execute(
      'UPDATE Senhas SET data_atendimento = ?,atendido = 1,guiche = ?,tempo_atendimento = now() WHERE prioridade = ? AND DATE(data_emissao) = DATE(?) AND ordem = ?',
      [old_date,guiche,prioridade2,data_emissao2,ordem2]
        
        );
        
        //console.log(lastp);
        return ['Senha:',prioridade1,ordem1,'ordem anterior',lastp]


};


const displayTemp = async () => {
    const [results] = await connection.execute('SELECT CONCAT(DATE_FORMAT(data_emissao, "%y%m%d"), "-", prioridade, ordem) AS Senha, guiche FROM DisplayTemp ORDER BY id_dpstemp DESC LIMIT 5');

    
    const senhas = results.map(result => result.Senha);

    const next = results.shift();
    
    //console.log(results);
    //console.log(next);

    return ['Próxima senha',next, senhas,];
}



const getAll = async () =>{

    const result = await connection.execute(
        'SELECT data_atendimento FROM DataTemp'
    );
    
    await connection.execute('UPDATE DataTemp SET data_atendimento = now()');
    old_date1=result[0][0].data_atendimento
    await connection.execute('UPDATE DataTemp SET data_atendimento = ?',
    [old_date1]);
  return old_date1  
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
        let count = 0;
        let senhaAtendida;
        while (count  <3 & !senhaAtendida) {
            if (lastp === null){
                const [seResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SP  " ORDER BY ordem LIMIT 1'
                );
                count++;
                console.log(seResult);
                lastp = 'SE';
                if (seResult.length > 0) {
                    senhaAtendida = seResult[0];
                } 
                
            }
            if (lastp === 'SP') {
                const [seResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SE" ORDER BY ordem LIMIT 1'
                );
                count++;
                console.log(seResult);
                lastp = 'SE';
                if (seResult.length > 0) {
                    senhaAtendida = seResult[0];
                } 
            }
        
            if (!senhaAtendida && (lastp === 'SE' || !lastp)) {
                const [sgResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SG" ORDER BY ordem LIMIT 1'
                );
                count++;
                lastp = 'SG';
                if (sgResult.length > 0) {
                    senhaAtendida = sgResult[0];
                } 
            }
        
            if (!senhaAtendida && (lastp === 'SG' || !lastp)) {
                const [spResult] = await connection.execute(
                    'SELECT * FROM FilaTemp WHERE prioridade = "SP" ORDER BY ordem LIMIT 1'
                );
                count++;
                lastp = 'SP';
                console.log(spResult);
                if (spResult.length > 0) {
                    senhaAtendida = spResult[0];
                } 
                    
                
            }
            console.log(count,lastp)
        }
        
  
        if (!senhaAtendida) {
            
            return 'Não existem senhas na fila.';
        }
       
        
        
        const { prioridade, data_emissao, ordem } = senhaAtendida;
        prioridade1=prioridade;
        ordem1=ordem;
        data_emissao1 = data_emissao.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Filatemp:',prioridade1,data_emissao1,ordem1)
        


    const [rows, fields] = await connection.execute(
        'SELECT prioridade, ordem, data_emissao, guiche FROM DisplayTemp WHERE id_dpstemp = (SELECT MAX(id_dpstemp) FROM DisplayTemp)'
      );
      //console.log('Nome:',(rows));
      //console.log('name2:',(date_now));
        if (rows.length > 0) {
           const{ prioridade, ordem,data_emissao, guiche } = rows[0];
           prioridade2=prioridade;
           ordem2=ordem;
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
    
      
        console.log(lastp);
        return ['Senha:',prioridade1,ordem1,'ordem anterior',lastp]

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
                query = `SELECT AVG(TIMESTAMPDIFF(MINUTE, data_atendimento, tempo_atendimento)) AS media_atendimento_minutos 
                FROM Senhas 
                WHERE atendido = 1 AND DAY(data_emissao) = ? AND MONTH(data_emissao) = ?;
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
    getAll,
    insertSenhaSP,
    insertSenhaSE,
    insertSenhaSG,
    atendido,
    displayTemp,
    proximo,
    relatorio
};