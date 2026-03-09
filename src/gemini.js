const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT_EN = `You are a legendary storyteller who also happens to be an elite software engineer.
Your job is to take an error message or stack trace and turn it into a HILARIOUS, DRAMATIC, CINEMATIC short story
that explains what went wrong — in a way that is both *technically accurate* and *wildly entertaining*.

Rules:
- Start with a dramatic one-line movie-style title for this error (prefix it with "TITLE: ")
- Write in a dramatic narrative style (think: movie trailer meets debugging session)
- Give the error characters, motives, and emotions
- Include real technical explanation woven into the drama
- Use metaphors that developers would appreciate
- Keep it to 3-5 paragraphs
- End with a "Moral of the story" that's both funny AND a real fix/tip
- Use some emojis sparingly for flavor

Make the reader laugh, learn, and want to share it with their team.`;

const SYSTEM_PROMPT_HI = `You are a legendary storyteller who also happens to be an elite software engineer.
Your job is to take an error message or stack trace and turn it into a HILARIOUS, DRAMATIC, CINEMATIC short story
that explains what went wrong.

IMPORTANT: Tell the ENTIRE story in Hindi language (Devanagari script), dramatically, like a Bollywood film.
Think of it as a Bollywood masala thriller — with drama, emotion, action, and comedy.

Rules:
- Start with a dramatic one-line Bollywood-style movie title for this error in Hindi (prefix it with "TITLE: ")
- Write the entire story in Hindi (Devanagari script)
- Use dramatic Bollywood-style narrative
- Give the error characters, motives, and emotions — Bollywood style!
- Include real technical explanation woven into the drama
- Keep it to 3-5 paragraphs
- End with a "कहानी की सीख" (Moral of the story) that's both funny AND a real fix/tip
- Use some emojis sparingly for flavor

Make the reader feel like they just watched a blockbuster Bollywood debugging thriller.`;

export async function generateStory(errorText, language = 'en') {
    const systemPrompt = language === 'hi' ? SYSTEM_PROMPT_HI : SYSTEM_PROMPT_EN;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Turn this error into an epic story: ${errorText}` }
            ],
            max_tokens: 1200
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export function extractKeywords(errorText, story) {
    // Extract meaningful keywords for image generation
    const combined = errorText + ' ' + (story || '');

    // Common programming terms to look for
    const techTerms = [
        'null', 'undefined', 'crash', 'error', 'exception', 'overflow', 'memory',
        'timeout', 'network', 'database', 'server', 'compilation', 'runtime',
        'syntax', 'type', 'reference', 'permission', 'denied', 'fatal',
        'segfault', 'deadlock', 'race condition', 'stack overflow', 'heap',
        'connection', 'refused', 'broken', 'failed', 'missing', 'corrupt'
    ];

    const found = techTerms.filter(term =>
        combined.toLowerCase().includes(term)
    ).slice(0, 3);

    // Build a cinematic prompt
    const baseKeywords = found.length > 0 ? found.join(' ') : 'programming error';
    return `dramatic cinematic dark thriller movie poster, ${baseKeywords}, digital code, neon red glow, cinematic lighting, dark atmosphere, 8k`;
}

export function getPollinationsUrl(keywords) {
    const encoded = encodeURIComponent(keywords);
    return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=400&nologo=true`;
}
