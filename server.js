const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const mongoose = require('mongoose')
const PORT = 5000;
const ShortURL = require('./models/url')
const ExpandUrl = require('./models/expandedUrl')
app.set("view engine", "ejs");
code = [{
	full: '/'
}]	
newtext = 'text';
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/auth", require("./Auth/route"));
app.use(express.static(__dirname + '/views/public'));

app.get("/home", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
	res.cookie("jwt", "", { maxAge: "1" });
	res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));

app.get('/basic', userAuth, async (req, res) => {
	const allData = await ShortURL.find({user: req.userName}).exec();
	res.render('index', { shortUrls: allData, userName: req.userName, role: req.role })
})

app.post('/short', async (req, res) => {
	// Grab the fullUrl parameter from the req.body
	const fullUrl = req.body.fullUrl;
	const userName = req.body.user;
	// insert and wait for the record to be inserted using the model
	const record = new ShortURL({
		full: fullUrl,
		user: userName
	})
	
	await record.save()

	res.redirect('/basic')
})

app.post('/expand', async (req, res) => {
	const shorten = req.body.ExpandUrl;
	// const userName = req.body.user;
	
	const rec = await ShortURL.findOne({
		short: shorten
	})
	console.log(rec)
	if (!rec) {
		res.render('expand', { errormessage: 'your message no url found' });
		console.log("No URl found")
	}else{
	const expandUrl = new ExpandUrl(
		{
			full: rec.full
		}
	)
	await expandUrl.save();
	demo = await ExpandUrl.findOne(
		{
			full: rec.full
		}
	);
	if (!demo) return res.sendStatus(404)
	code.push(demo)
	res.redirect('/basic')
	}
})


app.post('/delete', async (req, res) => {
	const shorten = req.body.deletedata

	const rec = await ShortURL.deleteOne({
		short: shorten
	})
	res.redirect('/basic')
})

app.get('/:shortid', async (req, res) => {
	// grab the :shortid param
	const shortid = req.params.shortid

	// perform the mongoose call to find the long URL
	const rec = await ShortURL.findOne({ short: shortid })

	// if null, set status to 404 (res.sendStatus(404))
	if (!rec) return res.sendStatus(404)

	// if not null, increment the click count in database
	rec.clicks++
	await rec.save()

	// redirect the user to original link
	res.redirect(rec.full)
})

// Setup your mongodb connection here
mongoose.connect('mongodb+srv://chat:7T0suyy3YPwjKBbV@cluster0.gqpayy9.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async () => {
	const server = app.listen(process.env.PORT || process.env.PUBLIC_PORT || PORT || 5005, () => {
		console.log('Server started')
		process.on("unhandledRejection", (err) => {
			console.log(`An error occurred: ${err.message}`);
			server.close(() => process.exit(1));
		});
	})
})

