import React, { useState } from "react";
import axios from "axios";

const ChamarProximaSenha: React.FC = () => {
  const [mensagem, setMensagem] = useState("");

  const handleChamarProximaSenha = async () => {
    try {
      const response = await axios.get("/api/chamarProximaSenha");
      setMensagem(response.data.numero_senha);
    } catch (error) {
      console.error("Erro ao chamar próxima senha:", error);
    }
  };

  return (
    <div>
      <h2>Chamar Próxima Senha</h2>
      <button onClick={handleChamarProximaSenha}>Chamar Próxima Senha</button>
      <p>Senha atual: {mensagem}</p>
    </div>
  );
};

export default ChamarProximaSenha;
