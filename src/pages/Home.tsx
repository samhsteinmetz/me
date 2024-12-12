// src/pages/Home.tsx
import { motion } from "framer-motion"
import { cn } from "../utils/classes"
import { GradualSpacing } from "../components/shared/spacing"

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
            <h2 className="text-3xl font-bold">About Me</h2>
            <p className="text-lg">Brief introduction about yourself...</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg overflow-hidden border border-green-500/20"
          >
            <img
              src="/your-image.jpg"
              alt="Profile"
              className="w-full h-auto"
            />
          </motion.div>
        </motion.section>
        // Add these sections in Home.tsx after About section and before Projects

{/* Education Section */}
<motion.section
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className={cn(
    "w-full",
    "p-6 rounded-lg",
    "border border-green-500/20",
    "backdrop-blur-sm bg-black/30"
  )}
>
  <h2 className="text-3xl font-bold mb-6">Education</h2>
  <div className="space-y-4">
    <div className="border-l-2 border-green-500/20 pl-4">
      <h3 className="text-xl font-semibold">University Name</h3>
      <p className="text-lg text-green-400">Bachelor of Science in Computer Science</p>
      <p className="text-sm text-green-500/80">2019 - 2023</p>
    </div>
    {/* Add more education items as needed */}
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