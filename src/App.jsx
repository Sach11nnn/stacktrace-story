import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { generateStory, extractKeywords, getPollinationsUrl } from './gemini';
import Header from './components/Header';
import TraceInput from './components/TraceInput';
import StoryCard from './components/StoryCard';
import RecentStories from './components/RecentStories';

function App() {
    const [story, setStory] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [stackTrace, setStackTrace] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentStories, setRecentStories] = useState([]);
    const [language, setLanguage] = useState('en');

    const fetchRecentStories = async () => {
        try {
            const q = query(
                collection(db, 'stories'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const snapshot = await getDocs(q);
            const stories = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecentStories(stories);
        } catch (err) {
            console.error('Error fetching stories:', err);
        }
    };

    useEffect(() => {
        fetchRecentStories();
    }, []);

    // Extract title from the story (first line starting with "TITLE: ")
    const extractTitle = (storyText) => {
        const lines = storyText.split('\n');
        for (const line of lines) {
            const trimmed = line.trim().replace(/\*\*/g, '');
            if (trimmed.startsWith('TITLE:')) {
                return trimmed.replace('TITLE:', '').trim();
            }
        }
        return language === 'hi'
            ? '🎬 एक महाकाव्य बग की कहानी'
            : '🎬 An Epic Tale of Code Gone Wrong';
    };

    const handleSubmit = async (trace) => {
        setLoading(true);
        setError('');
        setStory('');
        setStoryTitle('');
        setImageUrl('');
        setStackTrace(trace);

        try {
            const generatedStory = await generateStory(trace, language);
            const title = extractTitle(generatedStory);
            setStory(generatedStory);
            setStoryTitle(title);

            // Generate image from keywords
            const keywords = extractKeywords(trace, generatedStory);
            const imgUrl = getPollinationsUrl(keywords);
            setImageUrl(imgUrl);

            // Save to Firestore
            try {
                await addDoc(collection(db, 'stories'), {
                    stackTrace: trace,
                    story: generatedStory,
                    title: title,
                    language: language,
                    imageUrl: imgUrl,
                    createdAt: serverTimestamp(),
                });
                fetchRecentStories();
            } catch (firebaseErr) {
                console.error('Error saving to Firestore:', firebaseErr);
            }
        } catch (err) {
            console.error('Error generating story:', err);
            setError(
                'Failed to generate story. Please check your connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRecent = (item) => {
        setStory(item.story);
        setStackTrace(item.stackTrace);
        setStoryTitle(item.title || '🎬 An Epic Tale');
        setImageUrl(item.imageUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <div className="app">
            {/* Background effects */}
            <div className="bg-vignette" />
            <div className="bg-grain" />
            <div className="bg-spotlight bg-spotlight-1" />
            <div className="bg-spotlight bg-spotlight-2" />

            <main className="container">
                <Header language={language} onToggleLanguage={handleToggleLanguage} />

                <TraceInput onSubmit={handleSubmit} loading={loading} />

                {error && (
                    <div className="error-banner fade-in">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <StoryCard
                    story={story}
                    stackTrace={stackTrace}
                    imageUrl={imageUrl}
                    title={storyTitle}
                />

                <RecentStories
                    stories={recentStories}
                    onSelect={handleSelectRecent}
                />
            </main>

            <footer className="footer">
                <p>
                    Built with 🎬 React + Firebase + Groq AI &mdash;
                    <span className="footer-accent"> StackTrace Story</span>
                </p>
            </footer>
        </div>
    );
}

export default App;
