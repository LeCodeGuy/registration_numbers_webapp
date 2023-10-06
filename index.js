// Import ExpressJS framework
import express from 'express';

// Import middleware
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';

// Import modules
import registrationNumberService from './services/registration_numbers_services.js';
import db from './routes/database_connection.js'
import registrationNumberRoutes from './routes/registration_numbers_routes.js'

// Setup a simple ExpressJS server
const app = express();

// Initialise session middleware - flash-express depends on it
app.use(session({
    secret : '<add a secret string here>',
    resave: false,
    saveUninitialized: true
  }));

// Initialise flash middleware
app.use(flash());

// Make public folder available to the app
app.use(express.static('public'));

// handlebar engine settings
const handlebarSetup = exphbs.engine({
    partialsDir: './views/partials',
    viewPath: './views',
    layoutsDir: './views/layouts'
})
// setup handlebars
app.engine('handlebars', handlebarSetup);
// set handlebars as the view engine
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());

// Instantiate the app
let regNumInstance = registrationNumberService(db);
let regNumApp = registrationNumberRoutes(regNumInstance);

// Routes
app.get('/', regNumApp.pageLoad);
app.post('/add_registration',regNumApp.add); // Add button clicked
app.get('/reset', regNumApp.reset); // Reset button clicked
app.post('/reg_numbers/',regNumApp.showMany); // Show button clicked
app.get('/reg_numbers/:regSelected', regNumApp.showOne); // Registration number clicked

// app.post('/reg_numbers', async (req, res) => { // Show button clicked
//     // console.log("reg_numbers route");
//     //console.log(req.body.towns);
//     //console.log(req.body);
//     await regNumApp.setTownSelected(req.body.towns)
    
//     await regNumApp.allRegNums();
//     res.redirect('/');
//     // const greetedUsers = await greetingApp.greetedUsers();
//     // res.render('GreetedUsers', { greetedUsersData: greetedUsers });
// });

// Count for specific user route - when a username is clicked on the greeted users page
// app.get('/reg_numbers/:regNum', async (req, res) => { // registration number selected
//     // const userData = await greetingApp.userCounter(req.params.username);
//     // res.render('UserCount', {userData: userData});
// });



// Set PORT variable
let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});