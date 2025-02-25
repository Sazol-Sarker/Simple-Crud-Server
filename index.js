const express=require('express')
const cors=require('cors')
const app=express()
const port=process.env.PORT||5000

// MIDDLEWARE
app.use(cors())




// Requests
app.get('/',(req,res)=>{
    res.send('Welcome to server hooomepage')
})

app.listen(port,()=>{
    console.log('Listening at port=<> ',port);
})
