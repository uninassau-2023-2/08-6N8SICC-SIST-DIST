import { prisma } from "../server.js";

async function generateTicketNumber(type) {
  const totalTicketsWithType = await prisma.ticket.count({
    where: {
      type,
    },
  });

  if (totalTicketsWithType < 10) {
    return type + "0" + String(totalTicketsWithType + 1);
  } else {
    return type + String(totalTicketsWithType + 1);
  }
}

async function deleteData() {
  try {
    await prisma.ticket.deleteMany();
    console.log("Dados apagados com sucesso!");
  } catch (error) {
    console.error("Erro ao apagar dados:", error);
  }
}

export default {
  generateTicketNumber,
  deleteData,
};
