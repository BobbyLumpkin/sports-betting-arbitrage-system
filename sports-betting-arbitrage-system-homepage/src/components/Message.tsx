import VigVanquisherLogo from '../assets/VigVanquisher_logo.png';
import './Message.css';

function Message() {
    return (
        <h1 className="banner">
            <span className="banner-content">
                <img
                    src={VigVanquisherLogo}
                    alt="VigVanquisher Logo"
                    className="logo"
                />
                <span className="banner-text">{`Welcome, Compatriots!`}</span>
                <img
                    src={VigVanquisherLogo}
                    alt="VigVanquisher Logo"
                    className="logo"
                />
            </span>
        </h1>
    );
}

export default Message;