import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Aos from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    Aos.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: true,
    });

    window.addEventListener("scroll", Aos.refresh);

    return () => {
      window.removeEventListener("scroll", Aos.refresh);
    };
  }, []);

  return (
    <div className="home-container">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content" data-aos="fade-up" data-aos-delay="200">
            <h1 data-aos="zoom-in" data-aos-delay="400">
              Discover Algorithms Through Play
            </h1>
            <p data-aos="fade-up" data-aos-delay="600">
              Welcome to <strong>Games for Learning Algorithms</strong>! Dive into the world of algorithms with interactive games that make learning data structures, sorting, trees, graphs, and more fun and engaging.
            </p>
            <p data-aos="fade-up" data-aos-delay="800">
              Our platform offers a unique approach to learning complex concepts by turning them into interactive, gamified experiences. Whether you're a beginner or an advanced learner, we have something for everyone.
            </p>
            
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 data-aos="fade-up">Explore Algorithm Learning</h2>
          <div className="features-grid">
            {[
              {
                icon: "📚",
                title: "Data Structures",
                desc: "Learn stacks and queues with hands-on games.",
                link: "/datastructure", 
              },
              { icon: "🔄", title: "Sorting", desc: "Visualize Bubble Sort, Insertion Sort, and Selection Sort in action.", link: "/sortinggame" },
              { icon: "🕸️", title: "Graphs", desc: "Master graph traversalsalgorithms like Depth-First Search and Breadth-First Search with visualizations.", link: "/graphs" },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <Link to={feature.link} className="feature-link">
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer data-aos="fade-up" data-aos-delay="200">
          <p>© 2025 Games for Learning Algorithms. All rights reserved.</p>
          <p>
            Contact us at:{" "}
            <a href="mailto:support@learnalgorithms.com" style={{ color: "#b0bec5" }}>
              support@learnalgorithms.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
