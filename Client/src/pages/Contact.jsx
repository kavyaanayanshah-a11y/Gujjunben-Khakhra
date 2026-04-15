import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending (replace with actual API call later)
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-amber-100 rounded-full mb-4">
            <span className="text-4xl">📞</span>
          </div>
          <h1 className="text-4xl font-bold text-amber-700 mb-2">Contact Us</h1>
          <p className="text-stone-500">We’d love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info - Light card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-bold text-amber-700 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <span className="text-stone-600">Surat, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <a href="mailto:contact@gujjubenkhakhra.com" className="text-amber-600 hover:text-amber-700 hover:underline">
                  contact@gujjubenkhakhra.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <a href="tel:+919876543210" className="text-amber-600 hover:text-amber-700 hover:underline">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <span className="text-stone-600">Mon–Sat: 10 AM – 7 PM</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-amber-100">
              <h3 className="font-semibold text-stone-700 mb-2">Follow Us</h3>
              <div className="flex gap-4 text-2xl text-stone-500">
                <a href="#" className="hover:text-amber-500 transition">📘</a>
                <a href="#" className="hover:text-amber-500 transition">📸</a>
                <a href="#" className="hover:text-amber-500 transition">🐦</a>
              </div>
            </div>
          </div>

          {/* Contact Form - Light card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-bold text-amber-700 mb-4">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/90 text-stone-700 placeholder-stone-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/90 text-stone-700 placeholder-stone-400"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/90 text-stone-700 placeholder-stone-400"
              ></textarea>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-400 text-stone-800 py-3 rounded-lg font-semibold hover:bg-amber-500 transition shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;