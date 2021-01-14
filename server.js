import express from 'express';
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors';
import knex from 'knex';

import {handleRegister} from './Controllers/register.js';
import {signin} from './Controllers/signin.js';
import { image } from './Controllers/image.js';
import { profile } from './Controllers/profile.js';

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send('It \'s working!');
})

app.post('/signin', signin(db,bcrypt));

app.post('/register', (req,res) => {handleRegister(req,res,db,bcrypt)});

app.get('/profile/:id', (req,res) => {profile(req,res,db)});

app.put('/image', (req,res) => {image.handleImage(req,res,db)});
app.post('/imageurl', (req,res) => {image.handleImageApiCall(req,res)});

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`App is running on ${process.env.PORT}`)
        }
    );