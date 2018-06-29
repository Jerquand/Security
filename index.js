// module imports
const https = require('https');
const fs = require('fs');
const express = require('express');
const sequelize = require('sequelize');
const sqlite3 = require('sqlite3');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();


// use json format for req body
app.use(bodyParser.json())

// connect to db
const db = new sqlite3.Database('./Chinook_Sqlite_AutoIncrementPKs.sqlite');

sequelize = new Sequelize('Music', 'jerquan', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Chinook_Sqlite_AutoIncrementPKs.sqlite'
  });

  const User = sequelize.define(
    "User",
    {
      userId: {
        type: Sequelize.STRING,
        autoIncrement: true,
        primaryKey: true
      },
      authId: Sequelize.STRING,
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      role: Sequelize.STRING
    },
    {
      freezeTableName: true
    }
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findAll(
      {
        where: {
          userId: id
        }
      },
      (err, user) => {
        if (err || !user) return done(err, null);
        done(null, user);
      }
    );
  });
  
  // API
const options = {
  key: fs.readFileSync(__dirname + 'path_to_private_key'),
  cert: fs.readFileSync(__dirname + 'path_to_cert')
};

https.createServer(options, app).listen(app.get('port'), () => {
  console.log('Express started on port ' + app.get('port') + '.');
});

function express (app, option) {
  if (!options.successRedirect) options.successRedirect = "/account";
  if (!options.failureRedirect) options.failureRedirect = "/login";

  return {
    init: function() {
      var env = app.get("env");
      var config = options.providers;

      //configure Facebook strategy
      passport.use(
        new FacebookStrategy(
          {
            clientId: '1698333690263156',
            clientSecret: '29c6e83dcb6bf29415ba68a4b2bd8a9c',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
          },
          function(accessToken, refreshToken, profile, done) {
            const authId = "facebook:" + profile.id;
            User.findOne({ where: { authId: authId } }, function(err, user) {
              if (err) return done(err, null);
              if (user) return done(null, user);
              User.create({
                authId: authId,
                name: profile.displayName,
                role: "user"
              });
            });
          }
        )
      );

      app.use(passport.initialize());
      app.use(passport.session());
    },
    registerRoutes: function() {
      // register Facebook routes
      app.get("/auth/facebook", function(req, res, next) {
        passport.authenticate("facebook", {
          callbackURL:
            "auth/facebook/callback?redirect=" +
            encodeURIComponent(req.query.redirect)
        })(req, res, next);
      });

      app.get(
        "/auth/facebook/callback",
        passport.authenticate(
          "facebook",
          { failureRedirect: options.failureRedirect },
          function(req, res) {
            // we only get here on successful authentication
            res.redirect(303, req.query.redirect || options.successRedirect);
          }
        )
      );
    }
  };
};
window.fbAsyncInit = function() {
  FB.init({
    appId      : '{your-app-id}',
    cookie     : true,
    xfbml      : true,
    version    : '{api-version}'
  });
    
  FB.AppEvents.logPageView();   
    
};
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
app.get('/account', (req, res) => {
  if (!req.session.passport.user) return res.redirect(303, '/unauthorized');
  res.render('account');
});

function adminOnly(req, res) {
  const user = req.session.passport.user;
  if (user && req.role === 'admin') return next();
  res.redirect(303, '/unauthorized');
}
app.get('/admin', adminOnly, (req, res) => {
  res.render('admin');
});
// API endpoint
app.get('auth/facebook', passport.authenticate('facebook'));

app.get('auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: 'login'}));

app.listen(3000,() => {
  console.log('Running')
});
router.get('/', (req, res) => {
  res.send()

})
db.close();

module.exports = router;
module.exports = Artist;