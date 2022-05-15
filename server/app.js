const express = require("express");
var bodyParser = require("body-parser");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const app = express();
const db = require("./config/db.connectiom");
const axios = require("axios");
const msal = require('@azure/msal-node');
const graph = require('./graph');

const msalConfig = {
  auth: {
    clientId: 'c84d0ac9-2445-48bb-8080-fb6503386ce2',
    authority: 'https://login.microsoftonline.com/common/',
    clientSecret: 'cSA8Q~P~LxK9hnNwEDbiMnBi.owHFWvpufsJXc1x'
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    }
  }
}

app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const Zoomauth = require("./auth/auth");

// parse application/json
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
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
var teamTokenData = {}

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
              refresh_token:
                "1//0gHq0bHxNdgcbCgYIARAAGBASNwF-L9Irj_YqrbKhe2DhINbZfiCT9ZOhxXji13yLova1LIquoYt7ndeHaJnjj1pckDg7hauGSLQ",
              grant_type: "refresh_token",
            }
          );
          auth.setCredentials(token.data);
          console.log(token.data.id_token);
          res.status(200).send({
            message: "access token has been set",
            access_token: token.data.access_token,
          });
        } catch (err) {
          // console.log(err)
          res.send({ message: err });
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

app.post("/createZoomMeeting", Zoomauth.addToken, async (req, res) => {
  try {
    const token = req.body.token;
    const email = "testingkeliyehaibro@gmail.com"; //host email id;
    const result = await axios.post(
      "https://api.zoom.us/v2/users/" + email + "/meetings",
      {
        topic: "Discussion about today's Demo",
        type: 2,
        start_time: "2022-03-22T17:00:00",
        duration: 20,
        timezone: "India",
        password: "1234567",
        agenda: "We will discuss about Today's Demo process",
        settings: {
          host_video: true,
          participant_video: true,
          cn_meeting: false,
          in_meeting: true,
          join_before_host: false,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 2,
          audio: "both",
          auto_recording: "local",
          enforce_login: false,
          registrants_email_notification: false,
          waiting_room: true,
          allow_multiple_devices: true,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
        },
      }
    );
    console.log(result.data);
    // sendResponse.setSuccess(200, 'Success', result.data);
    // return sendResponse.send(res);
  } catch (err) {
    console.log(err);
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
  console.log("hetUSERSCHEDULE", tokenData);
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

app.get("/getCalendar/:email", (req, res) => {
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
    if (result.length == 0) {
      return res.status(200).send({
        status: false,
        message: "No record found with specific email id",
        data: [],
      });
    }
    let sql = `SELECT refresh_token FROM user_auth WHERE email = '${result[0].email}'`;
    db.query(sql, async (err, result2) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      try {
        console.log("RESULT", result2);
        // let token = await axios.post(
        //   "https://www.googleapis.com/oauth2/v4/token",
        //   {
        //     client_id:
        //       "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
        //     client_secret: "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",
        //     refresh_token: result2[0].refresh_token,
        //     grant_type: "refresh_token",
        //   }
        // );
        // // console.log("TOOEEEEEEEEEEEEEN", token.data)
        // auth.credentials = {
        //   access_token: token.data.access_token,
        //   refresh_token: result2[0].refresh_token,
        // };
        // tokenData = {
        //   access_token: token.data.access_token,
        //   refresh_token: result2[0].refresh_token,
        // };
        // return res.status(200).send({
        //   data: result,
        //   refresh_token: tokenData.refresh_token,
        //   access_token: tokenData.access_token,
        //   status: true,
        // });
         return res.status(200).send({
            data: result,
            status: true
          });
      } catch (err) {
        console.log(err);
        return res.status(400).send(err);
      }
    });
    //return res.status(200).send(result[0]);
  });
});

app.post("/getValidToken", async (req, res) => {
  try {
    let token = await axios.post("https://www.googleapis.com/oauth2/v4/token", {
      client_id:
        "567130593726-cgsmtpsmh4jbi6dvhhvdp1rfv1u99vrj.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: req.body.refresh_token,
      grant_type: "refresh_token",
    });
    auth.credentials = {
      access_token: token.data.access_token,
      refresh_token: req.body.refresh_token,
    };
    tokenData = {
      access_token: token.data.access_token,
      refresh_token: req.body.refresh_token,
    };
    return res.status(200).send("access token set");
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

app.post("/editCalendar", async (req, res) => {
  try {
    let sql = `UPDATE user_calendar SET ? WHERE id=${req.body.id}`;
    db.query(sql, [req.body], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: err,
          status: false,
        });
      }
      return res.status(200).send({
        message: "updated successfully",
        status: true,
      });
    });
  } catch (err) {}
});

app.delete("/deleteCalendar/:id", (req, res) => {
  let id = req.params.id;
  let sql = "DELETE FROM `user_calendar` WHERE `id`=?";
  db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: err,
        status: false,
      });
    }
    return res.status(200).send({
      message: "Record deleted successfully",
      status: true,
    });
  });
});

// --------------ZOOM API-----------

app.get("/zoom", (req, res) => {
  let clientId = "G9mzSvDdTsODfLUi8qwbZQ";
  let redired_url = "http://localhost:3000/auth/zoom/callback";
  let url =
    "https://zoom.us/oauth/authorize?response_type=code&client_id=" +
    clientId +
    "&redirect_uri=" +
    redired_url;
  res.send(url);
});

app.get("/auth/zoom/callback", async (req, res) => {
  let redired_url = "http://localhost:3000/auth/zoom/callback";
  try {
    if (req.query.code) {
      console.log("code", req.query.code)
      let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + redired_url;

      let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic RzltelN2RGRUc09EZkxVaThxd2JaUTozSlcwcGNyNmg5M3ZVcFp3cEJmU0YydE5TRDYwdFU1MQ==",
      };
      let result = await axios.post(url, null, {
        headers: headers,
      });
      let token = result.data
      console.log(token)
    }
  } catch (err) {
    console.log(err)
  }
});


app.get('/signin/:email',
  async function (req, res) {
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
          let token = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', new URLSearchParams({
              client_id: 'c84d0ac9-2445-48bb-8080-fb6503386ce2', //gave the values directly for testing
              refresh_token: result[0].refresh_token,
              redirect_uri: 'http://localhost:3000/azure/callback',
              grant_type : 'refresh_token',
              client_secret : 'cSA8Q~P~LxK9hnNwEDbiMnBi.owHFWvpufsJXc1x'
            }))
          console.log("88888888888",token);
          teamTokenData = {
            accessToken : token.data.access_token,
            refreshToken : token.data.refresh_token
          }
          res.status(200).send({
            message: "access token has been set",
            access_token: token.data.access_token,
          });
        } catch (err) {
          // console.log(err)
          res.send({ message: err });
        }
      } else {
        const urlParameters = {
          scopes: 'offline_access,user.read,Calendars.ReadWrite,OnlineMeetings.ReadWrite'.split(','),
          redirectUri: 'http://localhost:3000/azure/callback'
        };
    
        try {
          const authUrl = await req.app.locals
            .msalClient.getAuthCodeUrl(urlParameters);
          //res.redirect(authUrl);
          res.send({
            authUrl
          });
        }
        catch (error) {
          console.log(`Error: ${error}`);
          res.redirect('/');
        }
      }
    }
  });
  }
);

app.get('/azure/callback',
  async function(req, res) {
    const tokenRequest = {
      code: req.query.code,
      scopes: 'offline_access,user.read,Calendars.ReadWrite,OnlineMeetings.ReadWrite'.split(','),
      redirectUri: 'http://localhost:3000/azure/callback'
    };

    try {
      const response = await req.app.locals
        .msalClient.acquireTokenByCode(tokenRequest);
      //console.log("************ reqponse ***************",response)
      // Save the user's homeAccountId in their session
      //req.session.userId = response.account.homeAccountId;
      //console.log("************ req.session.userid ***************", req.session.userId)
      // const user = await graph.getUserDetails(
      //   req.app.locals.msalClient,
      //   req.session.userId
      // );

      // // Add the user to user storage
      // req.app.locals.users[req.session.userId] = {
      //   displayName: user.displayName,
      //   email: user.mail || user.userPrincipalName,
      //   timeZone: user.mailboxSettings.timeZone
      // };
      const accessToken = response.accessToken;
      const refreshToken = () => {
          const tokenCache = app.locals.msalClient.getTokenCache().serialize();
          const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
          const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
          return refreshToken;
      }
      const tokens = {
          accessToken,
          refreshToken:refreshToken()
      }
      teamTokenData = {
        accessToken : tokens.accessToken,
        refreshToken : tokens.refreshToken
      }
      let sql = `INSERT INTO user_auth VALUES(${null},'${response.account.username}','${
        tokens.refreshToken
      }')`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("recrod inserted");
        }
      });
      if (Object.keys(response).length > 0) {
        res.redirect(
          `http://localhost:4200/validate-team-auth?access_token=${response.accessToken}`
        );
      } else {
        res.status(400).send("issue");
      }
    } catch(error) {
      console.log(`Error: ${error}`)
    }
  }
);

app.post('/createTeamEvent', async (req, res) => {
  // const formData = {
  //   subject: req.body.subject,
  //   attendees: req.body.attendees,
  //   start: req.body.start,
  //   end: req.body.end,
  //   body: req.body.body
  // };
  try{
    let headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${teamTokenData.accessToken}`,
      "Prefer" : 'outlook.timezone="Pacific Standard Time"'
    };
    let result = await axios.post('https://graph.microsoft.com/v1.0/me/events', req.body, {
      headers: headers,
    });
    return res.send({
      message: "event created",
    });
  }catch(e){
    console.log(e)
    res.send(e)
  }
  // Check if there are any errors with the form values
  // const formErrors = validationResult(req);
  // if (!formErrors.isEmpty()) {

  //   let invalidFields = '';
  //   formErrors.errors.forEach(error => {
  //     invalidFields += `${error.param.slice(3, error.param.length)},`
  //   });

  //   // Preserve the user's input when re-rendering the form
  //   // Convert the attendees array back to a string
  //   formData.attendees = formData.attendees.join(';');
  //   return res.render('newevent', {
  //     newEvent: formData,
  //     error: [{ message: `Invalid input in the following fields: ${invalidFields}` }]
  //   });
  // }

  // Get the user
  const user = '00000000-0000-0000-e45b-4bd969083b8a.9188040d-6c67-4c5b-b112-36a304b66dad'

  // Create the event
  // try {
  //   await graph.createEvent(
  //     req.app.locals.msalClient,
  //     '00000000-0000-0000-e45b-4bd969083b8a.9188040d-6c67-4c5b-b112-36a304b66dad',
  //     formData,
  //     "Asia/Kolkata"
  //   );
  // } catch (error) {
  //   console.log(`Error2: ${error}`)
  // }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
