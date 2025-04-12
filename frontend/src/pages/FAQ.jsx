import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Register' button in the navigation bar. Fill in your details including your full name, email address, and create a password. You'll need to verify your email address to complete the registration process."
  },
  {
    question: "How do I list a product for sale?",
    answer: "After logging in, click on 'Add Product' in the navigation menu. Fill in the product details including name, category, description, price, and upload images. Once submitted, your product will be available in the marketplace."
  },
  {
    question: "How do I make a purchase?",
    answer: "Browse the marketplace and click on any product you're interested in. Review the product details and click 'Add to Cart' if you want to purchase. You can then proceed to checkout from your cart."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods including credit/debit cards, UPI, and net banking. All transactions are secure and processed through our trusted payment gateway."
  },
  {
    question: "How do I contact a seller?",
    answer: "You can contact sellers through our built-in messaging system. Click on the 'Message' button on the product page to start a conversation with the seller."
  },
  {
    question: "What is your return policy?",
    answer: "We have a 7-day return policy for most items. If you're not satisfied with your purchase, you can initiate a return request through your order history. Some items may be non-returnable based on the seller's policy."
  },
  {
    question: "How do I report a problem?",
    answer: "If you encounter any issues, you can contact our support team through the 'Contact Us' page or email us at support@campuscart.com. We aim to respond to all queries within 24 hours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-[#4CAF50]" />
                  ) : (
                    <FaChevronDown className="text-[#4CAF50]" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <button className="bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#45a049] transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 