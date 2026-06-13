import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import meImage from "../assets/me.jpeg";
import groupImage from "../assets/group.jpeg";
import catImage from "../assets/cat.jpeg";

const Home = () => {
  const shouldReduceMotion = useReducedMotion();

  // One entrance, 600ms, ease-out-expo. Disabled under reduced-motion.
  const fadeIn = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  return (
    <motion.div {...fadeIn} className="container-prose">
      {/* ----- Hero ------------------------------------------------------- */}
      <section className="pt-8 sm:pt-12 md:pt-16">
        <h1 className="font-serif text-display font-semibold text-balance">
          Samuel Steinmetz
        </h1>
        <p className="mt-5 text-ink-soft text-balance max-w-measure">
          Computer science and finance at Northeastern University, graduating
          2026.
        </p>
      </section>

      {/* ----- Intro + currently ----------------------------------------- */}
      <section className="mt-12 md:mt-16">
        <div className="md:flex md:items-start md:gap-10">
          <div className="md:flex-1">
            <p className="text-pretty">
              I&rsquo;m in my final year at Northeastern, studying computer
              science and finance. My favorite parts of software are the seams
              — APIs, integrations, the places where one team&rsquo;s
              assumptions meet another&rsquo;s. Most days I&rsquo;m writing
              TypeScript or Python.
            </p>
          </div>
          <figure className="mt-6 md:mt-1 md:w-44 md:flex-shrink-0">
            <span className="photo-frame">
              <img
                src={meImage}
                alt="Samuel Steinmetz"
                loading="eager"
                decoding="async"
              />
            </span>
          </figure>
        </div>

        <p className="mt-10 text-ink-soft">Right now:</p>
        <ul className="list-notebook mt-2">
          <li>
            Software engineering intern at Ironclad, working on AI.
          </li>
          <li>
            Reading about Model Context Protocol and what it means for how
            applications get written.
          </li>
        </ul>
      </section>

      <hr />

      {/* ----- Selected work --------------------------------------------- */}
      <section aria-labelledby="selected-work-heading">
        <h2
          id="selected-work-heading"
          className="font-serif text-h2 font-medium text-balance"
        >
          Selected work
        </h2>

        <div className="mt-8 space-y-12">
          <article>
            <h3 className="font-sans text-h3 font-semibold">DiscountBytes</h3>
            <p className="mt-2 text-pretty">
              Co-built a restaurant menu that prices itself: foot-traffic
              cameras feed a vision model, the model feeds the menu, the menu
              re-prints with new numbers. Won MLH and HackBeanPot awards.
            </p>
            <figure className="mt-5">
              <span className="photo-frame max-w-md">
                <img
                  src={groupImage}
                  alt="The HackBeanPot 2024 team at the closing ceremony."
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <figcaption className="mt-2 font-mono text-mono text-ink-soft">
                The team at HackBeanPot 2024.
              </figcaption>
            </figure>
            <p className="mt-4 font-mono text-mono text-ink-soft">
              2024 &middot; Python, Flask, React, Firebase &middot; team of 4
            </p>
          </article>

          <article>
            <h3 className="font-sans text-h3 font-semibold">Twitter Asks</h3>
            <p className="mt-2 text-pretty">
              A pipeline that pulled questions out of Twitter and answered them
              with a fine-tuned GPT. Threaded responses generated async so the
              page didn&rsquo;t block while the model thought. Built in 36
              hours; first place at the Whitehall Hackathon.
            </p>
            <p className="mt-3 font-mono text-mono text-ink-soft">
              2023 &middot; Python, Flask, Tweepy, OpenAI &middot; team of 4
            </p>
          </article>
        </div>

        <p className="mt-10">
          <Link to="/projects">more on the projects page &rarr;</Link>
        </p>
      </section>

      <hr />

      {/* ----- Experience ------------------------------------------------- */}
      <section aria-labelledby="experience-heading">
        <h2
          id="experience-heading"
          className="font-serif text-h2 font-medium text-balance"
        >
          Experience
        </h2>

        <ul className="mt-8 space-y-6">
          <li>
            <p>
              <span className="font-medium">
                Software Engineering Intern
              </span>{" "}
              <span className="text-ink-soft">&middot; Ironclad</span>
            </p>
            <p className="mt-1 font-mono text-mono text-ink-soft">
              Summer 2026 &middot; present
            </p>
          </li>

          <li>
            <p>
              <span className="font-medium">Software Developer Co-op</span>{" "}
              <span className="text-ink-soft">&middot; MHCPS</span>
            </p>
            <p className="mt-1 font-mono text-mono text-ink-soft">
              Jan – May 2025
            </p>
            <p className="mt-2 text-ink-soft text-pretty">
              Built a campus parking application and migrated internal
              microservices from on-prem to Azure.
            </p>
          </li>

          <li>
            <p>
              <span className="font-medium">
                Technical Support Engineer Co-op
              </span>{" "}
              <span className="text-ink-soft">&middot; Panorama Education</span>
            </p>
            <p className="mt-1 font-mono text-mono text-ink-soft">
              Jan – Dec 2024
            </p>
            <p className="mt-2 text-ink-soft text-pretty">
              Worked through ten thousand customer-facing tickets and shipped
              a survey-audit tool with UX and engineering.
            </p>
          </li>

          <li>
            <p>
              <span className="font-medium">
                Teaching Assistant, Object-Oriented Development
              </span>{" "}
              <span className="text-ink-soft">
                &middot; Northeastern University
              </span>
            </p>
            <p className="mt-1 font-mono text-mono text-ink-soft">
              Sep – Dec 2024
            </p>
          </li>
        </ul>
      </section>

      <hr />

      {/* ----- Cat tax (the sign-off) ------------------------------------- */}
      <aside className="mb-10">
        <figure className="max-w-xs">
          <span className="photo-frame">
            <img
              src={catImage}
              alt="One of Sam's cats."
              loading="lazy"
              decoding="async"
            />
          </span>
          <figcaption className="mt-2 font-mono text-mono text-ink-soft">
            Cat tax.
          </figcaption>
        </figure>
      </aside>

      {/* ----- Contact line ---------------------------------------------- */}
      <footer className="pb-4">
        <p className="font-mono text-mono text-ink-soft">
          <a href="mailto:samhsteinmetz@gmail.com">
            samhsteinmetz@gmail.com
          </a>
          {" · "}
          <a
            href="https://github.com/samhsteinmetz"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/samuel-heron-steinmetz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
        </p>
      </footer>
    </motion.div>
  );
};

export default Home;
