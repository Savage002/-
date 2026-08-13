import './Footer.css';
import { useLanguage } from '../../context/useLanguage';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const socialLinks = [
    {
        name: 'Instagram',
        href: 'https://instagram.com/zqai.kz',
        path: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65C4.28 8.7 4.27 9.02 4.27 12s.01 2.99.06 4.04c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.87-.18-1.34-.3-1.65a2.74 2.74 0 0 0-.66-1.02 2.74 2.74 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7zm5.35-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z'
    },
    {
        name: 'Facebook',
        href: 'https://facebook.com/zqai.kz',
        path: 'M13.5 21v-8.1h2.72l.41-3.16h-3.13V7.73c0-.91.25-1.53 1.56-1.53h1.66V3.38C15.92 3.26 15 3.2 14.06 3.2c-2.35 0-3.96 1.44-3.96 4.07v2.47H7.37v3.16h2.73V21h3.4z'
    },
    {
        name: 'Telegram',
        href: 'https://t.me/zqai_kz',
        path: 'M21.9 4.6 18.7 19.9c-.24 1.08-.87 1.34-1.76.84l-4.86-3.58-2.34 2.25c-.26.26-.48.48-.97.48l.35-4.9L18.4 7.2c.4-.36-.09-.56-.63-.2L6.3 13.4l-4.83-1.5c-1.05-.33-1.07-1.05.22-1.55L20.6 3.34c.87-.32 1.63.2 1.3 1.26z'
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/zqai',
        path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06C21.9 8.58 23 10.9 23 14.13V21h-4v-6.02c0-1.44-.03-3.29-2.01-3.29-2.02 0-2.33 1.57-2.33 3.19V21h-4V9z'
    }
];

const usefulLinks = [
    { name: 'gov.kz', href: 'https://www.gov.kz' },
    { name: 'adilet.zan.kz', href: 'https://adilet.zan.kz' },
    { name: 'egov.kz', href: 'https://egov.kz' },
    { name: 'Министерство юстиции РК', href: 'https://www.gov.kz/memleket/entities/adilet' }
];

export default function Footer() {
    const { language } = useLanguage();
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const nav = [
        { to: '/news', label: language === 'kk' ? 'Жаңалықтар' : 'Новости' },
        { to: '/Editions', label: language === 'kk' ? 'Басылымдар' : 'Публикации' },
        { to: '/Branches', label: language === 'kk' ? 'Филиалдар' : 'Филиалы' },
        { to: '/Cooperation', label: language === 'kk' ? 'Ынтымақтастық' : 'Мероприятия и сотрудничество' },
    ];

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-col footer-col-main">
                        <strong>{language === 'kk' ? 'ҚР Заңнама және құқықтық ақпарат институты' : 'Институт законодательства и правовой информации РК'}</strong>
                        <div className="footer-contacts footer-contacts-left">
                            <span>{language === 'kk' ? 'Телефон' : 'Телефон'}: <a href="tel:+7717226-61-22">+7 (7172) 26-61-22</a></span>
                            <span>E-mail: <a href="mailto:npa@zqai.kz">npa@zqai.kz</a></span>
                        </div>
                        <div className="footer-social">
                            {socialLinks.map((s) => (
                                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="footer-social-icon">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={s.path} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>{language === 'kk' ? 'Навигация' : 'Навигация'}</h4>
                        <ul className="footer-links">
                            {nav.map((n) => (
                                <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>{language === 'kk' ? 'Пайдалы сілтемелер' : 'Полезные ссылки'}</h4>
                        <ul className="footer-links">
                            {usefulLinks.map((l) => (
                                <li key={l.name}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 {language === 'kk' ? 'ЗҚАИ – НИСИ. Барлық құқықтар қорғалған.' : 'ИЗПИ РК. Все права защищены.'}</p>
                </div>
            </div>

            <button
                className={`footer-top-btn ${showTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label={language === 'kk' ? 'Жоғарыға' : 'Наверх'}
            >
                ↑
            </button>
        </footer>
    );
}
