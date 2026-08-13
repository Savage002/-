import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewsPage.css';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { useLanguage } from '../context/useLanguage';

export default function NewsPage() {
    const { language, t } = useLanguage();
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useScrollAnimation([newsItems]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/news?lang=${language}`);
                const data = await res.json();

                const formattedNews = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    date: new Date(item.created_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ'),
                    image: item.image_url || 'https://via.placeholder.com/300x200'
                }));

                setNewsItems(formattedNews);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };
        fetchNews();
    }, [language]);

    if (loading) return <div className="loading">{t('loading')}</div>;

    return (
        <div className="news-page">
            <div className="news-page-container">
                <h1 className="page-title">{t('allNews')}</h1>

                {newsItems.length === 0 ? (
                    <p className="no-news">{t('noNews')}</p>
                ) : (
                    <div className="news-grid-page">
                        {newsItems.map((item, index) => (
                            <Link
                                to={`/news/${item.id}`}
                                key={index}
                                className="news-card-page fade-in-section"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="news-image-wrapper-page">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="news-content-page">
                                    <span className="news-date-page">{item.date}</span>
                                    <h3 className="news-title-page">{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
