const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

//Middleware para el parser
app.use(bodyParser.urlencoded({ extended: false }));

//Servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

// Mostrar el html
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

// Manejamos la solicitud de express
app.post('/calculate-bmi', (req, res) => {
    const { weight, height } = req.body;
    if (!weight || !height) {
      return res.send('Please provide both weight and height');
    }

    if(weight<=0 || height <=0){
        return res.send("Please provide a valid weight or height");
    }
  
    const bmi = (weight / (height * height)) * 10000;
  
    res.send(`Your BMI is ${bmi.toFixed(2)}`);
  });