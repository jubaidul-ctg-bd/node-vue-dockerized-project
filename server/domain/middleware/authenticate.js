const jwt   = require('jsonwebtoken')
const {isUuid} = require("uuidv4");
const ormUser = require("../orm/orm-user");
const enum_ = require("../../util/enum");
const magic = require("../../util/magic");

exports.Authenticate = async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization
        const decode = jwt.verify(token, 'JustOneSecret')

        let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
        const id = decode.id;
            respOrm = await ormUser.GetById(id);
            if(!respOrm || respOrm.err){
                status = 'Failure', errorCode = enum_.ID_NOT_FOUND, message = 'Authentication Failed', statusCode = enum_.CODE_UNAUTHORIZED;
                resp = await magic.ResponseService(status,errorCode,message,data);
                return res.status(statusCode).send(resp);
            }else{
                req.user = decode
                return next()
            }
    } catch(err) {
        console.log("err = ", err);
        return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
    }
}
