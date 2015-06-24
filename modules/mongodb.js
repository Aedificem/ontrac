// Database stuff
var mongoose = require('mongoose');
var config = require('./config');
var Schema = mongoose.Schema;
var schemas = require('./schemas.js');
mongoose.connect('mongodb://127.0.0.1/'+config.db);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Failed to connect to database:'));
db.once('open', function (callback) {
  console.log('Connected to database');
  var userSchema = new Schema(schemas.user);
  userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
  });

  userSchema.virtual('grade').get(function () {
    return 8+parseInt(this.advisement.charAt(0));
  });

  userSchema.virtual('gradeName').get(function () {
    var adv = this.advisement.charAt(0);
    var grade = "";
    switch(adv) {
      case "1":
        grade = "Freshman";
        break;
      case "2":
        grade = "Sophmore";
        break;
      case "3":
        grade = "Junior";
        break;
      case "4":
        grade = "Senior";
        break;
    }
    return grade;
  });

  userSchema.virtual('rankName').get(function () {
    var rank = this.rank;
    switch(rank) {
      case 0:
        rank = "Guest";
        break;
      case 2:
        ranl = "User";
        break;
      case 3:
        rank = "Member";
        break;
      case 4:
        rank = "Operator";
        break;
      case 5:
        rank = "Moderator";
        break;
      case 6:
        rank = "Administrator";
      case 7:
        rank = "Owner";
    }
    return rank;
  });
  var User = mongoose.model('User', userSchema);

  var teacherSchema = new Schema(schemas.teacher);
  var Teacher = mongoose.model('Teacher', teacherSchema);

  var courseSchema = new Schema(schemas.course);
  courseSchema.statics.getTeacher = function(c, cb) {
    return Teacher.find({tID : c.tID}, cb);
  };
  var Course = mongoose.model('Course', courseSchema);

  Course.find({}, function(err, courses) {
    if(err) console.log(err);
    courses.forEach(function(course){
      if(typeof course.tID !== 'number'){
        console.log(course);
        Teacher.find({lastName: course.tID}, function(err, item){
          if(err) console.log(err);
          
          course.tID = item.tID;
          course.save();
        });
      }

    });
  });

  module.exports.Course = Course;
  module.exports.Teacher = Teacher;
  module.exports.User = User;
});
