var config  = require('nconf');
config.argv().env().file({file: __dirname + '/config.json'});

var Sequelize       = require('sequelize');

var sequelize = new Sequelize(
    config.get('DATABASE'),
    config.get('DB_USER'),
    config.get('DB_PASS'), {
        host:           config.get('DB_HOST'),
        port:           config.get('DB_PORT'),
        dialect:        'postgres',
        pool:           {
            maxConnections: 5,
            minConnections: 1,
            maxIdleTime: 10000
        },
        dialectOptions: {ssl: true},
        logging:        false,
    }
);

var BirthdayCard = sequelize.define('birthday_card',
    {
        design:       	{type: Sequelize.STRING},
        message:        {type: Sequelize.STRING},
        name:     		{type: Sequelize.STRING},
        address:  		{type: Sequelize.STRING},
        city:   		{type: Sequelize.STRING},
 		state:   		{type: Sequelize.STRING},
 		email:   		{type: Sequelize.STRING},
		zip:   			{type: Sequelize.STRING},
		opt_in:      	{type: Sequelize.INTEGER},
		status:   		{type: Sequelize.STRING},
        create_date:    {type: Sequelize.DATE},
        mod_date:       {type: Sequelize.DATE},
    },
    {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: '_chelsea_birthday',
        classMethods: {}
    }
);

module.exports = {
    sequelize: sequelize,
    BirthdayCard: BirthdayCard
}