// src/pages/Contact.tsx
import { useState, FormEvent } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Add form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Get in Touch</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send Message
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Connect With Me</h2>
        <div className="flex space-x-4">
          <a href="https://github.com/yourusername" className="text-gray-600 hover:text-black">
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" className="text-gray-600 hover:text-blue-600">
            LinkedIn
          </a>
          <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-indigo-600">
            Email
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact