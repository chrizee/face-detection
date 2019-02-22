
const handleRegister = (req,res, database, bcrypt) => {
    const {email, name, password} = req.body;
    if(!email || !name || !password) {
        return res.status(400).json({success: false, message: "There's a problem with the form submitted"});
    }
    database('users')
    .returning("*") //for postgress, doesn't work with mysql
    .insert({
        email,name,password: bcrypt.hashSync(password)
    })
    .then(response => {
        //since knex isn't returning the user, fetch him again after registration
        database.select('*').from("users")
        .where('email', email)
        .then(data => {
            delete data[0].password;    //remove password before returning user
            res.json({success: true, user: data[0]});
        })
        .catch(err => res.status(400).json({success: false}))        
    })
    .catch(err => res.status(400).json({success: false, message: "Failed to register"}))
}

module.exports = {
    handleRegister
}