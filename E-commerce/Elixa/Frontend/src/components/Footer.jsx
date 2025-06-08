import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#271d1b] text-white py-12">
      <div className="max-w-8xl mx-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide mb-4">Elixa</h2>
            <p className="text-sm text-gray-400">
              Elevate your style with Elixa's timeless and modern fashion
              collections.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/product"
                  className="hover:text-white transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:support@elixa.com" className="hover:text-white">
                  Email: support@elixa.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white">
                  Phone: +977 9872625244
                </a>
              </li>
              <li>Address: Baluwatar, Kathmandu</li>
            </ul>
          </div>

          {/* Static Section (Replaced Newsletter Signup) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow us for the latest trends and exclusive updates.
            </p>
          </div>
        </div>

        {/* Simple Plain Divider */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Elixa. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a
                href="https://x.com/elixa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com/elixa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com/elixa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
