import React, { useState } from "react";
import axios from "axios";

const EmitirSenha: React.FC = () => {
  const [tipo, setTipo] = useState("");
  const [senha, setSenha] = useState("");

  const handleEmitirSenha = async () => {
    try {
      const response = await axios.post("/api/emitirSenha", { tipo });
      setSenha(response.data.senha);
    } catch (error) {
      console.error("Erro ao emitir senha:", error);
    }
  };

  return (
    <div>
      <h2>Emitir Senha</h2>
      <div>
        <label>Tipo de Senha:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="SP">SP</option>
          <option value="SG">SG</option>
          <option value="SE">SE</option>
        </select>
      </div>
      <button onClick={handleEmitirSenha}>Emitir Senha</button>
      {senha && <p>Nova Senha: {senha}</p>}
    </div>
  );
};

export default EmitirSenha;
