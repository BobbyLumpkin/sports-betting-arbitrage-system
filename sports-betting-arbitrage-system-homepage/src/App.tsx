import BlogCard from "./components/BlogCard";
import Message from "./components/Message";
import VigVanquisherLogo from './assets/VigVanquisher_logo.png';

function App() {
  return (
    <div
      style={{
        backgroundColor: "#181818",
        minHeight: "100vh",
        color: "#e0e0e0",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#222",
          padding: "2.0rem 0",
          margin: "0 auto",
        }}
      >
        <Message />
      </div>
      <div style={{ height: "4rem" }} />

      <div className="col" style={{
        backgroundColor: "#222", // dark gray
        color: "#e0e0e0",
        fontFamily: "'Old English Text MT', 'Goudy Old Style', 'Times New Roman', serif",
        fontSize: "1.0rem",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "1.75rem",
        margin: "1rem auto",
        maxWidth: "65%",}}>
          Hearken, Noble Arbitrager,<br /><br />

          Thou art summoned to join our valiant fellowship of sports bettors. Together, we shall embark upon a grand quest, wielding wisdom and cunning to slay the fearsome Vig.<br /><br />

          With steadfast resolve and unity, let us claim the spoils that rightfully belong to the bold.<br /><br />

          Godspeed Compatriots!
        </div>
      
      <div style={{ height: "4rem" }} />

      <BlogCard />
    </div>
  );
}

export default App;