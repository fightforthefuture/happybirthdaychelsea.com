var config  = require('nconf');
config.argv().env().file({file: __dirname + '/config.json'});

var async           = require('async');
var stream          = require('stream');
var fs              = require('fs');
var express         = require('express');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var util            = require('util');
var multiparty      = require('multiparty');
var fs              = require('fs');
var template        = require('swig');
var sha1            = require('node-sha1');
var moment          = require('moment');
var request         = require('request');

var util            = require('./util');
var models          = require('./models');
var sequelize       = models.sequelize;
var BirthdayCard    = models.BirthdayCard;

template.setDefaults({
    cache: false,   // JL DEBUG ~ turn off template caching.
    autoescape: false
});


var app = express();
app.set('port', (process.env.PORT || 80));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

app.get('/', function(req, res) {
    var tmpl = template.compileFile('templates/index.html');
    res.send(tmpl({}));
});

app.post('/happy_birthday', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
    	
    	var data = {};
		
		for (var field in fields)
            if (fields.hasOwnProperty(field))
                data[field] = fields[field][0];
        
        console.log('got data:', data);
        
        console.log('creating transaction...');

        // If we made it this far, we can save the artist to database
        return sequelize.transaction().then(function (t) {

            console.log('create birthday card...');

            return BirthdayCard.create(data, {transaction: t}).then(function(u) {
            	console.log('saved!');
            	t.commit();
            	return res.json({hooray: true});
            }).catch(function(err) {
                console.log('omfg error wtf: ', err);
                t.rollback();
                return error(err);
            });
        });
    });
 
});