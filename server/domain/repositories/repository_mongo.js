const config = require('config-yml');
const mongoose = require('mongoose');
const enum_ = require('../../util/magic');
const user = require('../entities/entity-user');
const product = require('../entities/entity-product');

mongoose.set('useFindAndModify', false);

let arrayConns = [], db = {};

if (config.db.mongodb && config.db.mongodb.length > 0) {
    config.db.mongodb.map((c)=>{
        mongoose.connect(`mongodb+srv://${c.host}/${c.database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10 
          });
        db[c.nameconn] = {}
        db[c.nameconn].conn = mongoose;
        db[c.nameconn].User = user(mongoose);
        db[c.nameconn].Product = product(mongoose);
    })
    exports.db = db;
}else{
    enum_.LogDanger("There is no linked database")
}
