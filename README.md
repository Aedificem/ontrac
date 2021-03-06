[![Stories in Ready](https://badge.waffle.io/Aedificem/ontrac.png?label=ready&title=Ready)](https://waffle.io/Aedificem/ontrac)
[![Stories in Progress](https://badge.waffle.io/Aedificem/ontrac.svg?label=In%20Progress&title=In%20Progress)](http://waffle.io/Aedificem/ontrac)

# README #

[![Join the chat at https://gitter.im/Aedificem/ontrac](https://badges.gitter.im/Aedificem/ontrac.svg)](https://gitter.im/Aedificem/ontrac?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**O** - Open-source <br>
**N** - Networked <br>
**T** - Third-party <br>
**R** - Regis High School <br>
**A** - Academic <br>
**C** - Connector <br>

Making Regis even better.

[See it in action!](http://www.getontrac.info/)

### What is OnTrac? ###

OnTrac is a free, online Web service created specifically to
allow Regis students to get a better grasp on their academic
life while at the same time providing an easy, customized
platform for organization and collaboration with their
classmates and schoolmates.

* Alpha v2.x
* Make Regis eas*ier*
* Track homework, projects, tests, quizzes, grades, notes, tasks, reminders, friends, schedules, meetings, clubs, groups, and more all in one place at the same time.


### How do I run it myself? ###

You'll need:
* MongoDB
* Python2.7 with pip installed
* NodeJS
* Gulp, Bower, and nodemon globally installed with npm

Then:

1. ```$ npm install ```
2. Copy ```secrets-example.json``` to ```secrets.json``` with your info
3. Copy ```config-example.js``` to ```config.js``` and edit
4. ```$ pip2 install trms```
5. ```$ npm run db``` then ```$ npm run scrape```
6. ```$ npm start```
7. Go to [http://localhost:3000](http://localhost:3000)

### How can I help? ###

I am looking to assemble a team of students, no prior experience needed, to learn JS and work together to improve this project. The idea of this project started out quite small and simple (a one-page homework manager for my advisement) and has become much more than one guy can handle alone.

If you are interested in helping,

1. Learn JS (if you ask I'll recommend some good beginner resources).
2. Contact me at either my [Regis email](mailto:fmatranga18@regis.org) or my [personal email](mailto:thefrankmatranga@gmail.com).
3. ???
4. Profit

### Screenshots ###

![A typical OnTrac homepage!](/client/public/images/screenshots/homepage.png)

![A profile page!](/client/public/images/screenshots/profile.png)

### Progress ###
[![Throughput Graph](https://graphs.waffle.io/Aedificem/ontrac/throughput.svg)](https://waffle.io/Aedificem/ontrac/metrics)
