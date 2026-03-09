import { FiClock, FiChevronRight } from 'react-icons/fi';

export default function RecentStories({ stories, onSelect }) {
    if (!stories || stories.length === 0) return null;

    const truncate = (text, max = 120) =>
        text.length > max ? text.slice(0, max) + '…' : text;

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <section className="recent-stories">
            <div className="section-header">
                <h2 className="section-title">
                    <FiClock className="section-icon" />
                    Previous Episodes
                </h2>
                <span className="section-badge">{stories.length}</span>
            </div>
            <div className="stories-grid">
                {stories.map((item) => (
                    <button
                        key={item.id}
                        className="recent-card"
                        onClick={() => onSelect(item)}
                    >
                        <div className="recent-card-top">
                            <pre className="recent-error">{truncate(item.stackTrace, 80)}</pre>
                            <span className="recent-time">{formatDate(item.createdAt)}</span>
                        </div>
                        {item.title && <div className="recent-title">{item.title}</div>}
                        <p className="recent-story-preview">{truncate(item.story, 140)}</p>
                        <div className="recent-card-footer">
                            <span className="read-more">
                                Watch full episode <FiChevronRight />
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
