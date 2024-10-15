import { db } from '../../../lib/firebase'; // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for client SDK
import { NextResponse } from 'next/server';

/**
 * GET /api/products/:id
 * 
 * Fetches a product from Firestore using the provided ID in the URL params.
 * Returns the product data along with its document ID as a JSON response.
 * If the product does not exist, returns a 404 error with an error message.
 * If there is an error in fetching the product, returns a 500 error with an error message.
 */
export async function GET(request, { params }) {
  let { id } = params; // Extract product ID from URL params
  id = id.padStart(3, '0')
  try {
    // Create a reference to the product document in Firestore
    const productRef = doc(db, 'products', id);
    
    // Fetch the document snapshot from Firestore
    const productSnap = await getDoc(productRef);

    // Check if the product exists
    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Return the product data along with the document ID
    const product = { id: productSnap.id, ...productSnap.data() };
    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}
