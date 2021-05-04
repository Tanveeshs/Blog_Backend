const dotenv        = require('dotenv');
/*ENV CONFIG */
dotenv.config();
/*ENV CONFIG */


const express       = require('express');
const moment        = require('moment');
const cookieParser  = require('cookie-parser');
const mongoose      = require('mongoose');
const configDB      = require('./config/database')(process.env.dbuser,process.env.dbpass);
const passport      = require('passport');
const logger        = require('morgan');
const flash         = require('connect-flash');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const cookieSession = require('cookie-session');
const compression   = require('compression');

const app           = express();
const PORT = process.env.PORT || 8080;

/*DATABASE CONFIG*/
mongoose.connect(
	configDB.url,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	},
	function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('MongoDB Connected');
		}
	}
);
mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
/*DATABASE CONFIG*/


/*LOGGER CONFIG*/
app.use(logger(function (tokens, req, res) {
	return [
		moment().format('LLL'),
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms'
	].join(' ')
}));
/*LOGGER CONFIG*/


/*EXPRESS APP JSON CONFIG*/
app.use(flash());
app.use(compression());
app.use(bodyParser.json({limit:"500mb"}));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 }));
/*EXPRESS APP JSON CONFIG*/


/*COOKIES CONFIG*/
app.use(cookieParser());
app.use(
	cookieSession({
		name: 'session',
		keys: ['key1'],
		maxAge: 24 * 60 * 60 * 1000,
	})
);
/*COOKIES CONFIG*/

/*CORS CONFIG */
app.use(
	cors({
		origin: '*',
	})
);
/*CORS CONFIG */

/*PASSPORT CONFIG */
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
/*PASSPORT CONFIG */


/*ROUTES*/
require('./views/index')(app,passport);
/*ROUTES*/


app.listen(PORT,function (){
	console.log("Server listening on port",process.env.PORT);
})