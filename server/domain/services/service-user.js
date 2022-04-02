const magic = require('../../util/magic');
const enum_ = require('../../util/enum');
const ormUser = require('../orm/orm-user');
const { isUuid } = require('uuidv4');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.GetAll = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        respOrm = await ormUser.GetAll();
        if(respOrm.err){
            status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
        }else{
            message = 'Success Response', data = respOrm, statusCode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT;
        }
        resp = await magic.ResponseService(status,errorCode,message,data);
        return res.status(statusCode).send(resp);
    } catch(err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}

exports.GetById = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        const id = req.params.id;
        if(isUuid(id)){
            respOrm = await ormUser.GetById(id);
            if(respOrm && respOrm.err){
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            }else{
                if (respOrm) {
                    message = 'Success Response', data= respOrm, statusCode = enum_.CODE_OK;
                }else{
                    status = 'Failure', errorCode = enum_.ID_NOT_FOUND, message = 'ID NOT FOUND', statusCode = enum_.CODE_NOT_FOUND;
                }
            }
        }else{
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status,errorCode,message,data);
        return res.status(statusCode).send(resp);
    } catch(err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}

exports.Store = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        const { name, email } = req.body
        const password = bcrypt.hashSync(req.body.password, 10)
        if( name && email && password ){
            respOrm = await ormUser.Store( name, email, password );
            if(respOrm.err){
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            }else{
                message = 'User created', statusCode = enum_.CODE_CREATED;
            }
        }else{
            status = 'Failure', errorCode = enum_.ERROR_REQUIRED_FIELD, message = 'All fields are required', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status,errorCode,message,data)
        return res.status(statusCode).send(resp);
    } catch(err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}

exports.UpdateById = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        const id = req.params.id;
        if(isUuid(id)){
            const { name, email } = req.body
            const password = bcrypt.hashSync(req.body.password, 10)
            if( name && email && password ){
                respOrm = await ormUser.UpdateById( name, email, password, id );
                if(respOrm.err){
                    status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
                }else{
                    message = 'User updated', statusCode = enum_.CODE_CREATED;
                }
            }else{
                status = 'Failure', errorCode = enum_.ERROR_REQUIRED_FIELD, message = 'All fields are required', statusCode = enum_.CODE_BAD_REQUEST;
            }
        }else{
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status,errorCode,message,data)
        return res.status(statusCode).send(resp);
    } catch(err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}
exports.DeleteById = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        const id = req.params.id;
        if(isUuid(id)){
            respOrm = await ormUser.DeleteById(id);
            if(respOrm.err){
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            }else{
                message = 'User deleted', statusCode = enum_.CODE_OK;
            }
        }else{
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status,errorCode,message,data)
        return res.status(statusCode).send(resp);
    } catch(err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}

exports.Login = async (req, res, next) =>{
    let status = 'Success', errorCode ='', message='', data='', statusCode=0, resp={};
    try{
        const { email, password } = req.body
        if(email, password){
            respOrm = await ormUser.GetByEmail(email);
            if(respOrm && respOrm.err){
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            }else{
                if (respOrm) {
                    let match = await bcrypt.compare(password, respOrm.password)
                    if(match) {
                        const token = jwt.sign({ id: respOrm.userId, name: respOrm.name }, 'JustOneSecret', { expiresIn: "2h", })
                        message = 'Success Response', data= { token }, statusCode = enum_.CODE_OK;
                    } else {
                        status = 'Failure', errorCode = enum_.NO_CONTENT, message = 'WRONG PASSWORD', statusCode = enum_.CODE_NOT_FOUND;
                    }
                }else{
                    status = 'Failure', errorCode = enum_.NO_CONTENT, message = 'EMAIL NOT FOUND', statusCode = enum_.CODE_NOT_FOUND;
                }
            }
        }else{
            status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status,errorCode,message,data);
        return res.status(statusCode).send(resp);
    } catch(err) {
        console.log("error============> found", err)
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure',enum_.CRASH_LOGIC,err,''));
        return next(err)
    }
}

