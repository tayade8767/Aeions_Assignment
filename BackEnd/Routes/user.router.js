
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

import { 
    registerUser,
    loginUser,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenses,
    validateToken,
 } from '../Controller/user.controller.js';

 router.route('/login').post(loginUser);
 console.log("i am in userrouter.js file");
 router.route('/register').post(registerUser);

 router.route('/addexpense').post(verifyJWT, createExpense);
router.route('/getexpenses').get(verifyJWT, getExpenses);
router.route('/expenses/:id').put(verifyJWT, updateExpense);
router.route('/expenses/:id').delete(verifyJWT, deleteExpense);

 router.route('/validate-token', verifyJWT).get(validateToken);


export default router;