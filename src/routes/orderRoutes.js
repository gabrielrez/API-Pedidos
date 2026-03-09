const { Router } = require('express');
const controller = require('../controllers/orderController');

const router = Router();

router.post('/', controller.createOrder);
router.get('/list', controller.listOrders);
router.get('/:orderId', controller.getOrder);
router.put('/:orderId', controller.updateOrder);
router.delete('/:orderId', controller.deleteOrder);

module.exports = router;
