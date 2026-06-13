// src/pages/About.tsx
import currImage from "../assets/cat.jpeg";

const About = () => {
  const longText =
    "I'm Samuel Heron Steinmetz — Sam to most people. I'm finishing a BS in computer science and finance at Northeastern, graduating in 2027. Right now I'm interning at Ironclad on the AI team. I like software systems whose behavior I can predict, math that has a real answer, and projects you can actually ship.";

  return (
    <div className="container-prose">
      <section className="pt-8 sm:pt-12 md:pt-16">
        <h1 className="font-serif text-display font-semibold text-balance">
          About
        </h1>
      </section>

      <section className="mt-12 md:mt-16">
        <p className="text-pretty">{longText}</p>

        <figure className="mt-10">
          <span className="photo-frame max-w-md">
            <img
              src={currImage}
              alt="One of Sam's cats."
              loading="lazy"
              decoding="async"
            />
          </span>
        </figure>

        <p className="mt-10 text-pretty">
          In my free time I like hanging out with my cats, running, playing
          basketball, poker, and trying new food. You can usually find me in
          my school&rsquo;s sauna in the winter and on a beach (or at least
          in the sun) in the summer. I&rsquo;ve been learning how to ski and
          would consider myself pretty decent. Besides the hobbies, I enjoy
          programming and taking on projects — some of my personal projects
          end up unfinished; I just tell myself I&rsquo;m passionate about
          the next thing. Lately I&rsquo;ve been reading a lot about Model
          Context Protocol and how applications are starting to write
          themselves. If you want to talk about any of that, the links below
          work.
        </p>
      </section>

      <hr />

      {/* ----- Socials --------------------------------------------------- */}
      <section aria-labelledby="socials-heading">
        <h2
          id="socials-heading"
          className="font-serif text-h2 font-medium text-balance"
        >
          Socials
        </h2>

        <ul className="mt-6 space-y-4">
          <li className="flex items-center gap-3">
            <svg
              viewBox="0 0 496 512"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
            >
              <path
                d="M165.9 397.4c0 2-2.3 3.4-5.2 3.4-2.9
                         0-5.2-1.4-5.2-3.4 0-2 2.3-3.4 5.2-3.4
                         2.9 0 5.2 1.4 5.2 3.4zm-27.5-10.9c-.7
                         1.5-2.5 2-4 1.3-1.7-.7-2.4-2.5-1.7-4 .7-1.5
                         2.5-2 4-1.3 1.7.7 2.4 2.5 1.7 4zm20.9-2c-1.8
                         1.3-4.3.4-5.4-2-1.1-2.4-.1-5.2 1.7-6.5 1.8-1.3
                         4.3-.4 5.4 2 1.1 2.4.1 5.2-1.7 6.5zm36.5
                         2.2c-.9 1.7-3.2 2.7-5
                         1.8-1.9-.9-2.7-3.2-1.8-5 .9-1.8 3.2-2.7
                         5-1.8 1.9.8 2.7 3.1 1.8 4.9zm-11.8-13.7c-1.8
                         .8-3.9-.2-4.7-2-.8-1.8.2-3.9 2-4.7
                         1.8-.8 3.9.2 4.7 2 .8 1.8-.2 3.9-2
                         4.7zm34.5 1.7c-.5 2-2.9
                         3.2-5.1 2.6-2.2-.7-3.6-2.9-3-4.9 .5-2
                         2.9-3.2 5.1-2.6 2.1.7 3.5 2.9 3
                         4.9zm-22-5.9c-2.1 1.1-4.6
                         .1-5.7-2-1.1-2.1-.1-4.6 2-5.7 2.1-1.1
                         4.6-.1 5.7 2 1.1 2.1.1 4.6-2
                         5.7zm6.8-13.2c-2.1 1.5-5.2
                         .4-6.6-1.8-1.5-2.1-.4-5.2
                         1.8-6.6 2.1-1.5 5.2-.4
                         6.6 1.8 1.5 2.1.4 5.2-1.8
                         6.6zM248 8C111 8 0 119 0
                         256c0 110 71.3 203.1 170
                         236.2 12.4 2.3 17-5.4
                         17-11.9 0-5.9-.2-25.5-.2-46.4
                         -64.9 14.1-83.5-28.1-83.5-28.1
                         -11.3-28.7-27.6-36.3-27.6-36.3
                         -22.6-15.4 1.7-15 1.7-15
                         25 1.7 38.1 25.6 38.1 25.6
                         22.2 38 58.4 27 72.7 20.7
                         2.2-16 8.6-27 15.6-33.2
                         -51.8-5.9-106.4-25.9-106.4-115.4
                         0-25.5 9.1-46.4 24.1-62.8
                         -2.4-6-10.4-30.4 2.3-63.4 0 0
                         19.5-6.2 64 23.8 18.5-5.1 38.2-7.6
                         57.8-7.7 19.6.1 39.3 2.6
                         57.8 7.7 44.5-30 64-23.8 64-23.8
                         12.7 33 4.7 57.4 2.3 63.4
                         15 16.4 24.1 37.3 24.1 62.8
                         0 89.7-54.7 109.4-106.7 115.2
                         8.9 7.7 16.9 22.9 16.9 46.2
                         0 33.4-.3 60.4-.3 68.6 0 6.6
                         4.3 14.3 17.1 11.8C424.7 459.1
                         496 366 496 256 496 119 385
                         8 248 8z"
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
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
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
              />
            </svg>
            <a
              href="https://www.linkedin.com/in/samuel-heron-steinmetz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/samuel-heron-steinmetz
            </a>
          </li>

          <li className="flex items-center gap-3">
            <svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-4 w-4 fill-current flex-shrink-0 text-ink-soft"
            >
              <title>Email</title>
              <path d="M464 64c26.5 0 48 21.5 48 48v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48zM48 96c-8.8 0-16 7.2-16 16v37.4l199.6 152.4c8.5 6.5 20.3 6.5 28.8 0L460 149.4V112c0-8.8-7.2-16-16-16zM32 188.6V400c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16V188.6L279.8 327c-13.2 10.1-31.4 10.1-44.6 0z" />
            </svg>
            <a href="mailto:samhsteinmetz@gmail.com">samhsteinmetz@gmail.com</a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;
