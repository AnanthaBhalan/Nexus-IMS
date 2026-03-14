import React, { useState } from 'react';

const FormValidationTemplate = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully! Connect to API here.");
      // Call your backend API here
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-noise font-sans text-white flex items-center justify-center p-6 selection:bg-[#ccff00] selection:text-black">
      <div className="max-w-md w-full mx-auto bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Secure Data Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
            <input
              type="text"
              className={`w-full px-4 py-3 bg-[#050505] border rounded-lg text-white placeholder-neutral-500 focus:ring-1 transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ccff00] focus:ring-[#ccff00]'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
            <input
              type="email"
              className={`w-full px-4 py-3 bg-[#050505] border rounded-lg text-white placeholder-neutral-500 focus:ring-1 transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#ccff00] focus:ring-[#ccff00]'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <button type="submit" className="w-full bg-[#ccff00] text-black py-3 px-4 rounded-full font-semibold hover:bg-white transition-colors duration-300">
            Submit Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormValidationTemplate;
