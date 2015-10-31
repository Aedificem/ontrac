var express = require('express');
var router = express.Router();
var moment = require('moment');
var schedules = require('../modules/schedule');

/* ----------------------------- */
/*         GET REQUESTS          */
/* ----------------------------- */

router.get('/', function(req, res) {
  var nD = schedules.getNextDay(moment(), req.currentUser.scheduleObject);
  req.toJade.closestDay = moment(nD, "MM/DD/YY").format("YYYY-MM-DD");
  var adv = req.currentUser.advisement.charAt(0);
  var grade = "";
  switch(adv) {
    case "1":
      grade = "Freshman";
      break;
    case "2":
      grade = "Sophomore";
      break;
    case "3":
      grade = "Junior";
      break;
    case "4":
      grade = "Senior";
      break;
  }

  req.toJade.title = "Your "+grade+" Work";
  res.render('work/index', req.toJade);
});

router.get('/closest', function(req, res) {
  var nD = schedules.getNextDay(moment(), req.currentUser.scheduleObject);
  if(!nD){
    req.session.info.push("Cannot find the next class day!");
    res.redirect("/work");
    return;
  }else{
    res.redirect("/work/"+moment(nD, "MM/DD/YY").format("YYYY-MM-DD"));
  }
});

router.get("/today", function(req, res) {
  res.redirect("/work/"+moment().format("YYYY-MM-DD"));
});

router.get('/:date', function(req, res){
  var dateString = req.toJade.dateString = req.params.date;
  req.toJade.day = false;
  req.toJade.date = false;
  req.toJade.isToday = (dateString == req.today.format("YYYY-MM-DD"));

  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    // Bad date passed
    req.session.errs.push("Bad date.");
    res.redirect('/work');
    return;
  }

  // Good date
  var date = req.toJade.date = moment(dateString, 'YYYY-MM-DD', true);
  req.toJade.title = date.format("dddd, MMM Do YY");
  req.toJade.items = false;

  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    req.session.info.push("Redirected to closest school day.");
    // Passed date is not a school, day try to find the next one
    console.log("Not school day, finding closest one.");
    var nD = schedules.getNextDay(date, req.currentUser.scheduleObject);
    if(!nD){
      req.session.info.push("Cannot find the next class day!");
      res.redirect("/work");
      return;
    }else{
      res.redirect('/work/'+moment(nD, "MM/DD/YY").format("YYYY-MM-DD"));
      return;
    }

    var pD = schedules.getPrevDay(date, req.currentUser.scheduleObject);
    if(!pD){
      req.session.info.push("Cannot find the previous class day!");
      res.redirect("/work");
      return;
    }else{
      res.redirect('/work/'+moment(pD, "MM/DD/YY").format("YYYY-MM-DD"));
      return;
    }
  }
  req.toJade.scheduleDay = req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")];

  // Get time from today to this date
  var diff = moment(date).diff(req.today, 'days');
  if(diff == 0)
    req.toJade.fromNow = "today";
  else if(diff == 1)
    req.toJade.fromNow = "tomorrow";
  else if(diff > 0)
    req.toJade.fromNow = diff+" days away";
  else if(diff == -1)
    req.toJade.fromNow = "yesterday";
  else
    req.toJade.fromNow = Math.abs(diff)+" days ago";

  // GET THE NEXT AND PREVIOUS DATES FOR THE DAY CONTROLS
  req.toJade.next = moment(schedules.getNextDay(date, req.currentUser.scheduleObject), "MM/DD/YY").format("YYYY-MM-DD");
  req.toJade.previous = moment(schedules.getPrevDay(date, req.currentUser.scheduleObject), "MM/DD/YY").format("YYYY-MM-DD");

  var classes = req.currentUser.scheduleObject.dayClasses[req.toJade.scheduleDay];
  req.toJade.classes = classes;
  console.log(classes);
  res.render('work/one', req.toJade);
});

router.get("/:date/homework", function(req, res) {
  var dateString = req.params.date;
  var day = false;

  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    res.json({error: "Bad date."}); // Bad date passed
    return;
  }
  var date = req.toJade.date = moment(dateString, 'YYYY-MM-DD', true); // Good date
  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    res.json({error: "Date passed is not a school day."});
    return;
  }
  req.HWItem.find({username: req.currentUser.username, date: date.toDate()})
    .populate('course', 'title')
    .lean()
    .exec(function(err, hwItems){
      if(err){res.json({error: err}); return;}
      if(hwItems){
        res.json({success: true, hwItems: hwItems});
      }else{
        res.json({error: "No items found"});
      }
    });
});

router.get('/:date/all', function(req, res){
  var dateString = req.params.date;
  var day = false;
  var returned = {success: true};
  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    res.json({error: "Bad date."}); // Bad date passed
    return;
  }
  var date = req.toJade.date = moment(dateString, 'YYYY-MM-DD', true); // Good date
  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    res.json({error: "Date passed is not a school day."});
    return;
  }
  req.HWItem.find({username: req.currentUser.username, date: date.toDate()})
    .populate('course', 'title mID')
    .lean()
    .exec(function(err, hwItems){
      if(err){res.json({error: err}); return;}
      if(hwItems){
        returned.hwItems = hwItems;
      }else{
        returned.hwItems = [];
      }

      res.json(returned);
    });
});

router.post("/:date/homework", function(req, res){
  var dateString = req.params.date;
  var day = false;
  var hwItemID = req.body.setCompHWItemID;
  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    res.json({error: "Bad date."}); // Bad date passed
    return;
  }
  var date = req.toJade.date = moment(dateString, 'YYYY-MM-DD', true); // Good date
  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    res.json({error: "Date passed is not a school day."});
    return;
  }
  req.HWItem.findOne({_id: hwItemID}, function(err, hwitem){
    if(err){res.json({error: "An error occured. Please try again later."}); return;}
    if(hwitem){
      var itemStatus = req.body.setCompHWItemStatus;
      hwitem.completed = itemStatus;
      hwitem.save(function(err) {
        if(err){res.json({error: "An error occured. Please try again later."}); return;}
        res.json({success: true});
      });
    }else{
      res.json({error: "No item found."});
    }
  });
});

router.put("/:date/homework", function(req, res){
  var dateString = req.params.date;
  var day = false;

  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    res.json({error: "Bad date."}); // Bad date passed
    return;
  }
  var date = moment(dateString, 'YYYY-MM-DD', true); // Good date
  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    res.json({error: "Date passed is not a school day."});
    return;
  }
  // Construct new HWItem
  //console.log(req.body);
  var courseID = req.body.newHWItemCourseID;
  var desc = req.body.newHWItemDesc;
  var link = req.body.newHWItemLink;
  var newHWItem = new req.HWItem({
    date: date.toDate(),
    username: req.currentUser.username,
    course: courseID,
    desc: desc,
    link: link,
    completed: false
  });
  //console.log(newHWItem);

  newHWItem.save(function(err){
    if(err){res.json({error: "Failed to save new item. Please try again later."}); return;}
    new req.Log({who: req.currentUser._id, what: "Added a HWItem to "+dateString}).save();
    req.Course.findOne({_id: newHWItem.course}, 'mID title', function(err, c) {
      newHWItem.course = c;
      res.json({success: true, added: newHWItem.toJSON()});
    });
  });
});

router.delete("/:date/homework", function(req, res){
  var dateString = req.params.date;
  var day = false;
  var id = req.body.deleteHWItemID;

  if(moment(dateString, 'YYYY-MM-DD', true).isValid() == false){
    res.json({error: "Bad date."}); // Bad date passed
    return;
  }
  var date = req.toJade.date = moment(dateString, 'YYYY-MM-DD', true); // Good date
  if(req.currentUser.scheduleObject.scheduleDays[date.format("MM/DD/YY")] == undefined){
    res.json({error: "Date passed is not a school day."});
    return;
  }
  req.HWItem.remove({_id: id}, function(err){
    if(err){res.json({error: "Failed to remove item. Please try again later."}); return;}
    res.json({success: true});
  });
});

module.exports = function(io) {
  return {router: router, models: ['HWItem', 'Course']}
};
