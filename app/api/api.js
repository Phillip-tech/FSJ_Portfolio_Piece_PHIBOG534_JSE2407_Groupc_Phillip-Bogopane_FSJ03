import { db } from '../lib/firebase';
import { collection, query, where, orderBy, startAfter, limit, getDocs, doc, getDoc } from 'firebase/firestore';

const PRODUCTS_PER_PAGE = 20;
const API_URL = 'https://nextecommerce-gk4mje65a-phillips-projects-c89398fb.vercel.app/api';

export async function getProducts({ page = 1, limitCount = PRODUCTS_PER_PAGE, search = '', category = '', sort = '' }) {
  const productsRef = collection(db, 'products');
  let q = query(productsRef);


  if (search) {
    q = query(q, where('title', '>=', search), where('title', '<=', search + '\uf8ff'));
  }
  if (category) {
    q = query(q, where('category', '==', category));
  }
  if (sort) {
    const [sortField, sortOrder] = sort.split('_');
    q = query(q, orderBy(sortField, sortOrder === 'desc' ? 'desc' : 'asc'));
  }
  q = query(q, limit(20));

  if (page > 1) {
    const lastVisible = await getLastVisibleDoc(q, (page - 1) * pageSize);
    q = query(q, startAfter(lastVisible));
  }

  const snapshot = await getDocs(q);
  console.log(snapshot.docs)
  const products = snapshot.docs.map(doc => {
    console.log('123');
    return { id: doc.id, ...doc.data() }});
  console.log(products)
  const totalSnapshot = await getDocs(query(productsRef));
  const total = totalSnapshot.size;

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  };
}



export async function getProduct(id) {
  const productRef = doc(db, 'products', id);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) {
    throw new Error(`Product with id ${id} not found`);
  }
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  return { id: productSnap.id, ...productSnap.data() };
}

async function getLastVisibleDoc(query, skip) {
  const snapshot = await getDocs(query.limit(skip));
  return snapshot.docs[snapshot.docs.length - 1];
}


export async function getCategories() {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  return snapshot.docs.map(doc => doc.data().name);
}