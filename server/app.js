const express = require("express");
var bodyParser = require("body-parser");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const app = express();
const db = require("./config/db.connectiom");
const axios = require("axios");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 3000;

const defaultScope = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/plus.login",
  "email",
  "profile",
];

// accessToken variable
var tokenData = {};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

var auth = new google.auth.OAuth2(
  "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/auth/google/callback"
);

const calendar = google.calendar({ version: "v3", auth });

// generate authentication url
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope,
  });
}

app.get("/authorization/:email", async (req, res) => {
  let email = req.params.email;
  let sql = `SELECT refresh_token FROM user_auth WHERE email=?`;
  db.query(sql, email, async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: err,
      });
    } else {
      console.log(result[0]);
      if (result[0]) {
        console.log(result[0].refresh_token);
        try {
          let token = await axios.post(
            "https://www.googleapis.com/oauth2/v4/token",
            {
              client_id:
                "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
              client_secret: "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",
              refresh_token: '1//0gHq0bHxNdgcbCgYIARAAGBASNwF-L9Irj_YqrbKhe2DhINbZfiCT9ZOhxXji13yLova1LIquoYt7ndeHaJnjj1pckDg7hauGSLQ',
              grant_type: "refresh_token",
            }
          );
          auth.setCredentials(token.data)
          console.log(token.data.id_token)
          res.status(200).send({
            message: "access token has been set",
            access_token: token.data.access_token
          })
        } catch (err) {
          // console.log(err)
          res.send({message: err})
        }
      } else {
        const url = getConnectionUrl(auth);
        if (url) {
          res.send({
            url,
          });
        }
      }
    }
  });

});

async function getEmailFromIdToken(id_token) {
  let userDetails = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
  );
  let email = userDetails.data.email;
  return email;
}

app.get("/auth/google/callback", async (req, res) => {
  let authCode = req.query.code;
  const { tokens } = await auth.getToken(authCode);
  console.log("code", authCode);
  tokenData = tokens;
  console.log(tokens);
  let email = await getEmailFromIdToken(tokenData.id_token);
  let sql = `INSERT INTO user_auth VALUES(${null},'${email}','${
    tokenData.refresh_token
  }')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("recrod inserted");
    }
  });
  auth.setCredentials(tokens);
  if (Object.keys(tokenData).length > 0) {
    res.redirect(
      `http://localhost:4200/validate-auth?id_token=${tokenData.id_token}&refresh_token=${tokenData.refresh_token}`
    );
  } else {
    res.status(400).send("issue");
  }
});

app.get("/getEvents/:id", async (req, res) => {
  let calendarId = req.params.id;
  // console.log(calendarID);
  console.log;
  calendar.events.list(
    {
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, result) => {
      if (err) return res.status(400).send({ err });
      const events = result.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          res.send({
            events: `${start} - ${event.summary}`,
          });
        });
      } else {
        res.send("No upcoming events found");
      }
    }
  );
});

app.post("/getUsersSchedule", async (req, res) => {
  // auth.setCredentials(mainToken);
  console.log("hetUSERSCHEDULE",tokenData)
  auth.credentials = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
  };
  try {
    console.log(req.body);
    var response = await calendar.freebusy.query({
      auth: auth,
      headers: { "content-type": "application/json" },
      resource: {
        items: [
          {
            id: req.body.id,
          },
        ],
        timeMin: req.body.timeMin,
        timeMax: req.body.timeMax,
      },
    });

    let data = response.data.calendars;

    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "error" });
  }
});

app.post("/createEvent", (req, res) => {
  var event = {
    ...req.body,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: "dsjfkldsjfkldsjflkds",
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary",
      sendUpdates: "all",
      resource: event,
      conferenceDataVersion: 1,
    },
    function (err, result) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return res.send(err);
      }
      console.log("Event created: %s", result);
      return res.send({
        message: "event created",
      });
    }
  );
}),
  app.post("/setupCalendar", (req, res) => {
    let body = req.body;
    console.log(body);
    // let sql = `INSERT INTO demo VALUES(${null},'john wick')`
    let sql = `INSERT INTO user_calendar VALUES(${null},'${body.name}','${
      body.email
    }','${body.startTime}','${body.endTime}','${body.availableDays}','${
      body.duration
    }','${body.eventName}','${body.eventDescription}','${body.location}','${
      body.calendarLink
    } ')`;
    // let value = {body.name,body.email,body.startTime,body.endTime,bod,body.duration,body.eventName,body.eventDescription,body.calendarLink};
    // console.log(value)
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400);
      }
      return res.status(200).send(result);
    });
  });

app.post("/getCalendar/:email", (req, res) => {
  let body = req.body;
  // let sql = `INSERT INTO demo VALUES(${null},'john wick')`
  let email = req.params.email;
  let sql = `SELECT * FROM user_calendar WHERE email = '${email}'`;
  // let value = {body.name,body.email,body.startTime,body.endTime,bod,body.duration,body.eventName,body.eventDescription,body.calendarLink};
  // console.log(value)
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }
    if(result[0]===undefined) {
      return res.status(200).send({
        status: false,
        message: 'No record found with specific email id',
        data: []
      })
    }
    let sql = `SELECT refresh_token FROM user_auth WHERE email = '${result[0].email}'`;
    db.query(sql, async (err ,result2) => {
      if(err){
        console.log(err);
        return res.status(400).send(err);
      }
      try {
        let token = await axios.post(
          "https://www.googleapis.com/oauth2/v4/token",
          {
            client_id:
              "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
            client_secret: "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",
            refresh_token: result2[0].refresh_token,
            grant_type: "refresh_token",
          }
        );
        // console.log("TOOEEEEEEEEEEEEEN", token.data)
        auth.credentials = {
          access_token: token.data.access_token,
          refresh_token: result2[0].refresh_token,
        };
        tokenData = {
          access_token: token.data.access_token,
          refresh_token: result2[0].refresh_token
        }
        return res.status(200).send({data : {...result[0],...result2[0],access_token : token.data.access_token}, status: true}); 
        }catch(err){
          console.log(err);
          return res.status(400).send(err);
        } 
    })
    //return res.status(200).send(result[0]);
  });
});

app.post("/getValidToken", async (req, res) => {
  try {
    let token = await axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      {
        client_id:
          "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token: req.body.refresh_token,
        grant_type: "refresh_token",
      }
    );
    auth.credentials = {
      access_token: token.data.access_token,
      refresh_token: req.body.refresh_token,
    };
    tokenData = {
      access_token: token.data.access_token,
      refresh_token: req.body.refresh_token
    }
    return res.status(200).send("access token set"); 
    }catch(err){
      console.log(err);
      return res.status(400).send(err);
    } 
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
