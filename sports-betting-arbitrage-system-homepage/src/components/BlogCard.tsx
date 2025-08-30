import ArchitectureDiagramTheorem from '../assets/sports-betting-arbitrage-system-architecture-diagram-with-theorem.png';
import CalculatorScreenshot from '../assets/calculator-screenshot.jpg'
import VigVanquisherLogo from '../assets/VigVanquisher_logo.png';

function BlogCard() {
    return (
        <div style={{ 
            width: "75%",
            margin: "0 auto",
            // backgroundColor: "#222", // dark gray
            // color: "#e0e0e0",
            // border: "1px solid #333",
            // borderRadius: "8px",
            // padding: "1.5rem",
            // margin: "1rem auto",
            // maxWidth: "600px",
            // boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
         }}>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col" style={{
                    backgroundColor: "#222", // dark gray
                    color: "#e0e0e0",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    margin: "1rem auto",
                    maxWidth: "600px",
                    boxShadow: "0 7px 28px rgba(0,0,0,0.4)",}}>
                    <div className="card text-center" style={{ backgroundColor: "#222", color: "#e0e0e0", border: "1px solid #333" }}>
                        <img src={ArchitectureDiagramTheorem} className="card-img-top" alt="Architecture Diagram Theorem" style={{ height: "450px", objectFit: "cover" }} />
                        <div className="card-body">
                            <h5 className="card-title">Beating the Vig with AWS</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            <a href="https://www.bobbylumpkin.com/project/sports-betting-arbitrage-system/" className="btn btn-primary stretched-link">Go</a>
                        </div>
                    </div>
                </div>
                {/* <div className="col">
                    <div className="card text-center">
                        <img src="..." className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Current Arbitrage Opportunities</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div> */}
                <div className="col" style={{
                    backgroundColor: "#222", // dark gray
                    color: "#e0e0e0",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    margin: "1rem auto",
                    maxWidth: "600px",
                    boxShadow: "0 7px 28px rgba(0,0,0,0.4)",}}>
                    <div className="card text-center" style={{ backgroundColor: "#222", color: "#e0e0e0", border: "1px solid #333" }}>
                        <img src={CalculatorScreenshot} className="card-img-top" alt="Calculator Screenshot" style={{ height: "450px", objectFit: "cover" }} />
                        <div className="card-body">
                            <h5 className="card-title">Arbitrage Calculator</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
                            <a href="https://www.arbitragecalculatorapp.com" className="btn btn-primary stretched-link">Go</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
