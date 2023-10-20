import { prisma } from "../server.js";
import Function from "../utils/functions.js";

async function openTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        inService: false,
        closedAt: null,
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao exibir as senhas abertas." });
  }
}

async function inServiceTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        inService: true,
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao exibir as senhas em andamento." });
  }
}

async function closeTickets(req, res) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        closedAt: {
          not: null,
        },
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao exibir as senhas fechadas." });
  }
}

async function createTicket(req, res) {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Tipo de senha não informado." });
    }

    const ticketTypes = {
      SP: true,
      SG: true,
      SE: true,
    };

    if (!ticketTypes[type]) {
      return res.status(400).json({ error: "Tipo de senha inválido." });
    }

    const ticket = await prisma.ticket.create({
      data: {
        type,
        number: await Function.generateTicketNumber(type),
        inService: false,
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao emitir a senha." });
  }
}

async function startInServiceTicket(req, res) {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ error: "Número de senha não informado." });
    }

    const ticket = await prisma.ticket.update({
      where: {
        number,
      },
      data: {
        inService: true,
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao emitir a senha." });
  }
}

async function closeInServiceTicket(req, res) {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ error: "Número de senha não informado." });
    }

    const ticket = await prisma.ticket.update({
      where: {
        number,
      },
      data: {
        inService: false,
        closedAt: new Date(),
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao emitir a senha." });
  }
}

export default {
  openTickets,
  inServiceTickets,
  closeTickets,
  createTicket,
  startInServiceTicket,
  closeInServiceTicket,
};
