const conn = require('../repositories/repository_mongo');
const { uuid } = require('uuidv4');


exports.GetAll = async () =>{
    try{
        return await conn.db.connMongo.User.find({IsDelete: false});
    }catch(err){
        console.log(" err orm-user.GetAll = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.GetById = async ( Id ) =>{
    try{
        return await conn.db.connMongo.User.findOne({ userId: Id, IsDelete: false });
    }catch(err){
        console.log(" err orm-user.GetById = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.GetByEmail = async ( email ) =>{
    try{
        return await conn.db.connMongo.User.findOne({ email: email, IsDelete: false });
    }catch(err){
        console.log(" err orm-user.GetById = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.Store = async ( name, email, password ) =>{
    try{
        const datacenter = await new conn.db.connMongo.User({
            userId: uuid(),
            name: name,
            email: email,
            password: password,
            IsDelete: false
        });
        datacenter.save();
        return true
    }catch(err){
        console.log(" err orm-user.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.DeleteById = async ( Id ) =>{
    try{
        await conn.db.connMongo.User.findOneAndUpdate({userId: Id}, { IsDelete: true })
        return true
    }catch(err){
        console.log(" err orm-user.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.UpdateById = async ( name, email, password, Id ) =>{
    try{
        await conn.db.connMongo.User.findOneAndUpdate(
            {
                userId: Id
            },{
                name: name,
                email: email,
                password: password,
         })
        return true
    }catch(err){
        console.log(" err orm-user.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}