'use strict';

const   express     = require('express'),
        router      = express.Router(),
        magic       = require('../util/magic'),
        products       = require('../domain/services/service-product');
const {Authenticate} = require("../domain/middleware/authenticate");

router.get('/', products.GetAll);
router.get('/:id', products.GetById);
router.post('/', products.Store);
router.delete('/:id', products.DeleteById);
router.patch('/:id', products.UpdateById);

module.exports = router;