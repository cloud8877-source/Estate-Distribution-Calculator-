
import React, { useState } from 'react';
import { Dialog } from './ui/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailCaptureModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted. In a real app, this would trigger an API call.');
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
         onClose();
         setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email!</h2>
          <p className="text-gray-600">Your personalized estate plan analysis is on its way.</p>
          <p className="text-sm text-gray-500 mt-4">This window will close shortly.</p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <h2 className="text-2xl font-bold">Get Your Free Estate Plan Analysis</h2>
        <p className="text-gray-600 mt-2">Receive a detailed PDF report with:</p>

        <ul className="my-4 space-y-2 text-gray-700">
            {['Complete inheritance breakdown', 'Visual family tree distribution', 'Personalized recommendations', 'Cost comparison: With vs. Without planning'].map(item => (
                <li key={item} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>{item}</span>
                </li>
            ))}
        </ul>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name *" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="email" placeholder="Email Address *" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="tel" placeholder="Phone Number (Optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            
            <div className="flex items-start gap-2">
                <input type="checkbox" id="consent" required className="mt-1"/>
                <label htmlFor="consent" className="text-sm text-gray-600">I agree to receive my estate plan analysis and occasional estate planning tips from EstateWealthMY. *</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400" disabled={isSubmitting}>
                {isSubmitting ? 'Generating Your Report...' : 'Get My Free Analysis →'}
            </button>
            <p className="text-xs text-center text-gray-500">Your information is secure. We respect your privacy.</p>
        </form>
    </Dialog>
  );
}
