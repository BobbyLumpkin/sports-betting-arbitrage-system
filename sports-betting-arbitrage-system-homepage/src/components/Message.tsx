import VigVanquisherLogo from '../assets/VigVanquisher_logo.png';

function Message() {
    return (
        <h1
            style={{
                textAlign: "center",
                color: "#e0e0e0",
                fontFamily: "'Old English Text MT', 'Goudy Old Style', 'Times New Roman', serif",
                fontWeight: "bold",
                fontSize: "3.5rem",
                letterSpacing: "2px",
                margin: 0,
            }}
        >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <img
                    src={VigVanquisherLogo}
                    alt="VigVanquisher Logo"
                    style={{ display: "inline-block", width: "6.5rem", height: "auto", verticalAlign: "middle" }}
                />
                <span style={{ lineHeight: 1 }}>{`Welcome, Compatriots!`}</span>
                <img
                    src={VigVanquisherLogo}
                    alt="VigVanquisher Logo"
                    style={{ display: "inline-block", width: "6.5rem", height: "auto", verticalAlign: "middle" }}
                />
            </span>
        </h1>
    );
}

export default Message;