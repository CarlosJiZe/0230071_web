// Creamos el hello world
console.log("Hello world");

import { error } from 'console';
// Star wars quotes
import sw from 'star-wars-quotes';
console.log("Star Wars Quote: ",sw());

// Epic battle
import {randomSuperhero} from 'superheroes'
import {randomSupervillain} from 'supervillains';

//const hero = superheroes.randomSuperheroe();
const heroe =randomSuperhero();
const villain = randomSupervillain();


console.log("An epic battle between "+heroe+" and "+villain);

//Reading the file input.txt

const filePath = './data/input.txt';

import fileinput from 'fs';
fileinput.readFile(filePath,"utf-8",
    (err,data)=>{
        console.log(data);
    });



