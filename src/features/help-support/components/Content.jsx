import React, { useState } from 'react';
import { Search, Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const HelpAndSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    email: '',
    category: '',
    priority: '',
    description: ''
  });
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      category: 'Account Management',
      items: [
        { question: 'How do I reset my password?', 
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password. For security reasons, the link expires after 24 hours.' },
        { question: 'How do I update my billing information?', 
          answer: 'Navigate to Settings > Billing & Payments > Payment Methods. Here you can add, remove, or update your payment information. All data is encrypted and securely stored.' }
      ]
    },
    {
      category: 'Billing & Payments',
      items: [
        { question: 'When will I be billed?', 
          answer: 'Billing occurs on the same date each month as your initial subscription. You can view your next billing date in your account settings under Billing & Payments.' },
        { question: 'What payment methods do you accept?', 
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for business accounts.' }
      ]
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketForm({
        subject: '',
        email: '',
        category: '',
        priority: '',
        description: ''
      });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white">
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-center mb-4">How can we help you?</h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              className="w-full p-4 pr-12 rounded-lg border-2 border-transparent focus:border-green-300 focus:ring-2 focus:ring-green-200 text-gray-900"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-4 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12 space-x-4">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'faq'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'ticket'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Submit a Ticket
          </button>
        </div>

        {activeTab === 'faq' ? (
          // FAQ Section
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{category.category}</h2>
                <div className="space-y-4">
                  {category.items.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-green-50"
                        onClick={() => setExpandedFaq(expandedFaq === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`)}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === `${categoryIndex}-${faqIndex}` ? (
                          <ChevronUp className="text-gray-400" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </button>
                      {expandedFaq === `${categoryIndex}-${faqIndex}` && (
                        <div className="px-6 py-4 bg-green-50 border-t border-gray-200">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Submit Ticket Section
          <div className="max-w-2xl mx-auto">
            {ticketSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Your ticket has been submitted successfully! We'll get back to you soon.
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Submit a Support Ticket</h2>
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={ticketForm.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={ticketForm.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={ticketForm.category}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing</option>
                      <option value="account">Account</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={ticketForm.priority}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                      required
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={ticketForm.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:ring-4 focus:ring-green-200"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <Mail className="mx-auto mb-4 text-green-600" size={24} />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600">ecoplusesupport@gmail.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <Phone className="mx-auto mb-4 text-green-600" size={24} />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <MessageCircle className="mx-auto mb-4 text-green-600" size={24} />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-gray-500 text-sm">
            By using this support page, you agree to our{' '}
            <a href="#" className="text-green-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HelpAndSupport;