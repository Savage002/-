import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './NewsDetail.css';

export default function NewsDetail() {
    const { id } = useParams();
    const { language } = useLanguage();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        fetch(`/api/news/${id}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setNews(data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const images = news?.images || [];
    const total = images.length;

    const next = useCallback(() => setCurrent(p => (p + 1) % total), [total]);
    const prev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);
    const lbNext = useCallback(() => setLightbox(p => (p + 1) % total), [total]);
    const lbPrev = useCallback(() => setLightbox(p => (p - 1 + total) % total), [total]);

    useEffect(() => {
        if (total <= 1 || isHovered || lightbox !== null) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [total, isHovered, lightbox, next]);

    useEffect(() => {
        if (lightbox === null) return;
        const handler = (e) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight') lbNext();
            if (e.key === 'ArrowLeft') lbPrev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, lbNext, lbPrev]);

    useEffect(() => {
        document.body.style.overflow = lightbox !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    if (loading) return <div className="nd-loading">{language === 'kk' ? 'Жүктелуде...' : 'Загрузка...'}</div>;
    if (!news) return <div className="nd-loading">{language === 'kk' ? 'Жаңалық табылмады' : 'Новость не найдена'}</div>;

    return (
        <div className="nd-page">
            <div className="nd-container">


                <div className="nd-header">
                    <div className="nd-meta">
                        <span className="nd-date">
                            {new Date(news.created_at).toLocaleDateString(
                                news.language === 'kk' ? 'kk-KZ' : 'ru-RU',
                                { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                        </span>
                        <span className="nd-lang">{news.language === 'kk' ? '🇰🇿 Қазақша' : '🇷🇺 Русский'}</span>
                    </div>
                    <h1 className="nd-title">{news.title}</h1>
                </div>


                {total > 0 && (
                    <div
                        className="nd-slider"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {images.map((img, idx) => (
                            <div key={idx} className={`nd-slide ${idx === current ? 'active' : ''}`}>
                                <img
                                    src={img}
                                    alt={language === 'kk' ? `Сурет ${idx + 1}` : `Фото ${idx + 1}`}
                                    onClick={() => setLightbox(idx)}
                                    className="nd-slide-img"
                                    title={language === 'kk' ? 'Көру үшін басыңыз' : 'Нажмите для просмотра'}
                                />
                            </div>
                        ))}


                        <div className="nd-click-hint"><Icon name="search" variant="bare" size={15} /> {language === 'kk' ? 'Көру үшін басыңыз' : 'Нажмите для просмотра'}</div>

                        {total > 1 && (
                            <>
                                <div className="nd-grad-left" />
                                <div className="nd-grad-right" />

                                <button className="nd-btn-prev" onClick={prev}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button className="nd-btn-next" onClick={next}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>

                                <div className="nd-badge">{current + 1} / {total}</div>

                                <div className="nd-dots">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`nd-dot ${idx === current ? 'active' : ''}`}
                                            onClick={() => setCurrent(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}


                <div className="nd-body">
                    {(news.content || '').split('\n').map((para, i) =>
                        para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                    )}
                </div>
            </div>


            {lightbox !== null && (
                <div className="nd-lightbox" onClick={() => setLightbox(null)}>

                    <button className="nd-lb-close" onClick={() => setLightbox(null)}>✕</button>


                    <div className="nd-lb-counter">{lightbox + 1} / {total}</div>


                    <div className="nd-lb-img-wrap" onClick={e => e.stopPropagation()}>
                        <img src={images[lightbox]} alt={language === 'kk' ? `Сурет ${lightbox + 1}` : `Фото ${lightbox + 1}`} className="nd-lb-img" />
                    </div>


                    {total > 1 && (
                        <>
                            <button className="nd-lb-arrow nd-lb-prev" onClick={e => { e.stopPropagation(); lbPrev(); }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <button className="nd-lb-arrow nd-lb-next" onClick={e => { e.stopPropagation(); lbNext(); }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </>
                    )}


                    {total > 1 && (
                        <div className="nd-lb-thumbs" onClick={e => e.stopPropagation()}>
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`nd-lb-thumb ${idx === lightbox ? 'active' : ''}`}
                                    onClick={() => setLightbox(idx)}
                                >
                                    <img src={img} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
