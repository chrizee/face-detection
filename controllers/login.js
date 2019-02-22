const handleLogin = (req,res, database, bcrypt) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({success: false, message: "There's a problem with the form submitted"});
    }
    database.select('*').from("users")
    .where('email', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].password);
        if(isValid) {
            delete data[0].password;
            res.json({success: true, user: data[0]});
        } else{
            res.status(400).json({success: false});
        }
    })
    .catch(err => res.status(400).json({success: false}))
}

module.exports = {
    handleLogin
}