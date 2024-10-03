import React, { Suspense } from 'react';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'NextEcommerce',
  description: 'Your one-stop shop for everything',
  // Add additional meta tags as needed
  keywords: ['ecommerce', 'shop', 'nextjs'],
  openGraph: {
    type: 'website',
    url: 'https://www.nextecommerce.com',
    title: 'NextEcommerce',
    description: 'Your one-stop shop for everything',
    images: [
      {
        url: 'https://www.nextecommerce.com/logo.png',
        width: 800,
        height: 600,
        alt: 'NextEcommerce Logo',
      },
    ],
  },
};

/**
 * The root layout component.
 *
 * This component is responsible for rendering the root HTML element,
 * as well as the `<head>` and `<body>` elements.
 *
 * It also renders the `<Header>`, `<main>`, and `<Footer>` components.
 *
 * The `<main>` element is a container for the page's content, and is
 * where you should render your page's components.
 *
 * The `<head>` element contains metadata about the page, such as the
 * page title, description, and keywords.
 *
 * The component also accepts a `children` prop, which is the content
 * of the page.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the page.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="description" content={metadata.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        {metadata.openGraph.images.map((image, index) => (
          <meta
            key={index}
            property="og:image"
            content={image.url}
          />
        ))}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        {/* Add more meta tags as needed */}
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-between mb-4">
            {/* Add any additional elements */}
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}