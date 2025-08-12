import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQs: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const faqSections: FAQSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5_31676)">
            <path d="M5.5077 14.0316L4.42137 12.9453C4.12254 12.6465 4.01708 12.2141 4.15067 11.8133C4.25614 11.5004 4.39676 11.0926 4.56551 10.625H0.845981C0.543638 10.625 0.262388 10.4633 0.111216 10.1996C-0.0399561 9.93593 -0.0364405 9.6125 0.118247 9.35234L1.96395 6.24101C2.42098 5.47109 3.24715 5 4.14012 5H7.03348C7.11786 4.85937 7.20223 4.72929 7.28661 4.60273C10.1659 0.355855 14.455 0.21523 17.0143 0.686324C17.4222 0.760152 17.7386 1.08007 17.8159 1.48789C18.287 4.05078 18.1429 8.33632 13.8995 11.2156C13.7765 11.3 13.6429 11.3844 13.5022 11.4687V14.3621C13.5022 15.2551 13.0311 16.0848 12.2612 16.5383L9.14989 18.384C8.88973 18.5387 8.56629 18.5422 8.30262 18.391C8.03895 18.2398 7.87723 17.9621 7.87723 17.6562V13.8875C7.38153 14.0598 6.94911 14.2004 6.62215 14.3059C6.2284 14.4324 5.7995 14.3234 5.50418 14.0316H5.5077ZM13.5022 6.40625C13.8752 6.40625 14.2329 6.25809 14.4966 5.99436C14.7603 5.73064 14.9085 5.37296 14.9085 5C14.9085 4.62704 14.7603 4.26935 14.4966 4.00563C14.2329 3.7419 13.8752 3.59375 13.5022 3.59375C13.1293 3.59375 12.7716 3.7419 12.5079 4.00563C12.2441 4.26935 12.096 4.62704 12.096 5C12.096 5.37296 12.2441 5.73064 12.5079 5.99436C12.7716 6.25809 13.1293 6.40625 13.5022 6.40625Z" fill="#5F42A1"/>
          </g>
          <defs>
            <clipPath id="clip0_5_31676">
              <path d="M0 0.5H18V18.5H0V0.5Z" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      items: [
        {
          id: 'post-job',
          question: 'How do I post a job?',
          answer: 'You can either fill out a quick form or use the voice input option. Only a few fields are required to get started.'
        },
        {
          id: 'find-freelancer',
          question: 'How do I find the right freelancer?',
          answer: 'Head to the "Browse Freelancers" page to explore talent by category, delivery time, budget, and ratings. You can message freelancers directly or post a job—interested freelancers will apply, and you can review their profiles, message them, or hire the one that fits best.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5_31685)">
            <path d="M1.25 1.375C0.00898445 1.375 -1 2.38398 -1 3.625V4.75H19.25V3.625C19.25 2.38398 18.241 1.375 17 1.375H1.25ZM19.25 8.125H-1V14.875C-1 16.116 0.00898445 17.125 1.25 17.125H17C18.241 17.125 19.25 16.116 19.25 14.875V8.125ZM2.9375 12.625H5.1875C5.49687 12.625 5.75 12.8781 5.75 13.1875C5.75 13.4969 5.49687 13.75 5.1875 13.75H2.9375C2.62812 13.75 2.375 13.4969 2.375 13.1875C2.375 12.8781 2.62812 12.625 2.9375 12.625ZM6.875 13.1875C6.875 12.8781 7.12813 12.625 7.4375 12.625H11.9375C12.2469 12.625 12.5 12.8781 12.5 13.1875C12.5 13.4969 12.2469 13.75 11.9375 13.75H7.4375C7.12813 13.75 6.875 13.4969 6.875 13.1875Z" fill="#5F42A1"/>
          </g>
          <defs>
            <clipPath id="clip0_5_31685">
              <path d="M-1 0.25H19.25V18.25H-1V0.25Z" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      items: [
        {
          id: 'payment-work',
          question: 'How does payment work?',
          answer: 'When you hire a freelancer, you don\'t pay immediately. You\'ll first receive the work and get a chance to preview the final files. Once you\'re happy with the outcome, you can complete the payment, and then the files will be unlocked for full download.'
        },
        {
          id: 'refund',
          question: 'Can I get a refund?',
          answer: 'If there\'s an issue with the work and you haven\'t approved the final delivery, you can raise a concern. Our support team will step in to help resolve it. Refunds are handled case by case.'
        }
      ]
    },
    {
      id: 'project-management',
      title: 'Project Management',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5_31693)">
            <path d="M5.34902 1.84297C5.69707 2.15586 5.7252 2.68672 5.4123 3.03476L2.88105 5.84726C2.72637 6.01953 2.5084 6.12148 2.27637 6.125C2.04434 6.12851 1.82285 6.04062 1.65762 5.8789L0.247852 4.47265C-0.0791016 4.14218 -0.0791016 3.60781 0.247852 3.27734C0.574805 2.94687 1.1127 2.94687 1.43965 3.27734L2.2166 4.05429L4.15371 1.90273C4.4666 1.55468 4.99746 1.52656 5.34551 1.83945L5.34902 1.84297ZM5.34902 7.46797C5.69707 7.78086 5.7252 8.31172 5.4123 8.65976L2.88105 11.4723C2.72637 11.6445 2.5084 11.7465 2.27637 11.75C2.04434 11.7535 1.82285 11.6656 1.65762 11.5039L0.247852 10.0977C-0.0826172 9.76718 -0.0826172 9.23281 0.247852 8.90586C0.57832 8.5789 1.1127 8.57539 1.43965 8.90586L2.2166 9.68281L4.15371 7.53125C4.4666 7.1832 4.99746 7.15508 5.34551 7.46797H5.34902ZM7.87676 3.875C7.87676 3.25273 8.37949 2.75 9.00176 2.75H16.8768C17.499 2.75 18.0018 3.25273 18.0018 3.875C18.0018 4.49726 17.499 5 16.8768 5H9.00176C8.37949 5 7.87676 4.49726 7.87676 3.875ZM7.87676 9.5C7.87676 8.87773 8.37949 8.375 9.00176 8.375H16.8768C17.499 8.375 18.0018 8.87773 18.0018 9.5C18.0018 10.1223 17.499 10.625 16.8768 10.625H9.00176C8.37949 10.625 7.87676 10.1223 7.87676 9.5ZM5.62676 15.125C5.62676 14.5027 6.12949 14 6.75176 14H16.8768C17.499 14 18.0018 14.5027 18.0018 15.125C18.0018 15.7473 17.499 16.25 16.8768 16.25H6.75176C6.12949 16.25 5.62676 15.7473 5.62676 15.125ZM1.68926 13.4375C2.13681 13.4375 2.56603 13.6153 2.8825 13.9318C3.19897 14.2482 3.37676 14.6774 3.37676 15.125C3.37676 15.5725 3.19897 16.0018 2.8825 16.3182C2.56603 16.6347 2.13681 16.8125 1.68926 16.8125C1.2417 16.8125 0.812483 16.6347 0.496015 16.3182C0.179547 16.0018 0.0017578 15.5725 0.0017578 15.125C0.0017578 14.6774 0.179547 14.2482 0.496015 13.9318C0.812483 13.6153 1.2417 13.4375 1.68926 13.4375Z" fill="#5F42A1"/>
          </g>
          <defs>
            <clipPath id="clip0_5_31693">
              <path d="M0 0.5H18V18.5H0V0.5Z" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      items: [
        {
          id: 'review-work',
          question: 'How do I review the final work?',
          answer: 'Final drafts will be shared via the message thread. You\'ll be able to preview them before approving and making the payment. Download access is enabled only after payment is completed.'
        },
        {
          id: 'revisions',
          question: 'What if I need revisions?',
          answer: 'You can request changes directly in the message thread. Most freelancers will make updates based on your feedback before final delivery.'
        }
      ]
    }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const handleContactSupport = () => {
    navigate('/contact-support');
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
        
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="#8D8D8D" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search FAQs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-600 bg-transparent outline-none min-w-0"
            />
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-12">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                {section.icon}
                <h2 className="text-lg font-medium text-black">{section.title}</h2>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="border border-gray-300 rounded-lg">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base font-medium text-gray-700 flex-1">{item.question}</span>
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`}
                      >
                        <path d="M12.0034 16.8C11.3034 16.8 10.6034 16.53 10.0734 16L3.55344 9.48C3.26344 9.19 3.26344 8.71 3.55344 8.42C3.84344 8.13 4.32344 8.13 4.61344 8.42L11.1334 14.94C11.6134 15.42 12.3934 15.42 12.8734 14.94L19.3934 8.42C19.6834 8.13 20.1634 8.13 20.4534 8.42C20.7434 8.71 20.7434 9.19 20.4534 9.48L13.9334 16C13.4034 16.53 12.7034 16.8 12.0034 16.8Z" fill="#737373"/>
                      </svg>
                    </button>
                    {expandedItems.has(item.id) && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-12 bg-purple-50 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_5_31705)">
                  <path d="M12 2.75C6.61406 2.75 2.25 7.11406 2.25 12.5V14.375C2.25 14.9984 1.74844 15.5 1.125 15.5C0.501562 15.5 0 14.9984 0 14.375V12.5C0 5.87188 5.37188 0.5 12 0.5C18.6281 0.5 24 5.87188 24 12.5V19.2547C24 21.5328 22.1531 23.3797 19.8703 23.3797L14.7 23.375C14.3109 24.0453 13.5844 24.5 12.75 24.5H11.25C10.0078 24.5 9 23.4922 9 22.25C9 21.0078 10.0078 20 11.25 20H12.75C13.5844 20 14.3109 20.4547 14.7 21.125L19.875 21.1297C20.9109 21.1297 21.75 20.2906 21.75 19.2547V12.5C21.75 7.11406 17.3859 2.75 12 2.75ZM6.75 10.25H7.5C8.32969 10.25 9 10.9203 9 11.75V17C9 17.8297 8.32969 18.5 7.5 18.5H6.75C5.09531 18.5 3.75 17.1547 3.75 15.5V13.25C3.75 11.5953 5.09531 10.25 6.75 10.25ZM17.25 10.25C18.9047 10.25 20.25 11.5953 20.25 13.25V15.5C20.25 17.1547 18.9047 18.5 17.25 18.5H16.5C15.6703 18.5 15 17.8297 15 17V11.75C15 10.9203 15.6703 10.25 16.5 10.25H17.25Z" fill="#5F42A1"/>
                </g>
                <defs>
                  <clipPath id="clip0_5_31705">
                    <path d="M0 0.5H24V24.5H0V0.5Z" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-gray-900">Still need help?</h3>
              <p className="text-sm text-gray-600">Our support team is available to assist you with any questions you may have.</p>
              <button
                onClick={handleContactSupport}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
