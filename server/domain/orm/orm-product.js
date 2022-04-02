const conn = require('../repositories/repository_mongo');
const { uuid } = require('uuidv4');


exports.GetAll = async () =>{
    try{
        return await conn.db.connMongo.Product.find({IsDelete: false});
    }catch(err){
        console.log(" err orm-product.GetAll = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.GetById = async ( Id ) =>{
    try{
        return await conn.db.connMongo.Product.findOne({ productId: Id, IsDelete: false });
    }catch(err){
        console.log(" err orm-product.GetById = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.Store = async ( name, startDateTime, price, duration, bidingPriceLimit, imgUrl ) =>{
    try{
        const datacenter = await new conn.db.connMongo.Product({
            productId: uuid(),
            name: name,
            imgUrl: imgUrl,
            startDateTime: startDateTime,
            price: price,
            duration: duration,
            bidingPriceLimit: bidingPriceLimit,
            IsDelete: false
        });
        datacenter.save();
        return true
    }catch(err){
        console.log(" err orm-product.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.DeleteById = async ( Id ) =>{
    try{
        await conn.db.connMongo.Product.findOneAndUpdate({productId: Id}, { IsDelete: true })
        return true
    }catch(err){
        console.log(" err orm-product.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}

exports.UpdateById = async ( updatedDataObject, Id ) =>{
    try{
        return await conn.db.connMongo.Product.findOneAndUpdate(
            {
                productId: Id
            }, updatedDataObject, {new: true})
    }catch(err){
        console.log(" err orm-product.Store = ", err);
        return await {err:{code: 123, messsage: err}}
    }
}