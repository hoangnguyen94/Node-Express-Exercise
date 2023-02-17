const express = require('express');
let axios = require('axios');
var app = express();
const ExpressError = require( "./expressError" )

app.use( express.json() );

app.post('/', function(req, res, next) {
  if (!req.body.developers) throw new ExpressError('A GitHub username is required.', 400);
  const devInfo = req.body.developers.map(async (dev) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${dev}`);
      if (res.status !== 404) {
        return {
          bio: res.data.bio,
          name: res.data.name,
        };
      }
    } catch {
      return { message: "There is no such user!" };
    }
  });
  Promise.all(devInfo).then((data) => {
    return res.status(200).json(data);
  })
});

/** 404 handler */

app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

app.listen( 3000, () =>
{
    console.log( "Server starting on port 3000" )
} );

module.exports = app


