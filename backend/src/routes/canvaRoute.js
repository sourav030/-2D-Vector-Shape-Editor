const express=require('express');
const {createCanva,getCanva,getCanvaId,getLatest} =require('../controller/canvaController')
const canvaRouter=express.Router();

canvaRouter.post('/create',createCanva)
canvaRouter.get('/all',getCanva)
canvaRouter.get('/latest',getLatest);
canvaRouter.get('/canva/:id',getCanvaId);

module.exports=canvaRouter;