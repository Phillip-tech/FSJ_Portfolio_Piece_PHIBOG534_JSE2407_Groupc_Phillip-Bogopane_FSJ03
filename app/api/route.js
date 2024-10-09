
const express = require('express');
const { getProducts, getCategories, getProduct } = require('./controllers/productController'); // Assuming controller logic

const router = express.Router();

// Route to get paginated products
router.get('/products', async (req, res) => {
  try {
    const { page, limit, search, category, sort } = req.query;

    // Call the getProducts function from your API layer (with destructured query params)
    const productsData = await getProducts({
      page: Number(page) || 1, 
      limit: Number(limit) || 20, 
      search: search || '', 
      category: category || '', 
      sort: sort || ''
    });

    res.json(productsData); // Send back the products data
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Route to get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Route to get a specific product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProduct(productId);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(404).json({ message: 'Product not found', error });
  }
});

module.exports = router;
