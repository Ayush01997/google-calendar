function parseTime(s) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }
  
  function convertHours(mins){
    var hour = Math.floor(mins/60);
    var mins : any = mins%60;
    var converted = pad(hour, 2)+':'+pad(mins, 2);
    return converted;
  }
  
  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  
  export function calculate_time_slot(start_time, end_time, interval : any = "30"){
      start_time = parseTime(convertTime(start_time))
      end_time = parseTime(convertTime(end_time))
      var i, formatted_time;
    var time_slots = new Array();
      for(var i=start_time; i<=end_time; i = i+interval){
        formatted_time = convertHours(i);
      
      time_slots.push(tConv24(formatted_time));
    }
    return time_slots;
  }
  
  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h : any = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  const convertTime = timeStr => {
    // timeStr = timeStr.replace(/[AP]/, " $&");
     const [time, modifier] = timeStr.split(' ');
     let [hours, minutes] = time.split(':');
     if (hours === '12') {
        hours = '00';
     }
     if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
     }
     return `${hours}:${minutes}`;
  };
  
  var start_time = parseTime("10:15"),
          end_time = parseTime("19:15"),
      interval = 15;
  
  //var times_ara = calculate_time_slot( start_time, end_time, interval );
  
  //times_ara