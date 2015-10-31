// All schemas used in the project are defined here.

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

module.exports = {
  student : {
    firstName: String,
    lastName: String,
    username: String,
    code: String,
    mpicture: String,
    ipicture: String,
    bio: String,
    steamlink: String,
    email: String,
    achievements: Array,
    locker_number: String,
    schedule: String,
    scheduleObject: Object,
    nickname: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'Student'}],
    advisement: String,
    sclasses: Array,
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course'}],
    rank: {type: Number, default: 0},
    points: {type: Number, default: 0},
    login_count: {type: Number, default: 0},
    last_login_time: {type: Date, default: Date.now},
    last_point_login_time: {type: Date, default: Date.now},
    preferences: Object,
    registered_date: {type: Date, default: Date.now},
    registered: { type: Boolean, default: false }
  },
  advisement : {
    teacher: {type: Schema.Types.ObjectId, ref: 'Teacher'},
  	tID : String,
  	title : String,
    students: [{type: Schema.Types.ObjectId, ref: 'Student', default: []}]
  },
  course : {
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher'},
    courseType: String,
    title: String,
    grade: Number,
    students: [{ type: Schema.Types.ObjectId, ref: 'Student', default: []}]
  },
  teacher : {
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', default: []}],
    email: String,
    username: String,
    tID: String,
    image: String,
    code: String,
    schedule: String,
    ipicture: String,
    firstName: String,
    lastName: String,
    department: String,
    ratingCount: {type: Number, default: 0},
    ratings: [{username: String, rating: Number}],
    averageRating: Number,
    ratingStringJSON: String
  },
  log_item: {
    who: { type: Schema.Types.ObjectId, ref: 'Student'},
    what: String,
    when: {type: Date, default: Date.now}
  },
  hwItem: {
    date: Date,
    username: String,
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    desc: String,
    link: String,
    completed: Boolean
  },
  gradedItem: {
    username: String,
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    num_grade: {type: Number, min: 0, max: 100},
    string_grade: {type: String, enum: ['F', 'U', 'S', 'M', 'H', 'HH']},
    comments: {type: String, default: "No comment."}
  },
  reminder: {
    username: String,
    desc: String,
    added_date: {type: Date, default: Date.now}
  },
  feedback: {
    feedbackType: String,
    text: String,
    date_sent: {type: Date, default: Date.now}
  }
}
