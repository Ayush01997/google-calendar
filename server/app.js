const express = require("express");
var bodyParser = require('body-parser')
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const port = 3000;

const defaultScope = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/plus.login",
];

// accessToken variable
var token = {};

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

app.get("/authorization", async (req, res) => {
  const url = getConnectionUrl(auth);
  if (url) {
    res.send({
      message: `redirect to this url ${url}`,
    });
  }
});

app.get("/auth/google/callback", async (req, res) => {
  console.log(req.query.code);
  let authCode = req.query.code;
  const { tokens } = await auth.getToken(authCode);
  token = tokens;
  console.log(tokens)
  auth.setCredentials(tokens);
  if (Object.keys(token).length > 0) {
    res.send("access token is set");
  } else {
    res.status(400).send("issue");
  }
});

app.get("/getEvents/:id", async (req, res) => {

  let calendarId= req.params.id;
  // console.log(calendarID);
  console.log
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
            events: `${start} - ${event.summary}`
          })
        });
      } else {
        res.send("No upcoming events found");
      }
    }
  );
});

app.post("/getUsersSchedule", async (req, res) => {
  auth.credentials = {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };
  try {
    console.log(req.body)
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
    })

    let data = response.data.calendars

    res.send(data)

  }catch (e) {
    console.log(e)
    res.status(400).send({message:"error"})
  }
  
});

app.post("/createEvent", (req, res) => {  
  var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2022-02-09T09:00:00-07:00',
      'timeZone': 'Asia/Kolkata',
    },
    'end': {
      'dateTime': '2022-02-09T17:00:00-07:00',
      'timeZone': 'Asia/Kolkata',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': `${req.body.email}`}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
    "conferenceData": {
      "createRequest": {
        "requestId": "dsjfkldsjfkldsjflkds",
        "conferenceSolutionKey": {
          "type": "hangoutsMeet"
        },
      }
    },
    "summary": "demo event",
    "description": "ok"
  };
  
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
    sendNotifications: true,
    conferenceDataVersion: 1
  }, function(err, result) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return res.send(err);
    }
    console.log('Event created: %s', result);
    return res.send("Event Created");
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
