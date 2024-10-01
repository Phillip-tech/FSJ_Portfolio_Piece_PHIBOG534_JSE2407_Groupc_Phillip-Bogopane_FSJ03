// app/components/Footer.js
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto py-6 px-4 text-center">
        <p>&copy; {new Date().getFullYear()} NextEcommerce. All rights reserved.</p>
        <div className="mt-4">
          {/* Social media links or other footer content */}
          <a href="https://twitter.com" className="text-blue-500 hover:underline mx-2">Twitter</a>
          <a href="https://facebook.com" className="text-blue-500 hover:underline mx-2">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
