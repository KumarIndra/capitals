import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const db = new pg.Client({
    host: "localhost",
    port: "5432",
    username: "postgres",
    password: "postgre2022",
    database: "udemy"
});

db.connect();

let currentScore = 0;
let capsList = [
    {country: "India", capital: "New Delhi"},
    {country: "Italy", capital: "Rome"},
    {country: "South Korea", capital: "Seoul"}
];

db.query("Select * FROM capitals", (err,res)=>{
    if(err){
        throw err;
    } else {
        capsList = res.rows;
    }
    db.end();
});

var currentQuestion = {};

app.get("/", (req,res)=>{
    res.render("index.ejs", {country: currentQuestionMapper(), score: currentScore});
});

app.post("/capital", (req,res)=>{
    const responseName = req.body.capitalName;
    if(currentQuestion.capital.toLowerCase() === responseName.toLowerCase()){
        currentScore++;
        res.render("index.ejs", {country: currentQuestionMapper(), score: currentScore, isCorrect: true});
    } else {
        res.render("index.ejs", {country: currentQuestionMapper(), score: 0, isCorrect: false});
    }
});

function currentQuestionMapper() {
    let value = Math.floor(Math.random() * capsList.length);
    currentQuestion = capsList[value];
    console.log(currentQuestion);
    return capsList[value].country;
}

app.listen(port, ()=>{
    console.log(`Server started at the port: ${port}`);
});
