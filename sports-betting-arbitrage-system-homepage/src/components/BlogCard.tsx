import './BlogCard.css';
import ArchitectureDiagramTheorem from '../assets/sports-betting-arbitrage-system-architecture-diagram-with-theorem.png';
import CalculatorScreenshot from '../assets/calculator-screenshot.jpg'
import VigVanquisherLogo from '../assets/VigVanquisher_logo.png';   

function BlogCard() {
    return (
        <div className="blog-wrapper">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                <div className="col">
                    <div className="blog-col">
                        <div className="card text-center blog-card" style={{ backgroundColor: "#222", color: "#e0e0e0", border: "1px solid #333", height: "100%" }}>
                            <img src={ArchitectureDiagramTheorem} className="card-img-top blog-img" alt="Architecture Diagram Theorem" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ height: "180px" }}>
                                <h5 className="card-title">Beating the Vig with AWS</h5>
                                <p className="card-text">Full blog post for a detailed explanation of sports betting arbitrage and how the system is architected in AWS.</p>
                                <a href="https://www.bobbylumpkin.com/project/sports-betting-arbitrage-system/" className="btn btn-primary stretched-link">Go</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="blog-col">
                        <div className="card text-center blog-card" style={{ backgroundColor: "#222", color: "#e0e0e0", border: "1px solid #333", height: "100%" }}>
                            <img src={VigVanquisherLogo} className="card-img-top blog-img" alt="VigVanquisher Logo" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ height: "180px" }}>
                                <h5 className="card-title">Show Me The Code</h5>
                                <p className="card-text">Hah, Nerd!</p>
                                <a href="https://www.arbitragecalculatorapp.com" className="btn btn-primary stretched-link">Go</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="blog-col">
                        <div className="card text-center blog-card" style={{ backgroundColor: "#222", color: "#e0e0e0", border: "1px solid #333", height: "100%" }}>
                            <img src={CalculatorScreenshot} className="card-img-top blog-img" alt="Calculator Screenshot" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ height: "180px" }}>
                                <h5 className="card-title">Arbitrage Calculator</h5>
                                <p className="card-text">Check odds for arbitrage opportunities and calculate stakes, in real time.</p>
                                <a href="https://www.arbitragecalculatorapp.com" className="btn btn-primary stretched-link">Go</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;