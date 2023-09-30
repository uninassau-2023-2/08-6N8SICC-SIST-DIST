import React, { useEffect, useState } from "react";
import axios from "axios";

interface Senha {
  id: number;
  numero_senha: string;
  tipo_senha: string;
  atendida: boolean;
  data_emissao: string;
}

const RelatorioSenhas: React.FC = () => {
  const [senhas, setSenhas] = useState<Senha[]>([]);

  useEffect(() => {
    const fetchSenhas = async () => {
      try {
        const response = await axios.get<Senha[]>("/api/relatorioSenhas");
        setSenhas(response.data);
      } catch (error) {
        console.error("Erro ao obter relatório de senhas:", error);
      }
    };

    fetchSenhas();
  }, []);

  return (
    <div>
      <h2>Relatório de Senhas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Senha</th>
            <th>Tipo de Senha</th>
            <th>Atendida</th>
            <th>Data de Emissão</th>
          </tr>
        </thead>
        <tbody>
          {senhas.map((senha) => (
            <tr key={senha.id}>
              <td>{senha.id}</td>
              <td>{senha.numero_senha}</td>
              <td>{senha.tipo_senha}</td>
              <td>{senha.atendida ? "Sim" : "Não"}</td>
              <td>{senha.data_emissao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioSenhas;
