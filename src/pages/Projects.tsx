// src/pages/Projects.tsx
import React from "react";
import projectImage from "../assets/stackchatterflow.jpeg";
import groupImage from "../assets/group.jpeg";
import GitHub from "../components/github.tsx";

const Projects: React.FC = () => {
  return (
    <div className="container-prose">
      <section className="pt-8 sm:pt-12 md:pt-16">
        <h1 className="font-serif text-display font-semibold text-balance">
          Projects
        </h1>
      </section>

      {/* ----- FakeStackOverflow ----------------------------------------- */}
      <section className="mt-12 md:mt-16">
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-h2 font-medium text-balance">
            FakeStackOverflow: Real-Time Messaging System &amp; More
          </h2>
          <GitHub url="https://github.com/neu-cs4530/fall24-team-project-fall24-team-project-group-805/releases/tag/final-submission" />
        </header>
        <p className="mt-2 font-mono text-mono text-ink-soft">
          Fall 2024 &middot; TypeScript, MongoDB, React, Express &middot; CS
          4530 team project
        </p>

        <figure className="mt-6">
          <span className="photo-frame">
            <img
              src={projectImage}
              alt="FakeStackOverflow release poster — feature summary."
              loading="lazy"
              decoding="async"
              className="max-w-full"
            />
          </span>
          <figcaption className="mt-2 font-mono text-mono text-ink-soft">
            Above is a poster of all the features we implemented in
            FakeChatterflow.
          </figcaption>
        </figure>

        <p className="mt-6 font-mono text-mono text-ink-soft">
          friends_service.ts
        </p>
        <pre className="mt-2 bg-paper-edge text-ink p-4 overflow-auto font-mono text-code leading-relaxed">
          <code>
            {"export const addFriendsToListOfProfiles = async (\n" +
              "  friendUsername: string,\n" +
              "  thisUsername: string,\n" +
              "): Promise<void> => {\n" +
              "  try {\n" +
              "    const userProfile = await ProfileModel.findOne({ username: thisUsername }).exec();\n" +
              "    const friendProfile = await ProfileModel.findOne({ username: friendUsername }).exec();\n" +
              "\n" +
              "    if (!userProfile || !friendProfile) {\n" +
              "      return;\n" +
              "    }\n" +
              "\n" +
              "    await ProfileModel.findOneAndUpdate(\n" +
              "      { _id: userProfile?._id },\n" +
              "      { $addToSet: { friends: friendProfile } },\n" +
              "      { new: true },\n" +
              "    );\n" +
              "\n" +
              "    // Update the friend's friends list to include the user\n" +
              "    await ProfileModel.findOneAndUpdate(\n" +
              "      { _id: friendProfile?._id },\n" +
              "      { $addToSet: { friends: userProfile } },\n" +
              "      { new: true },\n" +
              "    );\n" +
              "  } catch (error) {\n" +
              "    console.error('error updating friends ');\n" +
              "  }\n" +
              "};\n"}
          </code>
        </pre>
      </section>

      <hr />

      {/* ----- HackBeanPot 2024 DiscountBytes ----------------------------- */}
      <section>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-h2 font-medium text-balance">
            HackBeanPot 2024 Award Winner: DiscountBytes
          </h2>
          <GitHub url="https://github.com/ShashSunkum/DiscountBytes/tree/main" />
        </header>
        <p className="mt-2 font-mono text-mono text-ink-soft">
          Spring 2024 &middot; Roboflow, Python, Flask, React, Firebase
          &middot; team of 4
        </p>

        <figure className="mt-6">
          <span className="photo-frame max-w-md">
            <img
              src={groupImage}
              alt="Our HackBeanPot 2024 team."
              loading="lazy"
              decoding="async"
            />
          </span>
          <figcaption className="mt-2 font-mono text-mono text-ink-soft">
            Our team at HackBeanPot 2024.
          </figcaption>
        </figure>

        <ul className="list-notebook mt-6 space-y-2">
          <li>
            <span className="font-medium">Technologies:</span> Roboflow,
            Supervision (Python libs), Flask, React, Firebase
          </li>
          <li>
            Co-developed a web application for restaurants that dynamically
            adjusts menu pricing in real-time based on customer traffic and
            includes secure staff check-ins via facial recognition.
          </li>
          <li>
            Implemented dynamic food pricing and staff allocation features
            using customer data analytics.
          </li>
          <li>
            Deployed and demoed at HackBeanPot 2024, winning MLH and
            HackBeanPot awards and gaining insights into diverse tech stacks.
          </li>
        </ul>

        <p className="mt-6 font-mono text-mono text-ink-soft">head_count.py</p>
        <pre className="mt-2 bg-paper-edge text-ink p-4 overflow-auto font-mono text-code leading-relaxed">
          <code>
            {"def update_people_count_callback(people_count):\n" +
              "    # Update the people count in the database\n" +
              "    conn = sqlite3.connect('database.db')\n" +
              "    c = conn.cursor()\n" +
              "    # Assuming you have a way to identify the correct restaurant entry to update\n" +
              '    c.execute("UPDATE restaurants SET people_count = ? WHERE name = ?", (people_count, "ExampleRestaurant"))\n' +
              "    conn.commit()\n" +
              '    print(f"Updated count to {people_count} in the database.")  # Debug print\n' +
              "    conn.close()\n"}
          </code>
        </pre>
      </section>

      <hr />

      {/* ----- Team Jobs -------------------------------------------------- */}
      <section>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-h2 font-medium text-balance">
            Full Stack Database Design Project: Team Jobs
          </h2>
          <GitHub url="https://github.com/samhsteinmetz/23f-project-boilerplate-teamJobs" />
        </header>
        <p className="mt-2 font-mono text-mono text-ink-soft">
          Fall 2023 &middot; Flask, MySQL, Appsmith, Docker &middot; class
          project
        </p>

        <ul className="list-notebook mt-6 space-y-2">
          <li>
            <span className="font-medium">Technologies:</span> Flask (CRUD
            RESTful APIs), Appsmith (frontend), MySQL, Docker
          </li>
          <li>
            Developed a job management platform with a relational database
            design, handling user profiles, job listings, and resumes.
          </li>
          <li>
            Leveraged Docker for containerization, ensuring consistent
            deployment environments.
          </li>
        </ul>

        <p className="mt-6 font-mono text-mono text-ink-soft">job_board.sql</p>
        <pre className="mt-2 bg-paper-edge text-ink p-4 overflow-auto font-mono text-code leading-relaxed">
          <code>
            {"CREATE TABLE hiring_manager (\n" +
              "    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,\n" +
              "    CompanyID INT NOT NULL,\n" +
              "    FirstName varchar(255),\n" +
              "    LastName varchar(255),\n" +
              "    Email varchar(255) NOT NULL ,\n" +
              "    Phone varchar(20),\n" +
              "    PasswordHASH varchar(100) NOT NULL,\n" +
              "    FOREIGN KEY (CompanyID) REFERENCES company(CompanyID)\n" +
              "                            ON DELETE CASCADE\n" +
              "                            ON UPDATE CASCADE\n" +
              ");\n"}
          </code>
        </pre>
      </section>

      <hr />

      {/* ----- Twitter Asks ---------------------------------------------- */}
      <section>
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-h2 font-medium text-balance">
            Twitter Asks
          </h2>
          <GitHub url="https://github.com/nataliedejohn/TwitterHackathonProject" />
        </header>
        <p className="mt-2 font-mono text-mono text-ink-soft">
          2023 &middot; Python, Flask, Tweepy, OpenAI Davinci &middot;
          Whitehall Hackathon team of 4 &middot; 1st place
        </p>

        <ul className="list-notebook mt-6 space-y-2">
          <li>
            <span className="font-medium">Technologies:</span> Python, Flask,
            Tweepy, Davinci API, HTML/CSS/JS
          </li>
          <li>
            Spearheaded a Whitehall Hackathon project that won 1st place
            overall.
          </li>
          <li>
            Utilized Twitter API and Tweepy to fetch tweets and processed them
            with a custom-trained Davinci API model.
          </li>
          <li>
            Implemented Python async/await to generate threaded responses in
            real-time.
          </li>
          <li>
            Integrated Flask to bridge the HTML/CSS/JS front-end with the
            Python back-end.
          </li>
        </ul>

        <p className="mt-6 font-mono text-mono text-ink-soft">
          twitter_async.py
        </p>
        <pre className="mt-2 mb-8 bg-paper-edge text-ink p-4 overflow-auto font-mono text-code leading-relaxed">
          <code>
            {'async def twitter_api_call(search="", mode="popular"):\n' +
              "    public_tweets = api.search_tweets(\n" +
              '        q=search+"?",\n' +
              '        locale="en-us",\n' +
              "        result_type=mode,\n" +
              "        until=datetime.today().strftime('%Y-%m-%d'),\n" +
              "        include_entities=True,\n" +
              '        tweet_mode="extended",\n' +
              '        lang="en"\n' +
              "    )\n\n" +
              "    data = []\n" +
              "    for tweet in public_tweets:\n" +
              "        data.append([tweet.full_text])\n\n" +
              "    return data\n"}
          </code>
        </pre>
      </section>
    </div>
  );
};

export default Projects;
