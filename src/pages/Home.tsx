// src/pages/Home.tsx
import { motion } from "framer-motion"
import { cn } from "../utils/classes"
import { GradualSpacing } from "../components/shared/spacing"
import thisImage from "../assets/me.jpeg"

const Home = () => {
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
        // Add these sections in Home.tsx after About section and before Projects

{/* Education Section */}
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
      <p className="text-sm text-white/80">2022 - 2026</p>
    </div>
  </div>
</motion.section>

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
      "AWS"

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
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={cn(
                  "p-6 rounded-lg",
                  "border border-green-500/20",
                  "backdrop-blur-sm bg-black/30"
                )}
              >
                <h3 className="text-xl font-bold mb-2">Project {i}</h3>
                <p>Project description...</p>
              </motion.div>
            ))}
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
          <p className="text-lg">Ready to collaborate?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-6 py-2 rounded-lg",
              "bg-green-500 text-black",
              "hover:bg-green-400 transition-colors"
            )}
          >
            Get in Touch
          </motion.button>
        </motion.section>
      </div>
      </div>
    );
  };
  

export default Home