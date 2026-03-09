import { useState } from 'react';
import { FiCopy, FiShare2, FiCheck } from 'react-icons/fi';

export default function StoryCard({ story, stackTrace, imageUrl, title }) {
    const [copied, setCopied] = useState(false);

    if (!story) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(story);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = story;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: title || 'StackTrace Story',
            text: story,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch { /* cancelled */ }
        } else {
            handleCopy();
        }
    };

    // Parse story: remove title line from body if present
    const storyBody = story
        .split('\n')
        .filter(line => !line.trim().startsWith('TITLE:'))
        .join('\n')
        .trim();

    const renderStory = (text) => {
        return text.split('\n').map((line, i) => {
            if (!line.trim()) return <br key={i} />;

            // Bold text **...**
            const parts = [];
            let lastIdx = 0;
            const boldRegex = /\*\*(.*?)\*\*/g;
            let match;

            while ((match = boldRegex.exec(line)) !== null) {
                if (match.index > lastIdx) {
                    parts.push(line.slice(lastIdx, match.index));
                }
                parts.push(<strong key={`b-${i}-${match.index}`}>{match[1]}</strong>);
                lastIdx = match.index + match[0].length;
            }
            if (lastIdx < line.length) {
                parts.push(line.slice(lastIdx));
            }

            return (
                <p key={i} className="story-paragraph">
                    {parts.length > 0 ? parts : line}
                </p>
            );
        });
    };

    return (
        <div className="story-card fade-in">
            {/* Cinematic banner image */}
            {imageUrl && (
                <div className="story-image-wrapper">
                    <img
                        src={imageUrl}
                        alt="Cinematic story banner"
                        className="story-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="story-image-overlay" />
                </div>
            )}

            {/* Movie title */}
            {title && (
                <div className="story-title-bar">
                    <h2 className="story-title">{title}</h2>
                </div>
            )}

            {/* Story content */}
            <div className="story-content">
                {renderStory(storyBody)}
            </div>

            {/* Actions */}
            <div className="story-card-footer">
                <div className="story-actions">
                    <button className="action-btn" onClick={handleCopy} title="Copy story">
                        {copied ? <FiCheck className="check-icon" /> : <FiCopy />}
                        {copied ? 'Copied!' : 'Copy Story'}
                    </button>
                    <button className="action-btn share-btn" onClick={handleShare} title="Share story">
                        <FiShare2 />
                        Share
                    </button>
                </div>
                <details className="original-error">
                    <summary>View original error</summary>
                    <pre className="error-preview">{stackTrace}</pre>
                </details>
            </div>
        </div>
    );
}
