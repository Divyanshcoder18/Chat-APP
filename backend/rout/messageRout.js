/*import express from 'express'
import{sendMessage} from "../routControlers/messageroutControler.js"
import isLogin from '../middleware/isLogin.js';

const router = express.Router();

router.post('/send/:id',isLogin , sendMessage) // ye id jo hogi reciever id 
//The receiver ID is passed in the route (/send/:id) so you know who the message is going to.
// data base pe bhej dia ahi hmne 
// ab mess recieve krna hai  ab frontened me msg get krna hai 
router.get('/:id',isLogin,getMessages)  ; 

export default router 
*/
import express from "express"
import { getMessages, sendMessage } from "../routControlers/messageroutControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post('/send/:id',isLogin , sendMessage)

router.get('/:id',isLogin , getMessages);

export default router

