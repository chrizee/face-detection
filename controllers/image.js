const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '23653e7bb8dc480ab59e307e79853f1c'
});

const handleImage = (database) => (req, res) => {
    const {id, input} = req.body;
    console.log(id);
    app.models.predict(Clarifai.FACE_DETECT_MODEL,input)
    .then(response => {
    	database('users').where('id', id)
	    .increment('entries', 1)
	    .returning('entries')
	    .then(entries => {
	        res.json({success : true, entries, clarifaiResponse: response});
	    })
	    .catch(err => res.status(400).json("not found"))
    })
    .catch(err => log(err))
}

module.exports = {
	handleImage
}