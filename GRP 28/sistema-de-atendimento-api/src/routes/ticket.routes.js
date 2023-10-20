import express from "express";
import TicketController from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/open", TicketController.openTickets);
router.get("/in-service", TicketController.inServiceTickets);
router.get("/close", TicketController.closeTickets);
router.post("/create", TicketController.createTicket);
router.patch("/in-service/start", TicketController.startInServiceTicket);
router.patch("/in-service/close", TicketController.closeInServiceTicket);

export default router;
