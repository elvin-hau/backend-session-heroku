const express = require('express');
const cors = require('cors');
const session = require("express-session");

const app = express();

// require('./express-startup/routes')(app);
var whitelist = ['http://localhost:3300', undefined  /** other domains if any */ ];

var corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      console.log("PASS 2 !");
      callback(null, true)
    } else {
      console.log("NOT PASS 2 !");
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

//XXX NOT WORKING SESSION IN HEROKU
app.use(session({
  // name : 'app.sid',
  secret: "my_secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, //false: count will increment ONLY.
}));

///////////////////////////////////////////////
//////////    TEST CALL         ///////////////
///////////////////////////////////////////////
app.get('/', (req, res) => {
  if (req.session) {
    let visit = req.session.visit;
    if(!visit) {
      visit = req.session.visit = {
        count: 1
      }
    } else {
      visit.count++;
    }
    console.log('Visited count: ' + visit.count);
  }

  res.status(200)
     .send('[Session Id: ' + req.session.id + '] Visited count: ' + req.session.visit.count ).end();
});


 

// Start the server
const PORT = process.env.PORT || 3300;
// app.listen(PORT, () => {  //XXX will not start in heroku server !
//   console.log(`App listening on port ${PORT}`);
// });

app.listen(process.env.PORT || 3300, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

