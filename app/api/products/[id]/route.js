import { db } from '../../../lib/firebase'; // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for client SDK
import { NextResponse } from 'next/server';


/**
 * GET /api/products/:id
 * 
 * Fetches a product by ID from Firestore and returns the product data with the document ID.
 * 
 * @param {import('next/server').NextRequest} request - The request object from Next.js.
 * @param {import('next/server').NextPageContext} context - The page context object from Next.js.
 * @param {{ id: string }} params - The URL parameters object containing the product ID.
 * 
 * @returns {import('next/server').NextResponse} - The response object from Next.js containing the product data or an error message.
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
