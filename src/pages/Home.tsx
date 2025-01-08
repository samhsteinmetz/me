// src/pages/Home.tsx
import { motion } from "framer-motion"
import { cn } from "../utils/classes"
import { GradualSpacing } from "../components/shared/spacing"
import thisImage from "../assets/me.jpeg"
import Card from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const projects = ["StackOverFlow",  "HackBeanpot", "TeamJobs", "Twitter Asks"];
    const colors = [
        '#3498db', // Blue
        '#9b59b6', // Purple
        '#e74c3c', // Red
        '#f39c12', // Orange
        '#2ecc71', // Green
        '#1abc9c'  // Teal
      ];
      
    return (
        <div className="py-12 px-8">
      <div className={cn("flex flex-col gap-16 w-full", "px-8 sm:px-8 lg:px-6")}>
        {/* Hero Section */}
        <GradualSpacing />
  
        {/* About Preview */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-8",
            "items-center w-full"
          )}
        >
       <div className="space-y-4">
  <div className="flex justify-center items-center w-full">
    <h2 className={cn(
      "text-3xl font-bold",
      "bg-gradient-to-r from-green-300 via-green-400 to-green-300",
      "bg-clip-text text-transparent",
      "border-b-2 border-green-500/20 pb-2",
      "inline-block"
    )}>
      About Me
    </h2>
  </div>
  <div className={cn(
    "p-6 rounded-3xl",
    "border-2 border-green-500/20",
    "backdrop-blur-sm bg-black/30",
    "hover:border-green-500/40 transition-colors"
  )}>
    <p className="text-lg">
      <strong>Hi!</strong>
      <br />
      I'm Samuel Steinmetz a computer science student at Northeastern University. 
      I'm a junior dual majoring in finance and computer science. I enjoy software, numbers, and entreprenuership.
      In my spare time I enjoy playing basketball, playing board games, and playing my banjo.
    </p>
  </div>
</div>
            <img
              src={thisImage}
              alt="Profile"
              className="w-full h-auto object-cover rounded-full"
            />
        </motion.section>

{/* Education Section */}
{/* Skills Section */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="w-full space-y-6"
>
  <h2 className="text-3xl font-bold text-center">Skills</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Git",
      "SQL",
      "JAVA",
      "C/C++",

    ].map((skill) => (
      <motion.div
        key={skill}
        whileHover={{ scale: 1.05 }}
        className={cn(
          "p-4 rounded-lg",
          "border border-green-500/20",
          "backdrop-blur-sm bg-black/30",
          "text-center"
        )}
      >
        <span className="text-lg font-medium">{skill}</span>
      </motion.div>
    ))}
  </div>
</motion.section>
  
        {/* Projects Preview */}
        <motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="space-y-8 w-full"
>
  <h2 className="text-3xl font-bold text-center">Featured Projects</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((project, index) => (
      <Card 
        key={project} 
        title={project} 
        para="" 
        baseColor={colors[index % colors.length]} 
      />
    ))}
  </div>
</motion.section>

{/* Software Experience Section */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className={cn(
    "w-full",
    "p-6 rounded-lg",
    "border-2 border-green-500/20",
    "backdrop-blur-sm bg-black/30",
    "hover:border-green-500/40 transition-colors"
  )}
>
  <h2 className="text-3xl font-bold mb-6 text-green-400">Software Experience</h2>
  <div className="space-y-8">
    {/* Teaching Assistant */}
    <div>
      <div className="border-l-2 border-red-500/40 pl-4">
        <h3 className="text-xl font-semibold text-red-500">Teaching Assistant - Object-Oriented Development</h3>
        <p className="text-lg text-white">Northeastern University | Part-time + Full-time</p>
        <p className="text-sm text-white/80">Sep 2024 – Dec 2024</p>
      </div>
      <ul className="list-disc pl-8 text-white/80">
        <li>Led lab sessions on design patterns, reinforcing concepts like abstraction, modularity, code reuse, and agile programming.</li>
        <li>Graded assignments with a focus on design patterns, inheritance, encapsulation, and ensuring clean Java code.</li>
        <li>Assisted students during office hours with JUnit, Java, design patterns, and debugging.</li>
      </ul>
    </div>

    {/* CX Co-op */}
    <div>
      <div className="border-l-2 border-blue-500/40 pl-4">
        <h3 className="text-xl font-semibold text-blue-500">CX Co-op: Technical Support Engineer and IT Intern</h3>
        <p className="text-lg text-white">Panorama Education | Fulltime Internship</p>
        <p className="text-sm text-white/80">Jan 2024 – Dec 2024</p>
      </div>
      <ul className="list-disc pl-8 text-white/80">
        <li>Resolved a queue of 10,000+ customer-facing issues by troubleshooting incidents and addressing user inquiries.</li>
        <li>Collaborated with UX and Engineering teams to audit and improve platform usability and functionality.</li>
        <li>Implemented survey auditing solutions and ensured secure, efficient data transfers for hundreds of clients.</li>
        <li>Conducted a comprehensive audit of 30+ product education resources to ensure quality UX.</li>
      </ul>
    </div>

    {/* Software Developer */}
    <div>
      <div className="border-l-2 border-teal-500/40 pl-4">
        <h3 className="text-xl font-semibold text-teal-500">Software Developer Co-op</h3>
        <p className="text-lg text-white">MHCPS | Full-time Internship</p>
        <p className="text-sm text-white/80">Jan 2025 – May 2025</p>
      </div>
      <ul className="list-disc pl-8 text-white/80">
        <li>working on developing a campus wide parking application and internal tool using id badges</li>
        <li>deploying and moving microservices from hosted servers to azure cloud</li>
        <li>team development of a streamlined document and transcript generating application using ellucian colleague database</li>
      </ul>
    </div>
  </div>
</motion.section>

{/* Education Section */}
<motion.section
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className={cn(
    "w-full",
    "p-6 rounded-lg",
    "border-2 border-green-500/20", // Changed to green border
    "backdrop-blur-sm bg-black/30",
    "hover:border-green-500/40 transition-colors" // Changed hover to green
  )}
>
  <h2 className="text-3xl font-bold mb-6 text-green-400">Education</h2>
  <div className="space-y-4">
    <div className="border-l-2 border-[#D41B2C]/40 pl-4">
      <h3 className="text-xl font-semibold text-[#D41B2C]">Northeastern University</h3>
      <p className="text-lg text-white">Bachelor of Science in Computer Science and Finance + minor in Math</p>
      <p className="text-sm text-white/80">2022 - 2026</p>
    </div>
  </div>
  <div className="space-y-4">
    <div className="border-l-2 border-blue-500/40 pl-4">
      <h3 className="text-xl font-semibold text-blue-500">Gilman School</h3>
      <p className="text-lg text-white">Highschool</p>
      <p className="text-sm text-white/80">2018 - 2022</p>
    </div>
  </div>
</motion.section>


{/* General Work Experience Section */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className={cn(
    "w-full",
    "p-6 rounded-lg",
    "border-2 border-green-500/20",
    "backdrop-blur-sm bg-black/30",
    "hover:border-green-500/40 transition-colors"
  )}
>
  <h2 className="text-3xl font-bold mb-6 text-green-400">General Work Experience</h2>
  <div className="space-y-8">
    {/* Barista */}
    <div>
      <div className="border-l-2 border-orange-500/40 pl-4">
        <h3 className="text-xl font-semibold text-orange-500">Barista</h3>
        <p className="text-lg text-white">Pure Raw Juice | Part-time</p>
        <p className="text-sm text-white/80">Jun 2022 – Jan 2023 (8 months)</p>
      </div>
      <ul className="list-disc pl-8 text-white/80">
        <li>Blended smoothies and bowls using a variety of fruits, vegetables, and superfoods.</li>
        <li>Prepared cold-pressed coffee and cashew milk, ensuring high-quality standards.</li>
        <li>Safely handled food and managed customer service at the register.</li>
      </ul>
    </div>

    {/* Data Operation Intern */}
    <div>
      <div className="border-l-2 border-red-500/40 pl-4">
        <h3 className="text-xl font-semibold text-red-500">Data Operation Intern</h3>
        <p className="text-lg text-white">Deli Brands of America | Internship</p>
        <p className="text-sm text-white/80">Jul 2021 – Aug 2021 (2 months)</p>
      </div>
      <ul className="list-disc pl-8 text-white/80">
        <li>Collected time data for meat-packing production operations.</li>
        <li>Analyzed ERP system data to make it accessible for research and development.</li>
      </ul>
    </div>
  </div>
</motion.section>


  
        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={cn(
            "text-center space-y-4 w-full",
            "p-8 rounded-lg",
            "border border-green-500/20",
            "backdrop-blur-sm bg-black/30"
          )}
        >
          <h2 className="text-3xl font-bold">Let's Connect</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-6 py-2 rounded-lg",
              "bg-green-500 text-black",
              "hover:bg-green-400 transition-colors"
            )}
            onClick={() => {navigate('/contact')}}
          >
            Get in Touch
          </motion.button>
        </motion.section>
      </div>
      </div>
    );
  };
  

export default Home