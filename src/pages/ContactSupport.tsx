import React, { useState } from 'react';

interface ContactFormData {
  firstName: string;
  lastName: string;
  topic: string;
  message: string;
  attachments: File[];
}

const ContactSupport: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    topic: '',
    message: '',
    attachments: []
  });

  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Contact Support</h1>
        
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 13L17 17M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="#8D8D8D" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search FAQs"
              className="flex-1 text-sm text-gray-600 bg-transparent outline-none min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Topic Field */}
          <div className="relative">
            <select
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="" disabled>Topic</option>
              <option value="billing">Billing & Payments</option>
              <option value="account">Account Issues</option>
              <option value="technical">Technical Support</option>
              <option value="project">Project Management</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0034 16.8C11.3034 16.8 10.6034 16.53 10.0734 16L3.55344 9.48C3.26344 9.19 3.26344 8.71 3.55344 8.42C3.84344 8.13 4.32344 8.13 4.61344 8.42L11.1334 14.94C11.6134 15.42 12.3934 15.42 12.8734 14.94L19.3934 8.42C19.6834 8.13 20.1634 8.13 20.4534 8.42C20.7434 8.71 20.7434 9.19 20.4534 9.48L13.9334 16C13.4034 16.53 12.7034 16.8 12.0034 16.8Z" fill="#737373"/>
              </svg>
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-1">
            <textarea
              placeholder="Let us know what you need help with…"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Attachments (optional)</label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg width="46" height="36" viewBox="0 0 46 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_5_31450)">
                      <path d="M10.625 33.75C5.03516 33.75 0.5 29.2148 0.5 23.625C0.5 19.2094 3.32656 15.4547 7.26406 14.0695C7.25703 13.8797 7.25 13.6898 7.25 13.5C7.25 7.28437 12.2844 2.25 18.5 2.25C22.6695 2.25 26.3047 4.51406 28.2523 7.88906C29.3211 7.17188 30.6148 6.75 32 6.75C35.7266 6.75 38.75 9.77344 38.75 13.5C38.75 14.3578 38.5883 15.1734 38.3 15.9328C42.4062 16.7625 45.5 20.3977 45.5 24.75C45.5 29.7211 41.4711 33.75 36.5 33.75H10.625ZM16.1797 18.4922C15.5188 19.1531 15.5188 20.2219 16.1797 20.8758C16.8406 21.5297 17.9094 21.5367 18.5633 20.8758L21.3055 18.1336V27.5625C21.3055 28.4977 22.0578 29.25 22.993 29.25C23.9281 29.25 24.6805 28.4977 24.6805 27.5625V18.1336L27.4227 20.8758C28.0836 21.5367 29.1523 21.5367 29.8062 20.8758C30.4602 20.2148 30.4672 19.1461 29.8062 18.4922L24.1812 12.8672C23.5203 12.2063 22.4516 12.2063 21.7977 12.8672L16.1727 18.4922H16.1797Z" fill="#9CA3AF"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_5_31450">
                        <path d="M0.5 0H45.5V36H0.5V0Z" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-base text-black font-medium">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-gray-600 mt-1">Supports JPG, PNG, GIF, MP4 (max 50MB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="inline-flex items-center gap-3 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5385 1.53846C11.5385 0.6875 10.851 0 10 0C9.14904 0 8.46154 0.6875 8.46154 1.53846V8.46154H1.53846C0.6875 8.46154 0 9.14904 0 10C0 10.851 0.6875 11.5385 1.53846 11.5385H8.46154V18.4615C8.46154 19.3125 9.14904 20 10 20C10.851 20 11.5385 19.3125 11.5385 18.4615V11.5385H18.4615C19.3125 11.5385 20 10.851 20 10C20 9.14904 19.3125 8.46154 18.4615 8.46154H11.5385V1.53846Z" fill="white"/>
                  </svg>
                  Upload Files
                </button>
              </div>
            </div>

            <input
              id="file-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.mp4"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            {/* Show uploaded files */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded files:</p>
                <div className="space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.92761 4.96667L13.4443 2.45834C16.8193 1.33334 18.6526 3.17501 17.5359 6.55001L15.0276 14.0667C13.3443 19.125 10.5776 19.125 8.89427 14.0667L8.15261 11.8333L5.91927 11.0917C0.869271 9.41667 0.869271 6.65834 5.92761 4.96667Z" fill="white"/>
              <path d="M10.1016 9.69167L13.2766 6.50833L10.1016 9.69167Z" fill="white"/>
              <path d="M10.0995 10.3167C9.94115 10.3167 9.78281 10.2583 9.65781 10.1333C9.41615 9.89166 9.41615 9.49166 9.65781 9.24999L12.8245 6.06666C13.0661 5.82499 13.4661 5.82499 13.7078 6.06666C13.9495 6.30832 13.9495 6.70832 13.7078 6.94999L10.5411 10.1333C10.4161 10.25 10.2578 10.3167 10.0995 10.3167Z" fill="white"/>
            </svg>
            Submit
          </button>
        </form>
      </div>

      {/* Other Help Options */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Other Help Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Chat */}
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32.5" r="32" fill="#D1FAE5"/>
                  <path d="M32.0014 42.8088C39.5954 42.8088 45.75 37.8088 45.75 31.638C45.75 25.4673 39.5954 20.4673 32.0014 20.4673C24.4074 20.4673 18.2528 25.4673 18.2528 31.638C18.2528 34.0601 19.2034 36.2997 20.8145 38.131C20.7125 39.4468 20.2023 40.6176 19.6652 41.5091C19.3699 42.0032 19.0691 42.4006 18.8489 42.6691C18.7361 42.8034 18.6502 42.9054 18.5858 42.9753C18.5535 43.0075 18.5321 43.0343 18.5159 43.0504L18.4998 43.0666C18.2528 43.3136 18.183 43.6788 18.3172 44.001C18.4515 44.3233 18.763 44.5327 19.1121 44.5327C20.6534 44.5327 22.2055 44.0547 23.4944 43.4962C24.7243 42.9591 25.7716 42.32 26.4107 41.8528C28.1185 42.4704 30.0089 42.8141 32.0014 42.8141V42.8088ZM25.1271 29.9195C25.5829 29.9195 26.02 30.1005 26.3423 30.4228C26.6646 30.7451 26.8457 31.1822 26.8457 31.638C26.8457 32.0938 26.6646 32.5309 26.3423 32.8532C26.02 33.1755 25.5829 33.3566 25.1271 33.3566C24.6713 33.3566 24.2342 33.1755 23.9119 32.8532C23.5896 32.5309 23.4085 32.0938 23.4085 31.638C23.4085 31.1822 23.5896 30.7451 23.9119 30.4228C24.2342 30.1005 24.6713 29.9195 25.1271 29.9195ZM32.0014 29.9195C32.4572 29.9195 32.8943 30.1005 33.2166 30.4228C33.5389 30.7451 33.72 31.1822 33.72 31.638C33.72 32.0938 33.5389 32.5309 33.2166 32.8532C32.8943 33.1755 32.4572 33.3566 32.0014 33.3566C31.5456 33.3566 31.1085 33.1755 30.7862 32.8532C30.4639 32.5309 30.2828 32.0938 30.2828 31.638C30.2828 31.1822 30.4639 30.7451 30.7862 30.4228C31.1085 30.1005 31.5456 29.9195 32.0014 29.9195ZM37.1571 31.638C37.1571 31.1822 37.3382 30.7451 37.6605 30.4228C37.9828 30.1005 38.4199 29.9195 38.8757 29.9195C39.3315 29.9195 39.7686 30.1005 40.0909 30.4228C40.4132 30.7451 40.5943 31.1822 40.5943 31.638C40.5943 32.0938 40.4132 32.5309 40.0909 32.8532C39.7686 33.1755 39.3315 33.3566 38.8757 33.3566C38.4199 33.3566 37.9828 33.1755 37.6605 32.8532C37.3382 32.5309 37.1571 32.0938 37.1571 31.638Z" fill="#10B981"/>
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Get immediate assistance from our support team</p>
                <button className="text-green-600 font-medium text-sm flex items-center gap-2 hover:text-green-700">
                  Start Chat
                  <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.9329 20.5L9.18367 18.5922L15.2575 11.8934H0V9.10665H15.2575L9.18367 2.41854L10.9329 0.5L20 10.5L10.9329 20.5Z" fill="#10B981"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="28" height="33" viewBox="0 0 28 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_5_31469)">
                    <path d="M14.0029 9.44085C10.0989 9.44085 6.94992 12.5898 6.94992 16.4939C6.94992 20.3979 10.0989 23.5469 14.0029 23.5469C17.9069 23.5469 21.0559 20.3979 21.0559 16.4939C21.0559 12.5898 17.9069 9.44085 14.0029 9.44085ZM14.0029 21.0792C11.4801 21.0792 9.41755 19.0229 9.41755 16.4939C9.41755 13.9648 11.4739 11.9085 14.0029 11.9085C16.5319 11.9085 18.5883 13.9648 18.5883 16.4939C18.5883 19.0229 16.5258 21.0792 14.0029 21.0792ZM22.9895 9.15234C22.9895 10.067 22.2529 10.7974 21.3444 10.7974C20.4298 10.7974 19.6994 10.0608 19.6994 9.15234C19.6994 8.24386 20.436 7.50725 21.3444 7.50725C22.2529 7.50725 22.9895 8.24386 22.9895 9.15234ZM27.6609 10.822C27.5565 8.6183 27.0532 6.66629 25.4388 5.05804C23.8305 3.44978 21.8785 2.94643 19.6748 2.83594C17.4036 2.70703 10.5961 2.70703 8.32492 2.83594C6.12737 2.94029 4.17536 3.44364 2.56097 5.0519C0.946568 6.66016 0.449358 8.61217 0.338867 10.8158C0.209961 13.0871 0.209961 19.8945 0.338867 22.1657C0.44322 24.3694 0.946568 26.3214 2.56097 27.9297C4.17536 29.5379 6.12123 30.0413 8.32492 30.1518C10.5961 30.2807 17.4036 30.2807 19.6748 30.1518C21.8785 30.0474 23.8305 29.5441 25.4388 27.9297C27.047 26.3214 27.5504 24.3694 27.6609 22.1657C27.7898 19.8945 27.7898 13.0932 27.6609 10.822ZM24.7267 24.6027C24.2479 25.8058 23.321 26.7327 22.1117 27.2176C20.3009 27.9358 16.004 27.7701 14.0029 27.7701C12.0018 27.7701 7.6988 27.9297 5.89411 27.2176C4.69099 26.7388 3.76409 25.8119 3.27916 24.6027C2.56097 22.7919 2.7267 18.495 2.7267 16.4939C2.7267 14.4927 2.5671 10.1897 3.27916 8.38505C3.75795 7.18192 4.68485 6.25502 5.89411 5.77009C7.70494 5.0519 12.0018 5.21763 14.0029 5.21763C16.004 5.21763 20.3071 5.05804 22.1117 5.77009C23.3149 6.24888 24.2418 7.17578 24.7267 8.38505C25.4449 10.1959 25.2792 14.4927 25.2792 16.4939C25.2792 18.495 25.4449 22.798 24.7267 24.6027Z" fill="#10B981"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_5_31469">
                      <path d="M0.25 0.785706H27.75V32.2143H0.25V0.785706Z" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
                <p className="text-sm text-gray-600">DM us on Instagram for quick responses</p>
                <button className="text-green-600 font-medium text-sm flex items-center gap-2 hover:text-green-700">
                  @Your Platform
                  <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.9329 20.5L9.18367 18.5922L15.2575 11.8934H0V9.10665H15.2575L9.18367 2.41854L10.9329 0.5L20 10.5L10.9329 20.5Z" fill="#10B981"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
