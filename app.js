const express = require("express");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const app = express();
const port = 3000;

const defaultScope = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "profile",
  "email",
  "https://www.googleapis.com/auth/calendar.readonly",
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
  console.log(token)
  auth.setCredentials(tokens);
  if (Object.keys(token).length > 0) {
    res.send("access token is set");
  } else {
    res.status(400).send("issue");
  }
});

app.get("/getEvents", async (req, res) => {
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
});

app.get("/freebusy", async (req, res) => {
  var calendarId = ["ayush.ashu01@gmail.com"];
  var check = {
    items: [{ id: calendarId, busy: "Active" }],
    timeMax: "2022-01-28T21:00:31-00:00",
    timeMin: "2022-01-30T17:00:31-00:00",
  };
  auth.credentials = {
    access_token: token.access_token,
    refresh_token: token.refresh_token
  }
  var response = calendar.freebusy.query({
    auth:auth,
    check,
  });
  res.send(response);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
