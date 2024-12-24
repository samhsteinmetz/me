import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Add the "createdAt" field to the form data
    const dataToSubmit = {
      ...formData,
      createdAt: new Date().toISOString(), // Format the current date
    };

    try {
      setIsSubmitting(true); // Set submission state
      const response = await fetch(
        "https://673dfa030118dbfe86099e55.mockapi.io/resume/v1/Contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      alert("Thank you for reaching out! Your message has been sent.");

      // Optionally navigate to another page or reset the form
      setFormData({ name: "", email: "", message: "" });
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an issue submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 text-green-500">
      <h1 className="text-4xl font-bold mb-8">Get in Touch With Me!</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-green-500">
          <label htmlFor="name" className="block text-sm font-medium text-gray-500">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="text-green-500">
          <label htmlFor="email" className="block text-sm font-medium text-gray-500">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="text-green-500">
          <label htmlFor="message" className="block text-sm font-medium text-gray-500">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting} // Disable the button while submitting
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Connect With Me</h2>
        <div className="flex space-x-4">
          <a href="https://github.com/samhsteinmetz" className="text-gray-600 hover:text-black">
          <svg
      className="w-5"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
    <span
      className="absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-10 duration-700"
    ></span>
          </a>
          <a href="https://linkedin.com/in/samuel-heron-steinmetz" className="text-gray-600 hover:text-blue-600">
          <span className="icon">
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="svg">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.41 108C24.37 108 
                               0 83.6 0 53.83 0 24.06 24.37 
                               0 54.11 0c29.74 0 54.12 24.06 
                               54.12 53.83S83.85 108 54.11 108zM447.1 
                               448h-92.68V302.4c0-34.7-1.25-79.3-48.27-79.3 
                               -48.3 0-55.7 37.8-55.7 76.9v148h-92.75V148.9h89.07v40.8h1.3c12.4-23.5 
                               42.54-48.2 87.53-48.2 93.62 0 
                               110.8 61.6 110.8 141.5V448z"
                               fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"/>
                    </svg>
                  </span>
          </a>
          <a href="mailto:samhsteinmetz@gmail.com" className="text-gray-600 hover:text-indigo-600">
            Email
          </a>
        </div>
      </div>
    </div>


  );
};

export default Contact;
