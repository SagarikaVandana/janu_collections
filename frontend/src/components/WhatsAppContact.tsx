import React from 'react';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

interface WhatsAppContactProps {
  variant?: 'floating' | 'inline' | 'card';
  showAllContacts?: boolean;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ 
  variant = 'floating', 
  showAllContacts = false 
}) => {
  const whatsappUrl = "https://wa.me/919391235258?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products%20at%20Janu%20Collection%21";
  const phoneNumber = "+91 9391235258";
  const email = "janucollectionvizag@gmail.com";
  const address = "MADHURAWADA, VISAKHAPATNAM, ANDHRA PRADESH, PIN 530041";

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center space-x-2"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="hidden sm:inline font-medium">WhatsApp</span>
        </a>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary-500" />
            <span className="text-gray-700">{phoneNumber}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-primary-500" />
            <a href={`mailto:${email}`} className="text-gray-700 hover:text-primary-600">
              {email}
            </a>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary-500 mt-1" />
            <span className="text-gray-700 text-sm">{address}</span>
          </div>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className="flex flex-wrap items-center space-x-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span>WhatsApp</span>
      </a>
      
      {showAllContacts && (
        <>
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>
        </>
      )}
    </div>
  );
};

export default WhatsAppContact; 