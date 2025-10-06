// src/Pages/Portfolio.jsx
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, 
  faMoon, 
  faCode, 
  faComment, 
  faDownload, 
  faPhone, 
  faEnvelope, 
  faCheckCircle, 
  faUsers, 
  faBolt, 
  faMobileAlt, 
  faTools,
  faExternalLinkAlt,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faGithub, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

function Portfolio() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const [typedText, setTypedText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fullText = "Mobile App Developer";
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // Simple fade-in animation for elements
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(2rem)';
    });
    
    setTimeout(() => {
      fadeElements.forEach(element => {
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, 100);

    // Typing effect
    let index = 0;
    const typeWriter = () => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, 100);
      }
    };
    
    typeWriter();

    // 3D Animation with Three.js
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      const init3DAnimation = async () => {
        const THREE = await import('three');
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (sceneRef.current) {
          sceneRef.current.appendChild(renderer.domElement);
        }
        
        // Add floating geometric shapes
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshPhongMaterial({
          color: theme === 'dark' ? 0x6366f1 : 0x3b82f6,
          shininess: 100,
          transparent: true,
          opacity: 0.8
        });
        
        const shapes = [];
        const numShapes = 5;
        
        for (let i = 0; i < numShapes; i++) {
          const shape = new THREE.Mesh(geometry, material);
          shape.position.x = (Math.random() - 0.5) * 10;
          shape.position.y = (Math.random() - 0.5) * 10;
          shape.position.z = (Math.random() - 0.5) * 5;
          shape.rotation.x = Math.random() * Math.PI;
          shape.rotation.y = Math.random() * Math.PI;
          shape.scale.setScalar(Math.random() * 0.5 + 0.5);
          scene.add(shape);
          shapes.push(shape);
        }
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        camera.position.z = 5;
        
        // Animation
        const animate = () => {
          requestAnimationFrame(animate);
          
          shapes.forEach(shape => {
            shape.rotation.x += 0.005;
            shape.rotation.y += 0.005;
            shape.position.y += 0.005;
            
            if (shape.position.y > 5) {
              shape.position.y = -5;
            }
          });
          
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          if (sceneRef.current) {
            sceneRef.current.removeChild(renderer.domElement);
          }
        };
      };
      
      init3DAnimation();
    }
    
    // Particle animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 100;

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 2 - 1;
          this.speedY = Math.random() * 2 - 1;
          this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        animationRef.current = requestAnimationFrame(animateParticles);
      }

      animateParticles();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [theme]);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="portfolio-container">
      {/* 3D Animation Container */}
      <div ref={sceneRef} className="three-container"></div>
      
      {/* Header */}
      <header>
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">AH</div>
            <div className="logo-text">
              <div className="logo-name">Ahsan Hajvari</div>
              <div className="logo-title">Mobile App Developer</div>
            </div>
          </div>
          
          <nav className={mobileMenuOpen ? "nav-open" : ""}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </nav>
          
          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              {theme === "dark" ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
            </button>
            <a href="https://wa.me/923213486272" target="_blank" className="whatsapp-btn" title="Contact via WhatsApp">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <a href="#contact" className="hire-btn">
              <FontAwesomeIcon icon={faWhatsapp} /> Hire Me
            </a>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <canvas ref={canvasRef} id="particle-canvas" className="particle-canvas"></canvas>
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="availability fade-in">
              <div className="availability-dot"></div>
              Available for Projects • Remote Ready • Pakistan
            </div>
            
            <h1 className="hero-title fade-in delay-100">
              Hi, I'm <span className="gradient-text">Ahsan Hajvari</span>
            </h1>

            <h2 className="hero-subtitle fade-in delay-150">
              {typedText}<span className="cursor">|</span>
            </h2>

            <p className="hero-description fade-in delay-200">
              Specializing in <strong className="emerald-text">Android</strong> and <strong className="blue-text">React Native</strong> applications with expertise in <strong className="purple-text">Java</strong>, <strong className="emerald-text">Kotlin</strong>, and modern development practices.
            </p>
            
            <div className="hero-actions fade-in delay-300">
              <a href="#projects" className="primary-btn">
                <FontAwesomeIcon icon={faCode} />
                View My Work
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
              <a href="#contact" className="secondary-btn">
                <FontAwesomeIcon icon={faComment} />
                Let's Talk
              </a>
              <a href="/resume.pdf" download="Ahsan_Hajvari_Resume.pdf" className="secondary-btn">
                <FontAwesomeIcon icon={faDownload} />
                Download Resume
              </a>
            </div>
            
            <div className="contact-links fade-in delay-400">
              <a href="tel:+923213486272" className="contact-link" title="Call me directly">
                <FontAwesomeIcon icon={faPhone} />
                +92 321 3486272
              </a>
              <a href="mailto:ahsam72642@gmail.com" className="contact-link" title="Send me an email">
                <FontAwesomeIcon icon={faEnvelope} />
                Email Me
              </a>
              <a href="https://github.com/ahsan589" target="_blank" className="contact-link" title="Check my GitHub">
                <FontAwesomeIcon icon={faGithub} />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="hero-visual fade-in delay-500">
            <div className="floating-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="status">
                    <div className="status-dot"></div>
                    Professional Developer
                  </div>
                  <div className="location">Pakistan • Remote Worldwide</div>
                </div>
                
                <h3 className="card-title">Mobile App Expertise</h3>

                <p className="card-description">
                  Creating innovative apps that deliver exceptional user experiences across platforms.
                </p>
                
                <div className="tech-grid">
                  <div className="tech-item">React Native</div>
                  <div className="tech-item">Android</div>
                  <div className="tech-item">Java</div>
                  <div className="tech-item">Kotlin</div>
                  <div className="tech-item">Firebase</div>
                  <div className="tech-item">TypeScript</div>
                </div>
                
                <div className="card-actions">
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'd like to hire you for a project." target="_blank" className="card-primary-btn">
                    <FontAwesomeIcon icon={faWhatsapp} /> Hire Me Now
                  </a>
                  <a href="/resume.pdf" download="Ahsan_Hajvari_Resume.pdf" className="card-secondary-btn">
                    <FontAwesomeIcon icon={faDownload} />
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title"><span className="gradient-text">About Me</span></h2>
            <p className="section-description">Passionate about creating exceptional digital experiences</p>
          </div>
          
          <div className="about-grid">
            <div className="about-content fade-in">
              <h3>Professional Mobile App Developer</h3>
              <p className="about-text">
                With expertise in Android and React Native development, I specialize in creating
                innovative mobile applications using Java, Kotlin, and modern development practices.
              </p>
              <p className="about-text">
                I'm passionate about building user-friendly mobile apps that solve real-world problems
                and deliver exceptional user experiences across different platforms and devices.
              </p>
              <p className="about-text">
                Based in Pakistan and available for remote work worldwide, I've successfully developed multiple
                mobile applications including cryptocurrency trackers, music recommendation apps, and utility tools.
              </p>
              
              <div className="social-links">
                <a href="https://www.linkedin.com/in/ahsan-hajvari-934527366" target="_blank" className="social-link">
                  <FontAwesomeIcon icon={faLinkedin} />
                  LinkedIn
                </a>
                <a href="https://github.com/ahsan589" target="_blank" className="social-link github-link">
                  <FontAwesomeIcon icon={faGithub} />
                  GitHub
                </a>
              </div>
            </div>
            
            <div className="skills-container fade-in delay-100">
              <h4>Technical Skills</h4>
              
              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">Java</span>
                  <span className="skill-percentage">95%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">Kotlin</span>
                  <span className="skill-percentage">90%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">React Native</span>
                  <span className="skill-percentage">85%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">Android Studio</span>
                  <span className="skill-percentage">90%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">Firebase</span>
                  <span className="skill-percentage">85%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="skill">
                <div className="skill-header">
                  <span className="skill-name">TypeScript</span>
                  <span className="skill-percentage">80%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title"><span className="gradient-text">Professional Services</span></h2>
            <p className="section-description">Comprehensive mobile app development solutions tailored to your business needs</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card floating-card fade-in">
              <div className="service-icon">
                <FontAwesomeIcon icon={faCode} />
              </div>
              
              <div className="service-header">
                <h3 className="service-title">Android App Development</h3>
              </div>

              <p className="service-description">Native Android applications with modern UI/UX and optimal performance.</p>

              <div className="service-features">
                <div className="service-feature">Java & Kotlin</div>
                <div className="service-feature">Material Design</div>
                <div className="service-feature">Firebase Integration</div>
                <div className="service-feature">Performance Optimization</div>
              </div>

              <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in Android App Development services." target="_blank" className="service-button">
                <FontAwesomeIcon icon={faWhatsapp} /> Get Quote
              </a>
            </div>
            
            <div className="service-card floating-card fade-in delay-100">
              <div className="service-icon">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>
              
              <div className="service-header">
                <h3 className="service-title">React Native Development</h3>
              </div>

              <p className="service-description">Cross-platform mobile applications with native performance and unified codebase.</p>

              <div className="service-features">
                <div className="service-feature">React Native & Expo</div>
                <div className="service-feature">TypeScript</div>
                <div className="service-feature">Cross-platform</div>
                <div className="service-feature">Native Modules</div>
              </div>

              <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in React Native Development services." target="_blank" className="service-button">
                <FontAwesomeIcon icon={faWhatsapp} /> Get Quote
              </a>
            </div>
            
            <div className="service-card floating-card fade-in delay-200">
              <div className="service-icon">
                <FontAwesomeIcon icon={faTools} />
              </div>
              
              <div className="service-header">
                <h3 className="service-title">App Maintenance & Support</h3>
              </div>

              <p className="service-description">Ongoing support and maintenance for your mobile applications.</p>

              <div className="service-features">
                <div className="service-feature">Bug Fixes & Updates</div>
                <div className="service-feature">Performance Optimization</div>
                <div className="service-feature">Feature Enhancements</div>
                <div className="service-feature">24/7 Support</div>
              </div>

              <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in App Maintenance & Support services." target="_blank" className="service-button">
                <FontAwesomeIcon icon={faWhatsapp} /> Get Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title"><span className="gradient-text">Featured Projects</span></h2>
            <p className="section-description">Real-world mobile applications showcasing modern development expertise</p>
          </div>
          
          <div className="projects-grid">
            <div className="project-card floating-card fade-in">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">Crypto Market Analysis App</h3>
                    <p className="project-subtitle">Cross-platform Cryptocurrency Tracker</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  Cross-platform app with real-time cryptocurrency data, featuring newsfeed, AI-based price predictions, communities, videos, watchlist, and demo trading functionality.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">TypeScript</span>
                  <span className="tech-tag">Firebase</span>
                  <span className="tech-tag">REST APIs</span>
                  <span className="tech-tag">AI/ML</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/react-native-crypto-market-analysis" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the Crypto Market Analysis App project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>
            
            <div className="project-card floating-card fade-in delay-100">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">MoodTunes App</h3>
                    <p className="project-subtitle">AI-Powered Music Recommender</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  Intelligent music recommendation app that detects emotions from facial expressions using OpenCV and suggests mood-based songs via Deezer API with manual mood selection.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">OpenCV</span>
                  <span className="tech-tag">Deezer API</span>
                  <span className="tech-tag">AI/ML</span>
                  <span className="tech-tag">JavaScript</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/MoodTunes-App" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the MoodTunes App project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>
            
            <div className="project-card floating-card fade-in delay-200">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">Crypto Market App</h3>
                    <p className="project-subtitle">Native Android Cryptocurrency Tracker</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  Native Android cryptocurrency market tracker that uses public APIs for real-time data and native UI components for optimal performance.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">Android</span>
                  <span className="tech-tag">Java</span>
                  <span className="tech-tag">REST APIs</span>
                  <span className="tech-tag">Android Studio</span>
                  <span className="tech-tag">Material Design</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/cryptomarket-android-app" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the Crypto Market App project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>
                  <div className="project-card floating-card fade-in delay-300">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">Urdu Audio/Video to Text Converter</h3>
                    <p className="project-subtitle">Speech-to-Text Utility App</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  Converts Urdu speech from audio/video to text. Supports multiple formats including mp3, wav, flac, mp4, mkv with automatic audio extraction.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">Android</span>
                  <span className="tech-tag">Java</span>
                  <span className="tech-tag">Speech Recognition</span>
                  <span className="tech-tag">FFmpeg</span>
                  <span className="tech-tag">Android Studio</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/UrduSpeechtotext" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the Urdu Audio/Video to Text Converter project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>
            
            <div className="project-card floating-card fade-in delay-400">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">News Reader App</h3>
                    <p className="project-subtitle">Real-time News Application</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  Real-time news app using Inshorts API. Built with Jetpack Compose and MVVM architecture, supports headline browsing and bookmarking functionality.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">Android</span>
                  <span className="tech-tag">Kotlin</span>
                  <span className="tech-tag">Jetpack Compose</span>
                  <span className="tech-tag">MVVM</span>
                  <span className="tech-tag">REST APIs</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/News-Reader-app" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the News Reader App project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card floating-card fade-in delay-500">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Web App</div>
                    <h3 className="project-title">DreamWeaver</h3>
                    <p className="project-subtitle">Futuristic Dream Journal</p>
                  </div>
                  <span className="project-status status-live">
                    <div className="status-dot"></div>
                    LIVE
                  </span>
                </div>

                <p className="project-description">
                  A modern and interactive dream journaling web app that allows you to record, organize, and analyze your dreams. It combines a sleek UI with mood tracking, tagging, lucid dream logging, and data visualization using Chart.js.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">Chart.js</span>
                  <span className="tech-tag">CSS</span>
                  <span className="tech-tag">Local Storage</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/DreamWeaver-dream-journal-analyzer" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the DreamWeaver project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card floating-card fade-in delay-600">
              <div className="card-content">
                <div className="project-header">
                  <div>
                    <div className="project-category">Mobile App</div>
                    <h3 className="project-title">JobConnect</h3>
                    <p className="project-subtitle">Job Portal Mobile App</p>
                  </div>
                  <span className="project-status status-in-progress">
                    <div className="status-dot"></div>
                    IN PROGRESS
                  </span>
                </div>

                <p className="project-description">
                  A comprehensive job portal mobile application built with React Native and Expo, designed to connect job seekers with employers through an intuitive and feature-rich platform.
                </p>

                <div className="project-tech">
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">Expo</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">Firebase</span>
                  <span className="tech-tag">REST APIs</span>
                </div>

                <div className="project-footer">
                  <a href="https://github.com/ahsan589/Job-Portal-Mobile-App" target="_blank" className="project-link">
                    View on GitHub
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                  <a href="https://wa.me/923213486272?text=Hi Ahsan! I'm interested in the JobConnect project. Can we discuss similar work?" target="_blank" className="project-discuss">
                    <FontAwesomeIcon icon={faWhatsapp} /> Discuss
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 fade-in delay-300">
            <a href="https://github.com/ahsan589" target="_blank" className="github-button">
              <FontAwesomeIcon icon={faGithub} />
              View All Projects on GitHub
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title"><span className="gradient-text">Let's Build Something Amazing</span></h2>
            <p className="section-description">
              Ready to transform your ideas into exceptional mobile experiences?
              I'm here to help you create fast, scalable, and beautiful mobile applications
              that drive real business results.
            </p>
          </div>
          
          <div className="contact-grid">
            <a href="https://wa.me/923213486272?text=Hi Ahsan! I'd like to discuss a project with you." target="_blank" className="contact-card floating-card fade-in">
              <div className="contact-icon whatsapp-icon">
                <FontAwesomeIcon icon={faWhatsapp} />
              </div>
              <h3>WhatsApp</h3>
              <p>Quick response guaranteed</p>
              <div className="contact-info whatsapp-info">+92 321 3486272</div>
            </a>

            <a href="mailto:ahsam72642@gmail.com?subject=Project Inquiry&body=Hi Ahsan! I'm interested in discussing a project with you." className="contact-card floating-card fade-in delay-100">
              <div className="contact-icon email-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3>Email</h3>
              <p>Detailed discussions</p>
              <div className="contact-info email-info">ahsam72642@gmail.com</div>
            </a>

            <a href="https://www.linkedin.com/in/ahsan-hajvari-934527366" target="_blank" className="contact-card floating-card fade-in delay-200">
              <div className="contact-icon linkedin-icon">
                <FontAwesomeIcon icon={faLinkedin} />
              </div>
              <h3>LinkedIn</h3>
              <p>Professional network</p>
              <div className="contact-info linkedin-info">Ahsan Hajvari</div>
            </a>

            <a href="https://github.com/ahsan589" target="_blank" className="contact-card floating-card fade-in delay-300">
              <div className="contact-icon github-icon">
                <FontAwesomeIcon icon={faGithub} />
              </div>
              <h3>GitHub</h3>
              <p>View my code</p>
              <div className="contact-info github-info">ahsan589</div>
            </a>
          </div>
          
          <div className="cta-card fade-in delay-400">
            <h3 className="cta-title">Ready to Start Your Project?</h3>
            <p className="cta-description">
              Let's discuss your mobile app requirements and turn your vision into reality.
              I'm available for both short-term projects and long-term collaborations.
            </p>
            
            <div className="cta-buttons">
              <a href="https://wa.me/923213486272?text=Hi Ahsan! I have a project in mind and would like to get a quote." target="_blank" className="primary-btn">
                <FontAwesomeIcon icon={faWhatsapp} /> Get Free Quote
              </a>
              <a href="mailto:ahsam72642@gmail.com?subject=Project Discussion&body=Hi Ahsan! I'd like to schedule a call to discuss my project requirements." className="secondary-btn">
                <FontAwesomeIcon icon={faEnvelope} /> Schedule Call
              </a>
              <a href="/resume.pdf" download="Ahsan_Hajvari_Resume.pdf" className="secondary-btn">
                <FontAwesomeIcon icon={faDownload} /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <a href="#" className="footer-logo">
              <div className="footer-icon">AH</div>
              <div className="footer-text">
                <div className="footer-name">Ahsan Hajvari</div>
                <div className="footer-title">Mobile App Developer</div>
              </div>
            </a>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Ahsan Hajvari. All rights reserved. Built with React & Three.js</p>
            <p>Available for freelance work worldwide • Based in Pakistan</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --indigo-500: #6366f1;
          --purple-500: #8b5cf6;
          --fuchsia-500: #d946ef;
          --slate-950: #020617;
          --slate-900: #0f172a;
          --slate-800: #1e293b;
          --slate-700: #334155;
          --slate-600: #475569;
          --slate-500: #64748b;
          --slate-400: #94a3b8;
          --slate-300: #cbd5e1;
          --slate-200: #e2e8f0;
          --slate-100: #f1f5f9;
          --slate-50: #f8fafc;
          --emerald-500: #10b981;
          --blue-500: #3b82f6;
          --cyan-500: #06b6d4;
          --teal-500: #14b8a6;
          --amber-500: #f59e0b;
        }

        [data-theme="light"] {
          --slate-950: #f8fafc;
          --slate-900: #f1f5f9;
          --slate-800: #e2e8f0;
          --slate-700: #cbd5e1;
          --slate-600: #94a3b8;
          --slate-500: #64748b;
          --slate-400: #475569;
          --slate-300: #334155;
          --slate-200: #1e293b;
          --slate-100: #0f172a;
          --slate-50: #020617;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .portfolio-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: var(--slate-950);
          color: var(--slate-100);
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        .three-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* Header Styles */
        header {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(2, 6, 23, 0.9);
          backdrop-filter: blur(20px);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          display: flex;
          height: 3rem;
          width: 3rem;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.2);
          animation: glow 4s ease-in-out infinite;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-name {
          font-size: 1.125rem;
          font-weight: bold;
          color: white;
        }

        .logo-title {
          font-size: 0.75rem;
          color: var(--slate-400);
        }

        nav {
          display: none;
          gap: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          nav {
            display: flex;
          }
        }

        nav.nav-open {
          display: flex;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          background: rgba(2, 6, 23, 0.95);
          backdrop-filter: blur(20px);
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        nav a {
          color: var(--slate-300);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
        }

        nav a:hover {
          color: white;
          transform: scale(1.05);
        }

        nav a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500));
          transition: width 0.3s ease;
        }

        nav a:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .theme-toggle-btn {
          display: flex;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .whatsapp-btn {
          display: flex;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background-color: var(--emerald-500);
          color: white;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .whatsapp-btn:hover {
          background-color: #0da271;
          transform: scale(1.1);
        }

        .hire-btn {
          display: none;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500));
          color: white;
          font-size: 0.875rem;
          font-weight: bold;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        @media (min-width: 768px) {
          .hire-btn {
            display: inline-flex;
          }
        }

        .hire-btn:hover {
          transform: scale(1.05);
        }

        .mobile-menu-toggle {
          display: flex;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .mobile-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        /* Hero Section */
        .hero {
          position: relative;
          padding: 5rem 0;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        @media (min-width: 768px) {
          .hero {
            padding: 8rem 0;
          }
        }

        .hero-grid {
          display: grid;
          gap: 3rem;
          width: 100%;
        }

        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 4rem;
          }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-visual {
          position: relative;
          z-index: 2;
        }

        .availability {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          background: linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
          color: var(--indigo-300);
          font-size: 0.875rem;
          border: 1px solid rgba(99, 102, 241, 0.3);
          backdrop-filter: blur(8px);
          margin-bottom: 2rem;
        }

        .availability-dot {
          height: 0.5rem;
          width: 0.5rem;
          border-radius: 9999px;
          background-color: var(--emerald-400);
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          min-height: 2.5rem;
          color: var(--slate-300);
        }

        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 4.5rem;
          }
          
          .hero-subtitle {
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 5.5rem;
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
        }

        .gradient-text::after {
          content: '';
          position: absolute;
          bottom: -0.75rem;
          left: 0;
          right: 0;
          height: 0.5rem;
          background: linear-gradient(to right, var(--indigo-400), var(--purple-400), var(--fuchsia-400));
          opacity: 0.6;
          filter: blur(0.25rem);
          border-radius: 0.25rem;
        }

        .hero-description {
          font-size: 1.25rem;
          color: var(--slate-300);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        @media (min-width: 768px) {
          .hero-description {
            font-size: 1.5rem;
          }
        }

        .hero-description strong {
          font-weight: bold;
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 1.5rem;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          font-size: 1.125rem;
          font-weight: bold;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.25);
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
        }

        .secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1.125rem;
          font-weight: bold;
          text-decoration: none;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          color: var(--slate-300);
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          color: white;
          transform: scale(1.05);
        }

        /* Floating Card */
        .floating-card {
          position: relative;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: float 6s ease-in-out infinite;
          transition: transform 0.3s ease;
          background: var(--slate-900);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          will-change: transform;
        }

        .floating-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        }

        .card-content {
          position: relative;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--emerald-300);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-dot {
          height: 0.75rem;
          width: 0.75rem;
          border-radius: 9999px;
          background-color: var(--emerald-400);
          animation: pulse 2s ease-in-out infinite;
        }

        .location {
          font-size: 0.75rem;
          color: var(--slate-400);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .card-description {
          color: var(--slate-300);
          line-height: 1.7;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .tech-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .tech-item {
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--slate-300);
          transition: all 0.3s ease;
        }

        .tech-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
          color: white;
        }

        .card-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-primary-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500));
          color: white;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .card-primary-btn:hover {
          transform: scale(1.05);
        }

        .card-secondary-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .card-secondary-btn:hover {
          transform: scale(1.05);
        }

        /* Section Styles */
        .section {
          padding: 8rem 0;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 3.75rem;
          }
        }

        .section-description {
          font-size: 1.25rem;
          color: var(--slate-300);
          max-width: 56rem;
          margin: 0 auto;
        }

        /* About Section */
        .about-grid {
          display: grid;
          gap: 3rem;
        }

        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 4rem;
          }
        }

        .about-content h3 {
          font-size: 1.875rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1.5rem;
        }

        .about-text {
          color: var(--slate-300);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          background: var(--blue-500);
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          transform: scale(1.05);
        }

        .github-link {
          background: var(--slate-700);
        }

        .skills-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .skills-container h4 {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .skill {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name {
          color: var(--slate-300);
          font-weight: 500;
        }

        .skill-percentage {
          color: var(--slate-400);
          font-size: 0.875rem;
        }

        .skill-bar {
          height: 0.5rem;
          background-color: var(--slate-800);
          border-radius: 9999px;
          overflow: hidden;
        }

        .skill-progress {
          height: 100%;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500));
          border-radius: 9999px;
          animation: slideIn 1.5s ease-out forwards;
        }

        /* Services Section */
        .services-grid {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card {
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .service-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: 1rem;
          background: linear-gradient(to bottom right, var(--indigo-500), var(--purple-500));
          color: white;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
          font-size: 1.5rem;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .service-description {
          color: var(--slate-300);
          margin-bottom: 1.5rem;
          line-height: 1.7;
          flex-grow: 1;
        }

        .service-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .service-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--slate-400);
        }

        .service-feature::before {
          content: '';
          display: block;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background-color: var(--indigo-400);
        }

        .service-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: linear-gradient(to right, var(--indigo-500), var(--purple-500));
          color: white;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: transform 0.3s ease;
          margin-top: auto;
        }

        .service-button:hover {
          transform: scale(1.05);
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .project-card {
          border-radius: 1.5rem;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .project-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--indigo-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.25rem;
          transition: color 0.3s ease;
        }

        .project-card:hover .project-title {
          color: var(--indigo-300);
        }

        .project-subtitle {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--slate-400);
        }

        .project-status {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .status-live {
          background-color: rgba(16, 185, 129, 0.2);
          color: var(--emerald-300);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-in-progress {
          background-color: rgba(245, 158, 11, 0.2);
          color: var(--amber-300);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .status-coming-soon {
          background-color: rgba(100, 116, 139, 0.2);
          color: var(--slate-300);
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
        }

        .status-live .status-dot {
          background-color: var(--emerald-400);
          animation: pulse 2s ease-in-out infinite;
        }

        .status-in-progress .status-dot {
          background-color: var(--amber-400);
        }

        .status-coming-soon .status-dot {
          background-color: var(--slate-400);
        }

        .project-description {
          color: var(--slate-300);
          font-size: 0.875rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--slate-300);
        }

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--indigo-300);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .project-link:hover {
          color: var(--indigo-200);
          transform: scale(1.05);
        }

        .project-discuss {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--slate-200);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .project-discuss:hover {
          color: white;
          transform: scale(1.05);
        }

        .github-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1.125rem;
          font-weight: bold;
          text-decoration: none;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          margin: 3rem auto 0;
        }

        .github-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        /* Contact Section */
        .contact-grid {
          display: grid;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .contact-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .contact-card:hover {
          transform: scale(1.05);
        }

        .contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: 1rem;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: glow 4s ease-in-out infinite;
          font-size: 1.5rem;
        }

        .whatsapp-icon {
          background: linear-gradient(to bottom right, var(--emerald-500), var(--teal-600));
        }

        .email-icon {
          background: linear-gradient(to bottom right, var(--blue-500), var(--cyan-600));
          animation-delay: 1s;
        }

        .linkedin-icon {
          background: linear-gradient(to bottom right, var(--blue-600), var(--indigo-700));
          animation-delay: 2s;
        }

        .github-icon {
          background: linear-gradient(to bottom right, var(--slate-700), var(--slate-900));
          animation-delay: 3s;
        }

        .contact-card h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .contact-card p {
          color: var(--slate-400);
          font-size: 0.875rem;
        }

        .contact-info {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .whatsapp-info {
          color: var(--emerald-300);
        }

        .email-info {
          color: var(--blue-300);
        }

        .linkedin-info {
          color: var(--blue-300);
        }

        .github-info {
          color: var(--slate-300);
        }

        .cta-card {
          border-radius: 1.5rem;
          padding: 3rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 50rem;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .cta-card {
            padding: 4rem;
          }
        }

        .cta-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.125rem;
          color: var(--slate-300);
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        /* Footer */
        footer {
          padding: 3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }

        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(to bottom right, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .footer-text {
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-text {
            text-align: left;
          }
        }

        .footer-name {
          font-weight: bold;
          color: white;
        }

        .footer-title {
          font-size: 0.875rem;
          color: var(--slate-400);
        }

        .footer-bottom {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 0.875rem;
          color: var(--slate-400);
        }

        .footer-bottom p {
          margin-bottom: 0.5rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
              opacity: 0;
              transform: translateY(2rem);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
              transform: translateY(0px);
          }
          50% {
              transform: translateY(-30px);
          }
        }

        @keyframes glow {
          0%, 100% {
              box-shadow: 0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.2);
          }
          50% {
              box-shadow: 0 0 50px rgba(99, 102, 241, 0.6), 0 0 80px rgba(99, 102, 241, 0.3);
          }
        }

        @keyframes gradient {
          0%, 100% {
              background-position: 0% 50%;
          }
          50% {
              background-position: 100% 50%;
          }
        }

        @keyframes slideIn {
          from {
              width: 0;
          }
          to {
              width: var(--skill-level);
          }
        }

        @keyframes pulse {
          0%, 100% {
              opacity: 1;
          }
          50% {
              opacity: 0.5;
          }
        }

        /* Utility Classes */
        .text-center {
          text-align: center;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .mt-8 {
          margin-top: 2rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        /* Fade In Animation for Elements */
        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .hero-title {
              font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.25rem;
          }
          
          .hero-description {
              font-size: 1.125rem;
          }
          
          .section-title {
              font-size: 2.5rem;
          }
          
          .primary-btn,
          .secondary-btn {
              padding: 0.875rem 1.5rem;
              font-size: 1rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Portfolio;