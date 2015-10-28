var express = require('express');
var router = express.Router();
var _ = require("underscore");
var achievements = require("../modules/achievements");
var utils = require("../modules/utils");
var schedules = require("../modules/schedule");

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.toJade.title = "Users";
  res.render('users/list', req.toJade);
});

router.get("/profile", function(req, res) {
  req.toJade.title = "Your Profile";
  res.render('users/edit', req.toJade);
});

router.post("/profile", function(req, res) {
  var newbio = req.body.newbio;
  var newnickname = req.body.newnickname;

  if(newbio){
    req.Student.findOne({username: req.currentUser.username}, function(err, user) {
      if(err){req.session.errs.push('An error occured, please try again.'); res.redirect(req.baseUrl); return;}
      if(user){
        user.bio = utils.filter(newbio);
        user.nickname = newnickname;
        user.steamlink = (req.body.newsteamlink.indexOf("http://steamcommunity.com") > -1 ? req.body.newsteamlink : user.steamlink);
        user.save(function(err) {
          if(err){req.session.errs.push('An error occured, please try again.'); res.redirect(req.baseUrl); return;}
          req.session.info.push("Successfully updated profile.");
          req.session.currentUser.bio = user.bio;
          req.session.currentUser.nickname = user.nickname;
          req.session.currentUser.steamlink = user.steamlink;
          done();
        });
      }else{
        done();
      }
    });
  }else{done();}

  function done(){
    res.redirect("/users/"+req.currentUser.username);
  }
});

router.get("/:username", function(req, res){
  req.toJade.title = "Not a User";
  res.render('users/profile', req.toJade);
});

router.get("/:username/schedule", function(req, res){
  req.Student.findOne({username: req.params.username}, 'firstName lastName schedule code', function(err, user) {
    if(err){req.session.errs.push('An error occured, please try again.'); res.redirect(req.baseUrl); return;}

    if(user.schedule){
      req.toJade.title = user.firstName+" "+user.lastName.charAt(0)+"'s Schedule";
      req.toJade.url = "StudentCode="+user.code;
      req.toJade.schedule = user.schedule;

      res.render('schedule', req.toJade);
    }else{
      req.session.errs.push('Failed to find a schedule for this user.');
      res.redirect("/users/"+req.params.username);
    }
  });
});






//   A     PPPPP    IIIIII
//  A A    P    P     I
// AAAAA   PPPPP      I
//A     A  P        IIIIII


/* GET users */
router.get('/api/list', function(req, res, next) {
  req.Student.find({}, 'registered firstName lastName advisement username rank mpicture ipicture')
    .sort({advisement: 1})
    .lean()
    .exec(function(err, users){
      if(err){res.json({error: 'An error occured, please try again.'}); return;}
      if(users){
        res.json(users);
      }
    });
});

/* GET user */
router.get('/api/loggedIn', function(req, res) {
  if(req.loggedIn){
    res.json(req.currentUser);
  }
});

router.get("/api/:username", function(req, res){
  var username = req.params.username;
  req.Student.findOne({username: username}, '-schedule -locker_number')
    .populate('courses', 'tID title mID code')
    .exec(function(err, user) {
      if(err){res.json({error:'An error occured, please try again.'}); return;}
      if(user){
        user.deepPopulate('courses.teacher', function(err, u) {
          //console.log(u.courses);
          u.courses.forEach(function(c) {
            c.students = undefined;
            if(c.teacher)
              c.teacher.schedule = undefined;
          });
          var stars = _.range(u.rank+1);
          u.schedule = undefined;
          var pointdiff = "";
          if(req.currentUser.points > u.points)
            pointdiff = (req.currentUser.points - u.points)+" fewer";
          else if(req.currentUser.points < u.points)
            pointdiff = (u.points - req.currentUser.points)+" more";
          else
            pointdiff = "the same amount of";

          u.allAchievements = achievements;
          u.stars = stars;
          u.fullName = String(u.fullName);
          u.gradeName = String(u.gradeName);
          res.json(u);
        });
      }else{
        res.json({error: "No such user found!"});
      }
    });
});

module.exports = function(io) {
  return {router: router, models: ['Student', 'Teacher']}
};
