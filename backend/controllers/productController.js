const { Product, ProductCategory } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', categoryId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: ProductCategory, as: 'category' }],
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: ProductCategory, as: 'category' }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, categoryId, price } = req.body;

    if (!name || !sku || !categoryId || price === undefined) {
      return res.status(400).json({ message: 'Name, SKU, categoryId, and price are required' });
    }

    const existing = await Product.findOne({ where: { sku } });
    if (existing) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const category = await ProductCategory.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const product = await Product.create({
      name,
      sku,
      description,
      categoryId,
      price
    });

    const fullProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductCategory, as: 'category' }]
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: fullProduct });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sku, description, categoryId, price } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (sku && sku !== product.sku) {
      const existing = await Product.findOne({ where: { sku } });
      if (existing) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }

    if (categoryId) {
      const category = await ProductCategory.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    await product.update({
      name: name || product.name,
      sku: sku || product.sku,
      description: description !== undefined ? description : product.description,
      categoryId: categoryId || product.categoryId,
      price: price !== undefined ? price : product.price
    });

    const fullProduct = await Product.findByPk(id, {
      include: [{ model: ProductCategory, as: 'category' }]
    });

    res.status(200).json({ success: true, message: 'Product updated successfully', data: fullProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getProductCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.findAll();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories
};
