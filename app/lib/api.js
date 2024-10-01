
const API_URL = 'https://next-ecommerce-api.vercel.app';

/**
 * Fetches a page of products from the API with optional search, category, and
 * sorting criteria.
 *
 * @param {{ page: number, limit: number, search: string, category: string, sort: string }} options
 * @prop {number} [options.page=1] The page number to fetch.
 * @prop {number} [options.limit=20] The number of products to fetch per page.
 * @prop {string} [options.search=''] A search query to filter products by title.
 * @prop {string} [options.category=''] A category to filter products by.
 * @prop {string} [options.sort=''] A sort criteria in the form of "field_order",
 *    where "field" is the name of the field to sort by, and "order" is either
 *    "asc" or "desc".
 * @returns {Promise<{ products: import('../types').Product[], total: number, currentPage: number, totalPages: number }>} An object with the fetched page of products, the total number of products, the current page number, and the total number of pages.
 */
export async function getProducts({ page = 1, limit = 20, search = '', category = '', sort = '' }) {
  const skip = (page - 1) * limit;
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });

  if (search) {
    queryParams.append('search', search);
  }
  if (category) {
    queryParams.append('category', category);
  }
  if (sort) {
    const [sortField, sortOrder] = sort.split('_');
    queryParams.append('sortBy', sortField);
    queryParams.append('order', sortOrder);
  }

  const url = `${API_URL}/products?${queryParams.toString()}`;
  console.log('Fetching products from', url);

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch products. Status: ${res.status}`);
  }

  const products = await res.json();
  
  // Fetch total count in a separate request
  const countRes = await fetch(`${API_URL}/products/count?${queryParams.toString()}`, { cache: 'no-store' });
  const { count: totalCount } = await countRes.json();

  console.log(`Fetched ${products.length} products out of ${totalCount}`);

  return {
    products,
    total: totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  };
}


/**
 * Fetches a single product from the API by id.
 * @param {number|string} id The id of the product to fetch.
 * @returns {Promise<object>} The fetched product data.
 * @throws {Error} If the request fails.
 */
export async function getProduct(id) {
  const singleProductURL = `${API_URL}/products/${id}`;
  console.log('Fetching product with id', id, 'from', singleProductURL);
 
  const res = await fetch(singleProductURL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch product. Status: ${res.status}`);
  }
  const product = await res.json();
  console.log('Fetched product:', product);
 
  return product;
}

