const { ObjectId } = require("mongodb");

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('bookList').find({user: req.user}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            books: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// Reading list routes ===============================================================

    app.post('/books', (req, res) => {
      db.collection('bookList').insertOne(
        {
          user: req.user,
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          link: req.body.link,
          status: req.body.status,
        
        }, 

        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

  app.put('/books/:bookId', (req, res) => {
    //  console.log("Request body:", req.body);
      db.collection('bookList')
      .findOneAndUpdate(
        {_id: new ObjectId(req.params.bookId)}, // Match book by its ID
        {
        $set: {
          status: req.body.status
          }
        }, 

      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })

    })
  
  
    app.delete('/books', (req, res) => {
      console.log('Request Body:', req.body)
      db.collection("bookList").findOneAndDelete(
        {
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          link: req.body.link
        },

        (err, result) => {
          if (err) return res.send(500, err);
          res.send("Book deleted!");
        }
      );
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
