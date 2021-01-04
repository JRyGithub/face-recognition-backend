import express from 'express';
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user:'loqgar',
        password:'',
        database:'smart-brain'
    }
})



const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    db.select('email' , 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => { res.status(400).json("Unable to sign in.")})
        }else{
            res.status(400).json("Wrong Creds Punk.")
        }
    })
    .catch(err =>{ res.status(400).json("Wrong creds punk.")})
})

app.post('/register', (req,res) => {
    const { email, password, name} = req.body;
    const pWordHash =  bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: pWordHash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
         return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined: new Date()
                })
            .then(user => {
                res.json(user[0]);
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        })
        .catch(err => { 
            res.status(400).json('Unable to register.')})
})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;
    db.select('*').from('users').where({id}).then(user => {
        if(user.length){
        res.json(user[0]);
        } else {
            res.status(400).json('Could not find the user.')
        }
    }).catch(err => {
         res.status(400).json('Something went wrong :(')
    })
})

app.put('/image', (req,res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }).catch(err => {
        res.status(400).json('Unable to got entries.')
    })
})

app.listen(3000, ()=>{
    console.log('App is running on 3000')
        }
    );