import { db } from '../../lib/firebase'
import { getDocs, collection, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 20

    // Reference to the "products" collection
    const productsCollection = collection(db, "products");
    let q = query(productsCollection);

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
    q = query(q, limit(pageSize));

    if (page > 1) {
      const lastVisible = await getLastVisibleDoc(q, (page - 1) * pageSize);
      q = query(q, startAfter(lastVisible));
    }

    // Get documents in the collection
    const productSnapshot = await getDocs(q);
    // Map through documents to extract data
    const productsList = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(productsList);
  } catch (error) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// This function needs to be implemented
async function getLastVisibleDoc(query, skip) {
  // Implementation details depend on your specific requirements
  // This is just a placeholder
  const snapshot = await getDocs(query);
  return snapshot.docs[skip - 1];
}