var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  req.toJade.title = "Advisements";
  req.toJade.adv = {};

  req.Advisement.find({}).populate('students', 'username firstName lastName registered').sort({title: 1}).exec(function(err, advs){
    if(err) throw err;
    req.toJade.advisements = [];

    if (advs){
      req.toJade.advisements = advs;
    }
    res.render('advisement/list', req.toJade);
  });
});

router.get('/:advisement', function(req, res){
  var advisement = req.params.advisement;
  req.toJade.title = "Advisement "+advisement;
  req.toJade.advisement = advisement;

  req.Advisement.findOne({title: advisement}).populate('students', 'username firstName lastName registered').sort({title: 1}).exec(function(err, adv){
    if(err) throw err;
    req.toJade.advisement = {};

    if (adv){
      req.toJade.registered = adv.students.filter(function(value) {
        return value.registered == true;
      })
      req.toJade.advisement = adv;
    }
    res.render('advisement/one', req.toJade);
  });
});

module.exports = router;
