// src/pages/Projects.tsx
import React from 'react';
import projectImage from '../assets/stackchatterflow.jpeg';
import groupImage from '../assets/group.jpeg';
import GitHub from '../components/github.tsx';

const Projects: React.FC = () => {
  return (
    <div className="w-full px-6 py-12">
      <h1 className="text-5xl font-bold text-center text-green-500 mb-12">Projects</h1>
      <div className="space-y-16 max-w-5xl mx-auto">
      {/* FakeStackOverflow Project - Blue/Teal theme */}
      <section
          className="rounded-lg p-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 128, 0.8) 0%, rgba(0,128,128,0.8) 100%)'
          }}
        >
          <h2 className="text-2xl font-semibold text-blue-200">
          <span className="px-5">FakeStackOverflow: Real-Time Messaging System & More</span>
          <GitHub url="https://github.com/neu-cs4530/fall24-team-project-fall24-team-project-group-805/releases/tag/final-submission" /> 
          </h2>

          {/* Large Image */}
          <div className="w-full flex flex-col items-center space-y-2">
            <img 
              src={projectImage} 
              alt="FakeStackOverflow release image" 
              className="rounded-lg shadow-lg max-w-full h-auto"
              style={{ width: '80%' }} // Scaled down to 80% of its original size
            />
            <span className="text-blue-100 italic text-sm">
              Above is a poster of all the features we implemented in FakeChatterflow.
            </span>
          </div>

          <h3 className="font-bold text-blue-200 mt-4">Key Code Snippet:</h3>
          <div className="relative rounded-lg bg-slate-900 p-3">
            <div className="relative flex text-center mb-3">
              <div className="flex pl-3 pt-3 space-x-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-red-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-yellow-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-green-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
              </div>
              <span className="absolute inset-x-0 top-2 text-xs text-slate-500">friends_service.ts</span>
            </div>
            <pre className="text-sm rounded-lg overflow-auto p-4 bg-slate-900 text-neutral-100">
              <code className="font-mono leading-relaxed">
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
          </div>
        </section>

        {/* HackBeanPot 2024 Project - Purple/Pink theme */}
        <section
          className="rounded-lg p-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(128,0,128,0.8) 0%, rgba(219,112,147,0.8) 100%)'
          }}
        >
          <h2 className="text-2xl font-semibold text-pink-400">
          <span className="px-5">HackBeanPot 2024 Award Winner: DiscountBytes</span>
          <GitHub url="https://github.com/ShashSunkum/DiscountBytes/tree/main" /> 
          </h2>
          <div
    style={{
      float: 'right',
      width: '200px',
      marginLeft: '1rem',
      textAlign: 'center'
    }}
  >
    <img
      src={groupImage}
      alt="Our HackBeanPot 2024 Team"
      className="rounded-lg shadow-lg mb-2 max-w-full h-auto"
    />
    <span className="text-pink-100 text-xs italic">Our team at HackBeanPot 2024</span>
  </div>
          <ul className="list-disc list-inside space-y-2 text-pink-100 leading-relaxed">
            <li>
              <strong className="text-red-400">Technologies:</strong> Roboflow, Supervision (Python libs), Flask, React, Firebase
            </li>
            <li>
              Co-developed a web application for restaurants that dynamically adjusts menu pricing in real-time based on customer traffic and includes secure staff check-ins via facial recognition.
            </li>
            <li>
              Implemented dynamic food pricing and staff allocation features using customer data analytics.
            </li>
            <li>
              Deployed and demoed at HackBeanPot 2024, winning MLH and HackBeanPot awards and gaining insights into diverse tech stacks.
            </li>
          </ul>

          <h3 className="font-bold text-pink-200 mt-4">Key Code Snippet:</h3>
          <div className="relative rounded-lg bg-slate-900 p-3">
            <div className="relative flex text-center mb-3">
              <div className="flex pl-3 pt-3 space-x-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-red-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-yellow-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-green-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
              </div>
              <span className="absolute inset-x-0 top-2 text-xs text-slate-500">head_count.py</span>
            </div>
            <pre className="text-sm rounded-lg overflow-auto p-4 bg-slate-900 text-neutral-100">
  <code className="font-mono leading-relaxed">
    {"def update_people_count_callback(people_count):\n" +
"    # Update the people count in the database\n" +
"    conn = sqlite3.connect('database.db')\n" +
"    c = conn.cursor()\n" +
"    # Assuming you have a way to identify the correct restaurant entry to update\n" +
"    c.execute(\"UPDATE restaurants SET people_count = ? WHERE name = ?\", (people_count, \"ExampleRestaurant\"))\n" +
"    conn.commit()\n" +
"    print(f\"Updated count to {people_count} in the database.\")  # Debug print\n" +
"    conn.close()\n"}
  </code>
</pre>

          </div>
        </section>

        {/* Full Stack Database Design Project: Team Jobs - Teal/Green theme */}
        <section
          className="rounded-lg p-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,128,128,0.8) 0%, rgba(0,128,0,0.8) 100%)'
          }}
        >
          <h2 className="text-2xl font-semibold text-green-400">
          <span className="px-5">Full Stack Database Design Project: Team Jobs</span>
          <GitHub url="https://github.com/samhsteinmetz/23f-project-boilerplate-teamJobs" /> 
            </h2>
          <ul className="list-disc list-inside space-y-2 text-green-100 leading-relaxed">
            <li>
              <strong className="text-red-500">Technologies:</strong> Flask (CRUD RESTful APIs), Appsmith (frontend), MySQL, Docker
            </li>
            <li>
              Developed a job management platform with a relational database design, handling user profiles, job listings, and resumes.
            </li>
            <li>
              Leveraged Docker for containerization, ensuring consistent deployment environments.
            </li>
          </ul>

          <h3 className="font-bold text-green-200 mt-4">Job Board Schema Example:</h3>
          <div className="relative rounded-lg bg-slate-900 p-3">
            <div className="relative flex text-center mb-3">
              <div className="flex pl-3 pt-3 space-x-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-red-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-yellow-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-green-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
              </div>
              <span className="absolute inset-x-0 top-2 text-xs text-slate-500">job_board.sql</span>
            </div>
            <pre className="text-sm rounded-lg overflow-auto p-4 bg-slate-900 text-neutral-100">
  <code className="font-mono leading-relaxed">
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

          </div>
        </section>

        {/* Twitter Asks Project - Orange/Red theme */}
        <section
          className="rounded-lg p-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,165,0,0.8) 0%, rgba(255,69,0,0.8) 100%)'
          }}
        >
          <h2 className="text-2xl font-semibold text-blue-500">
            <span className="px-5">Twitter Asks</span>
          <GitHub url="https://github.com/nataliedejohn/TwitterHackathonProject" /> 
          </h2>
          
          
          <ul className="list-disc list-inside space-y-2 text-orange-100 leading-relaxed">
            <li>
              <strong className="text-blue-300">Technologies:</strong> Python, Flask, Tweepy, Davinci API, HTML/CSS/JS
            </li>
            <li>
              Spearheaded a Whitehall Hackathon project that won 1st place overall.
            </li>
            <li>
              Utilized Twitter API and Tweepy to fetch tweets and processed them with a custom-trained Davinci API model.
            </li>
            <li>
              Implemented Python async/await to generate threaded responses in real-time.
            </li>
            <li>
              Integrated Flask to bridge the HTML/CSS/JS front-end with the Python back-end.
            </li>
          </ul>

          <h3 className="font-bold text-orange-200 mt-4">Tweepy Integration Code Example:</h3>
          <div className="relative rounded-lg bg-slate-900 p-3">
            <div className="relative flex text-center mb-3">
              <div className="flex pl-3 pt-3 space-x-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-red-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-yellow-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-green-500/70">
                  <circle r="12" cy="12" cx="12"></circle>
                </svg>
              </div>
              <span className="absolute inset-x-0 top-2 text-xs text-slate-500">twitter_async.py</span>
            </div>
            <pre className="text-sm rounded-lg overflow-auto p-4 bg-slate-900 text-neutral-100">
              <code className="font-mono leading-relaxed">
                {"async def twitter_api_call(search=\"\", mode=\"popular\"):\n" +
"    public_tweets = api.search_tweets(\n" +
"        q=search+\"?\",\n" +
"        locale=\"en-us\",\n" +
"        result_type=mode,\n" +
"        until=datetime.today().strftime('%Y-%m-%d'),\n" +
"        include_entities=True,\n" +
"        tweet_mode=\"extended\",\n" +
"        lang=\"en\"\n" +
"    )\n\n" +
"    data = []\n" +
"    for tweet in public_tweets:\n" +
"        data.append([tweet.full_text])\n\n" +
"    return data\n"}
              </code>
            </pre>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Projects;
