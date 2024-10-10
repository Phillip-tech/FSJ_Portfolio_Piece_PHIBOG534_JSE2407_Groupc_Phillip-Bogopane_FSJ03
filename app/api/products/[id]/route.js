import { db } from '../../../lib/firebase'; // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for client SDK
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params; // Extract product ID from URL params
  console.log(id,'123')
  try {
    // Create a reference to the product document in Firestore
    const productRef = doc(db, 'products', `00${id}`);
    
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
