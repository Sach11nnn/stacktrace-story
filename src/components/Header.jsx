import { FiTerminal } from 'react-icons/fi';

export default function Header({ language, onToggleLanguage }) {
    return (
        <header className="header">
            <div className="header-smoke" />
            <div className="header-content">
                <div className="logo-row">
                    <div className="logo-icon">
                        <FiTerminal />
                    </div>
                    <h1 className="logo-text">
                        Stack<span className="logo-accent">Trace</span> Story
                    </h1>
                </div>
                <p className="tagline">
                    Where every bug becomes a blockbuster 🎬
                </p>
                <div className="lang-toggle">
                    <button
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => onToggleLanguage('en')}
                    >
                        English
                    </button>
                    <button
                        className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                        onClick={() => onToggleLanguage('hi')}
                    >
                        हिंदी
                    </button>
                </div>
            </div>
        </header>
    );
}
