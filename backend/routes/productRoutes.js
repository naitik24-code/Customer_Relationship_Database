const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getProducts);
router.get('/categories', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getProductCategories);
router.get('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getProductById);

router.post('/', roleMiddleware(['Admin', 'Manager']), createProduct);
router.put('/:id', roleMiddleware(['Admin', 'Manager']), updateProduct);
router.delete('/:id', roleMiddleware(['Admin']), deleteProduct);

module.exports = router;
