const magic = require('../../util/magic');
const enum_ = require('../../util/enum');
const ormProduct = require('../orm/orm-product');
const {isUuid} = require('uuidv4');

exports.GetAll = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    try {
        respOrm = await ormProduct.GetAll();
        if (respOrm.err) {
            status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
        } else {
            message = 'Success Response', data = respOrm, statusCode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT;
        }
        resp = await magic.ResponseService(status, errorCode, message, data);
        return res.status(statusCode).send(resp);
    } catch (err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, ''));
        return next(err)
    }
}

exports.GetById = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    try {
        const id = req.params.id;
        if (isUuid(id)) {
            respOrm = await ormProduct.GetById(id);
            if (respOrm && respOrm.err) {
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            } else {
                if (respOrm) {
                    message = 'Success Response', data = respOrm, statusCode = enum_.CODE_OK;
                } else {
                    status = 'Failure', errorCode = enum_.ID_NOT_FOUND, message = 'ID NOT FOUND', statusCode = enum_.CODE_NOT_FOUND;
                }
            }
        } else {
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status, errorCode, message, data);
        return res.status(statusCode).send(resp);
    } catch (err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, ''));
        return next(err)
    }
}

exports.Store = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    try {
        const {name, imgUrl, startDateTime, price, duration, bidingPriceLimit} = req.body
        if (name && startDateTime && price && duration && bidingPriceLimit) {
            respOrm = await ormProduct.Store(name, startDateTime, price, duration, bidingPriceLimit, imgUrl);
            if (respOrm.err) {
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            } else {
                message = 'Product created', statusCode = enum_.CODE_CREATED;
            }
        } else {
            status = 'Failure', errorCode = enum_.ERROR_REQUIRED_FIELD, message = 'All fields are required', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status, errorCode, message, data)
        return res.status(statusCode).send(resp);
    } catch (err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, ''));
        return next(err)
    }
}

exports.UpdateById = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    try {
        const id = req.params.id;
        if (isUuid(id)) {
            const {name, imgUrl, startDateTime, price, duration, bidingPriceLimit} = req.body
            if (name && imgUrl && startDateTime && price && duration && bidingPriceLimit) {
                respOrm = await ormProduct.UpdateById({
                    name,
                    imgUrl,
                    startDateTime,
                    price,
                    duration,
                    bidingPriceLimit
                }, id);
                if (respOrm.err) {
                    status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
                } else {
                    message = 'User updated', statusCode = enum_.CODE_CREATED;
                }
            } else {
                status = 'Failure', errorCode = enum_.ERROR_REQUIRED_FIELD, message = 'All fields are required', statusCode = enum_.CODE_BAD_REQUEST;
            }
        } else {
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status, errorCode, message, data)
        return res.status(statusCode).send(resp);
    } catch (err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, ''));
        return next(err)
    }
}

exports.DeleteById = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    try {
        const id = req.params.id;
        if (isUuid(id)) {
            respOrm = await ormProduct.DeleteById(id);
            if (respOrm.err) {
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            } else {
                message = 'User deleted', statusCode = enum_.CODE_OK;
            }
        } else {
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        resp = await magic.ResponseService(status, errorCode, message, data)
        return res.status(statusCode).send(resp);
    } catch (err) {
        res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, ''));
        return next(err)
    }
}

exports.bidProduct = async (req, res, next) => {
    let status = 'Success', errorCode = '', message = '', data = '', statusCode = 0, resp = {};
    let currentDateTime = new Date()
    try {
        const id = req.params.id;
        const lastBidderId = req.user.id;
        const lastBidderName = req.user.name;
        if (isUuid(id)) {
            respOrm = await ormProduct.GetById(id);
            if (respOrm && respOrm.err) {
                status = 'Failure', errorCode = respOrm.err.code, message = respOrm.err.messsage, statusCode = enum_.CODE_BAD_REQUEST;
            } else {
                if (respOrm) {
                    let biddingTimeDuration = new Date(respOrm.startDateTime)
                    console.log("before currentDateTime", biddingTimeDuration)
                    biddingTimeDuration.setMinutes(biddingTimeDuration.getMinutes() + respOrm.duration)
                    console.log("after currentDateTime", biddingTimeDuration)

                    if (currentDateTime > biddingTimeDuration) {
                        status = 'Failure', errorCode = enum_.CRASH_LOGIC, message = 'Bidding Time is Over', statusCode = enum_.CODE_BAD_REQUEST;
                    } else if (currentDateTime < new Date(respOrm.startDateTime)) {
                        status = 'Failure', errorCode = enum_.CRASH_LOGIC, message = 'Bidding Not Started Yet!', statusCode = enum_.CODE_BAD_REQUEST;
                    } else if (respOrm.lastBidderId == lastBidderId) {
                        status = 'Failure', errorCode = enum_.CRASH_LOGIC, message = 'Already bid for the product', statusCode = enum_.CODE_BAD_REQUEST;
                    } else if (req.body.bidPrice > respOrm.bidingPriceLimit) {
                        status = 'Failure', errorCode = enum_.CRASH_LOGIC, message = 'Exceeds the bid amount', statusCode = enum_.CODE_BAD_REQUEST;
                    } else {
                        let price = respOrm.price + req.body.bidPrice
                        respOrm = await ormProduct.UpdateById({price, lastBidderId, lastBidderName}, id);
                        message = 'Bidding Successfully', data = respOrm, statusCode = enum_.CODE_OK;
                    }
                } else {
                    status = 'Failure', errorCode = enum_.ID_NOT_FOUND, message = 'ID NOT FOUND', statusCode = enum_.CODE_NOT_FOUND;
                }
            }
        } else {
            status = 'Failure', errorCode = enum_.FAIL_CONVERTED_UUID_TO_STRING, message = 'Error trying convert uuid to string', statusCode = enum_.CODE_BAD_REQUEST;
        }
        return await magic.ResponseService(status, errorCode, message, data);
    } catch (err) {
        next(err)
        return await magic.ResponseService('Failure', enum_.CRASH_LOGIC, err, '')
    }
}


