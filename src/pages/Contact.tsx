import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
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

      setFormData({ name: "", email: "", message: "" });
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an issue submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClasses =
    "block w-full bg-transparent border-0 border-b border-rule text-ink " +
    "px-0 py-3 focus:border-accent focus:ring-0 focus:outline-none " +
    "placeholder:text-ink-muted transition-colors duration-100";

  const labelClasses = "block text-small text-ink-soft mb-1";

  return (
    <div className="container-prose">
      <section className="pt-8 sm:pt-12 md:pt-16">
        <h1 className="font-serif text-display font-semibold text-balance">
          Get in touch.
        </h1>
        <p className="mt-5 text-ink-soft text-balance max-w-measure">
          For roles, projects, or anything worth a sentence or two. I usually
          reply within a day.
        </p>
      </section>

      <section className="mt-10 md:mt-12">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={fieldClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={fieldClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className={labelClasses}>
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className={fieldClasses + " resize-y"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={
              isSubmitting
                ? "inline-block border border-rule text-ink-muted px-5 py-3 text-small font-medium cursor-not-allowed"
                : "inline-block border border-ink text-ink px-5 py-3 text-small font-medium " +
                  "hover:bg-ink hover:text-paper transition-colors duration-100 " +
                  "focus:outline-none focus-visible:outline focus-visible:outline-2 " +
                  "focus-visible:outline-offset-2 focus-visible:outline-accent"
            }
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      <hr />

      <section aria-labelledby="connect-heading" className="pb-4">
        <h2
          id="connect-heading"
          className="font-serif text-h2 font-medium text-balance"
        >
          Connect With Me
        </h2>
        <ul className="mt-6 space-y-4">
          <li className="flex items-center gap-3">
            <svg
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
              viewBox="0 0 15 15"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="https://github.com/samhsteinmetz"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/samhsteinmetz
            </a>
          </li>

          <li className="flex items-center gap-3">
            <svg
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
              viewBox="0 0 448 512"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100.28 448H7.4V148.9h92.88zM53.41 108C24.37 108
                 0 83.6 0 53.83 0 24.06 24.37
                 0 54.11 0c29.74 0 54.12 24.06
                 54.12 53.83S83.85 108 54.11 108zM447.1
                 448h-92.68V302.4c0-34.7-1.25-79.3-48.27-79.3
                 -48.3 0-55.7 37.8-55.7 76.9v148h-92.75V148.9h89.07v40.8h1.3c12.4-23.5
                 42.54-48.2 87.53-48.2 93.62 0
                 110.8 61.6 110.8 141.5V448z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="https://linkedin.com/in/samuel-heron-steinmetz"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/samuel-heron-steinmetz
            </a>
          </li>

          <li className="flex items-center gap-3">
            <svg
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
              viewBox="0 0 512 512"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M464 64c26.5 0 48 21.5 48 48v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48zM48 96c-8.8 0-16 7.2-16 16v37.4l199.6 152.4c8.5 6.5 20.3 6.5 28.8 0L460 149.4V112c0-8.8-7.2-16-16-16zM32 188.6V400c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16V188.6L279.8 327c-13.2 10.1-31.4 10.1-44.6 0z" />
            </svg>
            <a href="mailto:samhsteinmetz@gmail.com">samhsteinmetz@gmail.com</a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Contact;
