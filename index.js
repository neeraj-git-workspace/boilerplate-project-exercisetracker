const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const mongoose = require('mongoose')





app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(process.env.DB_URL)

const exerciseSchema = new mongoose.Schema({
	userId: String,
	username: String,
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: String,
});

const userSchema = new mongoose.Schema({
	username: String,
});

let User = mongoose.model('User', userSchema);

let Exercise = mongoose.model('Exercise', exerciseSchema);

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
  await User.syncIndexes();
  await Exercise.syncIndexes();
});

app.post('/api/users', function (req, res) {
	const inputUsername = req.body.username;

	console.log('### create a new user ###'.toLocaleUpperCase());

	//? Create a new user
	let newUser = new User({ username: inputUsername });

	console.log(
		'creating a new user with username - '.toLocaleUpperCase() + inputUsername
	);

	newUser.save().then(function(user){
    res.json({ username: user.username, _id: user._id });
  }).catch(function(err){
    console.log(err)
			res.json({ message: 'User creation failed!' });

  });
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
