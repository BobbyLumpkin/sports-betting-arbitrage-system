import ArchitectureDiagramTheorem from '../assets/sports-betting-arbitrage-system-architecture-diagram-with-theorem.png';
import CalculatorScreenshot from '../assets/calculator-screenshot.jpg'
import VigVanquisherLogo from '../assets/VigVanquisher_logo.png';

function BlogCard() {
    return (
        <div style={{ width: "75%", margin: "0 auto" }}>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                <div className="col">
                    <div className="card text-center">
                        <img src={ArchitectureDiagramTheorem} className="card-img-top" alt="Architecture Diagram Theorem" />
                        <div className="card-body">
                            <h5 className="card-title">Beating the Vig with AWS</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            <a href="https://www.bobbylumpkin.com/project/sports-betting-arbitrage-system/" className="btn btn-primary stretched-link">Go</a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card text-center">
                        <img src="..." className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Current Arbitrage Opportunities</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card text-center">
                        <img src={CalculatorScreenshot} className="card-img-top" alt="Calculator Screenshot" />
                        <div className="card-body">
                            <h5 className="card-title">Arbitrage Calculator</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
