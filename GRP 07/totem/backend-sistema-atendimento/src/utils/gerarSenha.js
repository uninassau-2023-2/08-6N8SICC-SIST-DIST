let sequenciaSP = 1;
let sequenciaSG = 1;
let sequenciaSE = 1;

function gerarSenha(tipoSenha) {
  const data = new Date();
  const ano = data.getFullYear().toString().substr(-2);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  let numeroSenha;

  if (tipoSenha === "SP") {
    numeroSenha = sequenciaSP.toString().padStart(2, "0");
    sequenciaSP++;
  } else if (tipoSenha === "SG") {
    numeroSenha = sequenciaSG.toString().padStart(2, "0");
    sequenciaSG++;
  } else if (tipoSenha === "SE") {
    numeroSenha = sequenciaSE.toString().padStart(2, "0");
    sequenciaSE++;
  }

  return `${ano}${mes}${dia}-${tipoSenha}${numeroSenha}`;
}

module.exports = gerarSenha;
