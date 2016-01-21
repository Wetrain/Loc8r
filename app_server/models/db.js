var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production') {
    console.log('hi')
    dbURI = process.env.MONGOLAB_URI; //'mongodb://adam:password@ds047935.mongolab.com:47935/loc8r' use the first way to ensure nobody can see your db details
    console.log(dbURI)
}
mongoose.connect(dbURI);

/*can also use mongoose.createConnection(URI) and assign to a var for multiple db connections */

/* mongoose event */
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected from ' + dbURI);
});

/* Mongoose graceful exit */
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconeected through ' + msg);
        callback();
    });    
};

// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
    }); 
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
    }); 
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
    }); 
});

require('./locations');
