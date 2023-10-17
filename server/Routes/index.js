import { Router } from "express";
import { createToken, tillStk } from '../Controllers/controller.js';

const router = Router();

router.post('/Till', createToken, tillStk);

export default router;
