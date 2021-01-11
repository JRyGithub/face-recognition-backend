export const signin = (db,bcrypt) => (req,res,) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('Form invalid.')
    }
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
}