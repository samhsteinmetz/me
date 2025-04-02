// src/pages/About.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GradientParagraph from '../components/GradientParagraph.tsx';
import currImage from '../assets/cat.jpeg';

const About = () => {
  const navigate = useNavigate()
  const longText = " Hello! I'm Samuel Heron Steinmetz (SHS). I have a passion for software development, Math, and everything technology. I am a 3rd year student at Northeastern University, and I am currently pursuing a BS in CS + Finance. I am looking for an internship as of now for summer 2025.";

  useEffect(() => {
    // Handle page refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      navigate('/me')
    }

    // Handle page visibility change with navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Page refresh detected')
        navigate('/me')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigate])

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-green-400 py-8">About Me</h1>
          <div style={{ padding: '2rem' }}>
            <GradientParagraph 
                text={longText} 
                baseColor="green" 
                longTextThreshold={30} // animate if over 30 chars
            />
    <div className="flex py-8 justify-center items-center">
    <img
  src={currImage}
  alt="Samuel Heron Steinmetz"
  className="rounded-full w-160 h-160 object-contain"
/>
        </div>

    </div>
    
          <p className="text-green-300 leading-relaxed">
          In my free time I like hanging out with my cats, running, playing basketball, poker, and trying new food! You can always find me in the my school’s sauna in the winter time and hopefully on the beach or at least in the sun in summer time. I have been learning how to ski and would consider myself pretty decent. Besides my hobbies, I do enjoy programming and taking on projects. Although some of my personal projects can be left unfinished, I just say that I am very passionate about the next thing. Recently I have been reading alot about Model Context Protocol and how applications can write themselves somewhat. If you have any questions or want to chat about anything shoot my socials below!
          </p>
        </div>

      

        {/* Animation box and icons at the bottom */}
        <div className="px-16 pb-8">
        <div className="container items-center max-w-lg mx-auto px-16">
          <div className="card">
            <div className="background">
              {/* Add any background animation or styling here */}
            </div>
            <div className="logo flex justify-center items-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  fontSize="20"
                  fill="#800080"
                  fontWeight="bold"
                  style={{ textDecoration: 'underline', textDecorationColor: 'purple' }}
                >
                  Socials
                </text>
              </svg>
            </div>

            <div className="flex justify-center items-center space-x-6 pb-8">
              {/* GitHub Link */}
              <a 
                href="https://github.com/samhsteinmetz" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="box box1">
                  <span className="icon">
                    <svg viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg" className="svg">
                      <path d="M165.9 397.4c0 2-2.3 3.4-5.2 3.4-2.9 
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
                               8 248 8z"/>
                    </svg>
                  </span>
                </div>
              </a>

              {/* LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/in/samuel-heron-steinmetz/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="box box2">
                  <span className="icon">
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="svg">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.41 108C24.37 108 
                               0 83.6 0 53.83 0 24.06 24.37 
                               0 54.11 0c29.74 0 54.12 24.06 
                               54.12 53.83S83.85 108 54.11 108zM447.1 
                               448h-92.68V302.4c0-34.7-1.25-79.3-48.27-79.3 
                               -48.3 0-55.7 37.8-55.7 76.9v148h-92.75V148.9h89.07v40.8h1.3c12.4-23.5 
                               42.54-48.2 87.53-48.2 93.62 0 
                               110.8 61.6 110.8 141.5V448z"/>
                    </svg>
                  </span>
                </div>
              </a>

              {/* Gmail Link */}
              <a 
                href="mailto:samhsteinmetz@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="box box3">
                  <span className="icon">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="svg">
                      <title>Gmail</title>
                      <path fill="#e75a70" d="M338.4 252.8l108.6-97.5c-3.9-3.7-9.2-5.7-14.6-5.7H79.6c-5.4 0-10.7 2.1-14.6 5.7l108.6 97.5c10.3 9.2 25.3 9.2 35.6 0l43.4-39 43.4 39c10.3 9.2 25.3 9.2 35.6 0z"></path>
                      <path fill="#e75a70" d="M435.9 170.8l-108.6 97.5c-10.3 9.2-25.3 9.2-35.6 0l-43.4-39-43.4 39c-10.3 9.2-25.3 9.2-35.6 0l-108.6-97.5c-4.6 4.3-7.4 10.4-7.4 17.2v153.3c0 12.8 10.3 23 23 23h352.9c12.7 0 23-10.3 23-23V188c0-6.8-2.9-12.9-7.5-17.2z"></path>
                      <path fill="#f2f2f2" d="M433 106H79.6c-6.8 0-12.9 2.9-17.5 7.5l176.7 158.7c10.3 9.2 25.3 9.2 35.6 0L450.5 113.5c-4.5-4.6-10.7-7.5-17.5-7.5z"></path>
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
        </div>
    </>
  )
}

export default About
