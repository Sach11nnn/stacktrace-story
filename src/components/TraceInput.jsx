import { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

export default function TraceInput({ onSubmit, loading }) {
    const [trace, setTrace] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trace.trim() && !loading) {
            onSubmit(trace.trim());
        }
    };

    const charCount = trace.length;
    const MAX_CHARS = 5000;

    return (
        <form className="trace-input" onSubmit={handleSubmit}>
            <div className="input-header">
                <label htmlFor="stacktrace-input" className="input-label">
                    🎬 Paste your error — let the drama unfold
                </label>
                <span className={`char-count ${charCount > MAX_CHARS ? 'over' : ''}`}>
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
            </div>
            <div className="textarea-wrapper">
                <textarea
                    id="stacktrace-input"
                    className="textarea"
                    value={trace}
                    onChange={(e) => setTrace(e.target.value.slice(0, MAX_CHARS))}
                    placeholder={`TypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (UserList.jsx:12:34)\n    at renderWithHooks (react-dom.development.js:14985:18)\n    ...`}
                    rows={8}
                    disabled={loading}
                />
            </div>
            <button
                type="submit"
                className="submit-btn"
                disabled={!trace.trim() || loading || charCount > MAX_CHARS}
            >
                {loading ? (
                    <>
                        <FiLoader className="spin" />
                        Rolling cameras...
                    </>
                ) : (
                    <>
                        <FiSend />
                        Generate Epic Story
                    </>
                )}
            </button>
        </form>
    );
}
