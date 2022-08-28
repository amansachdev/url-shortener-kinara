require('dotenv').config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const ShortURL = require('./model/url')
const ExpandUrl = require('./model/expandedUrl')
mongoose = require('mongoose')
const connectDB = require("./config/database");

code = [{
	full: '/'
}]

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/auth", require("./routes/route"));
app.use(express.static(__dirname + '/views/public'));

app.set("view engine", "ejs");
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
	const allData = await ShortURL.find({ user: req.userName }).exec();
	res.render('index', { shortUrls: allData, userName: req.userName, role: req.role })
})

app.post('/short', userAuth, async (req, res) => {
	// Grab the fullUrl parameter from the req.body
	const fullUrl = req.body.fullUrl;
	const userName = req.userName;
	// insert and wait for the record to be inserted using the model
	const record = new ShortURL({
		full: fullUrl,
		user: userName
	})
	await record.save()
	res.redirect('/basic')
})

app.post('/expand', userAuth, async (req, res) => {
	const shorten = req.body.ExpandUrl;
	// const userName = req.body.user;

	const rec = await ShortURL.findOne({
		short: shorten
	})
	if (!rec) {
		res.render('expand', { errormessage: 'your message no url found' });
		console.log("No URl found")
	} else {
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


app.post('/delete', userAuth, async (req, res) => {
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

const server = app.listen(process.env.PORT || process.env.PUBLIC_PORT, () => {
	//Connection to database
	connectDB();
	console.log(`server is running at port no ${process.env.PORT}`);
	process.on("unhandledRejection", (err) => {
		console.log(`An error occurred: ${err.message}`);
		server.close(() => process.exit(1));
	});
})
