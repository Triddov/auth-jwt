import { Router } from "express";
import { body } from "express-validator";

import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";


const router = new Router();

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({ min: 5, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

export default router;
