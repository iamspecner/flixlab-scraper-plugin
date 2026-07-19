const FLIX_API_BASE = "http://localhost:5000/api"; // Change if hosted remotely

export const scraper = {
    id: "flixlabs-scraper",
    name: "FlixLabs Scraper",
    version: "1.0.0",

    async search(query) {
        try {
            const res = await fetch(`${FLIX_API_BASE}/search?query=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            return data.results.map(item => ({
                id: String(item.id),
                title: item.title || item.name,
                year: item.release_date ? item.release_date.split("-")[0] : null,
                poster: item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : null,
                description: item.overview || "",
                sources: []
            }));
        } catch (err) {
            console.error(`[${this.name}] Search error:`, err);
            return [];
        }
    },

    async get(id) {
        try {
            const res = await fetch(`${FLIX_API_BASE}/details/${encodeURIComponent(id)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const item = await res.json();

            return {
                id: String(item.id),
                title: item.title || item.name,
                year: item.release_date ? item.release_date.split("-")[0] : null,
                poster: item.poster_path
                    ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                    : null,
                description: item.overview || "",
                sources: item.stream_links || []
            };
        } catch (err) {
            console.error(`[${this.name}] Get error:`, err);
            return null;
        }
    }
};
