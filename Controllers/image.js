import clarifai from 'clarifai';
const app = new Clarifai.App({
    apiKey: 'd4181550d4e742cb822545fe949818f3'
  });

export const handleImageApiCall = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data =>  {
        res.json(data)
    })
    .catch(err => { res.status(400).json('Clariai API failure.')})
}

export const handleImage = (req,res, db) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }).catch(err => {
        res.status(400).json('Unable to got entries.')
    })
}

export const image = {
    handleImage: handleImage,
    handleImageApiCall: handleImageApiCall
}