'use strict';

const   express     = require('express'),
        router      = express.Router(),
        magic       = require('../util/magic'),
        users       = require('../domain/services/service-user');
const {Authenticate} = require("../domain/middleware/authenticate");

router.post('/login/', users.Login);
router.get('/users/', users.GetAll);
router.get('/users/:id', users.GetById);
router.post('/users/', users.Store);
router.delete('/users/:id', Authenticate, users.DeleteById);
router.patch('/users/:id', Authenticate, users.UpdateById);

router.use('/products', Authenticate, require('./productController'));

module.exports = router;