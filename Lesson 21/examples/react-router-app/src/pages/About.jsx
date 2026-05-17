// src/pages/About.jsx
function About() {
  return (
    <div className="page fade-in">
      <h1>ℹ️ About Us</h1>
      <p className="page-desc">
        We are learning how to build multi-page experiences using React Router.
      </p>
      
      <div className="concept-box">
        <h3>How this works:</h3>
        <p>
          When you clicked the link to get here, React Router matched the URL <code>/about</code> to the 
          <code>&lt;Route path="/about" element=&#123;&lt;About /&gt;&#125; /&gt;</code> in <code>App.jsx</code>. 
          It then rendered this component in the main content area.
        </p>
      </div>
    </div>
  )
}

export default About
