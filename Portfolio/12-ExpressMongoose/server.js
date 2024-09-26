const express = require("express");
const app = express();
const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const csvParser = require("csv-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Definition of a schema
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  number: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];

//Cargamos la data
app.use(async (req, res, next) => {
  try {
    let teams = await Team.find({});
    const drivers = await Driver.find({});
    teams = teams.filter((team, index, self) => //Eliminamos dublicados
      team.name !== "N/A" && 
      index === self.findIndex(t => t.name === team.name)
    );
    req.teams = teams;
    req.drivers = drivers;
    next(); // Esto es crucial para que la solicitud continúe
  } catch (err) {
    console.error("Error loading teams or drivers:", err);
    next(err); // Llama a next() incluso en caso de error para manejar errores adecuadamente
  }
});

//Funcion auxiliar para cargar los datos
const loadCSVData = () => {
  const results = [];
  fs.createReadStream(path.join(__dirname, "public/data/f1_2023.csv"))
  .pipe(csv({ separator: ',' }))
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const driver of results) {
        console.log(driver);
        console.log(typeof driver['number']);
        console.log(parseInt(driver['number']));
        

        dob = moment(driver.dob, "DD/MM/YYYY").toISOString();
        try {
          let team = await Team.findOne({ name: driver.current_team});
          if (!team) {
            team = new Team({
              name: driver.current_team,
              nationality: driver.nationality,
              url: driver.url,
            });
            await team.save();
          }

          
          await Driver.findOneAndUpdate(
            { number: parseInt(driver['number']) }, 
            {
              code: driver.code,
              forename: driver.forename,
              surname: driver.surname,
              dob: dob,
              nationality: driver.nationality,
              url: driver.url,
              team: team, // Relación con el equipo
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error("Error inserting/updating driver: ", err);
        }
      }
      console.log("CSV data successfully loaded into the database.");
    });
};


(async () => {
  try {
    const count = await Driver.countDocuments();
    if (count === 0) {
      loadCSVData(); 
    }
  } catch (err) {
    console.error("Error counting documents:", err);
  }
})();

app.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find({});
    const teams = await Team.find({});

    let driver = null;

    if (req.query.edit) {
      driver = await Driver.findOne({ number: req.query.edit });
    }

    res.render("index", {
      drivers,
      teams,
      countries,
      driver,
      moment,
    });
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).send("Error fetching drivers");
  }
});

app.post("/driver/update", async (req, res) => {
  try {
    const { original_num, num, code, name, lname, dob, nationality, team, url } = req.body;

    
    await Driver.findOneAndUpdate(
      { number: original_num },  
      {
        number: num,  
        code: code,
        forename: name,
        surname: lname,
        dob: new Date(dob),
        nationality: nationality,
        url: url,
        'team.name': team 
      }
    );

    res.redirect("/");  
  } catch (err) {
    console.error("Error updating driver:", err);
    res.status(500).send("Error updating driver");
  }
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
