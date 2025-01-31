import React, { useState } from 'react';

const HelpAndSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { question: 'How do I reset my password?', answer: 'Click on the "Forgot Password" link on the login page and follow the instructions.' },
    { question: 'How do I contact support?', answer: 'You can contact support via the live chat feature or by emailing ecoplusesupport@gmail.com.' },
    { question: 'How do I update my billing information?', answer: 'Go to the "Billing" section in your account settings and update your information.' },
  ];

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">Help and Support</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FAQ Section */}
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="py-3 border-b">
              <p className="font-semibold">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Guides */}
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold">Troubleshooting Guides</h2>
        <ul className="pl-5 list-disc">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              How to reset your password.
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Solving login issues.
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Fixing common errors during checkout.
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold">Contact Support</h2>
        <p>If you're unable to find an answer, you can reach us via:</p>
        <ul className="mt-2 list-none">
          <li>Email: <a href="mailto:support@example.com" className="text-blue-600 hover:underline">ecopulsesupport@gmail.com</a></li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Live Chat: Available on our website</li>
        </ul>
      </div>

      {/* Legal and Privacy */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By using this support page, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
