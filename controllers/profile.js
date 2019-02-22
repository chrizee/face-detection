const handleProfile = (req,res, database) => {
    const {id} = req.params;
    database.select("*").from('users').where('id', id)
    .then(user => {
        if(user.length > 0) {
            res.json(user[0]);
        }else {
            res.status(400).json("Not found");
        }
    })
    .catch(err => res.status(400).json('error getting  user'))
}

module.exports = {
	handleProfile
}