const express = require('express');

//instance of express
const app= express();

app.use("/test",(req,res)=>{
    res.send('Hello from the srever');
});

app.use("/hello",(req,res)=>{
    res.send('Hello from route');
});



app.listen(7777,()=>{
    console.log('Server is running on port 3000');
});