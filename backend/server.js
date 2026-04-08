const express = require('express');
const cors=require('cors')
require('dotenv').config();
const connectDB=require('./src/config/db')
const canvaRouter=require('./src/routes/canvaRoute')
const PORT = process.env.PORT;
const app = express()

app.use(cors())
app.use(express.json({limit:'20mb'}))

// Test the route
app.get('/',(req,res)=>{
    res.send('App working correctly')
})
app.use('/api',canvaRouter)
connectDB()
app.listen(PORT,()=>{
    console.log(`app listen on port number ${PORT}`)
})