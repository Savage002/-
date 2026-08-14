import './Header.css';
import logo from '../../assets/logo_emblem.png';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
    const { t, language, switchLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();
    const navRef = useRef(null);

    // Close mobile menu on route change — this is a deliberate sync-to-navigation
    // side effect, not state that can be derived during render.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMenuOpen(false);
        setOpenDropdown(null);
    }, [location.pathname]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target) && !e.target.closest('.burger-btn')) {
                setMenuOpen(false);
                setOpenDropdown(null);
            }
        };
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Prevent body scroll when menu open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Update document title dynamically based on language
    useEffect(() => {
        document.title = language === 'kk'
            ? 'ЗҚАИ — Қазақстан Республикасының Заңнама және құқықтық ақпарат институты'
            : 'ИЗПИ — Институт законодательства и правовой информации РК';
    }, [language]);

    const toggleDropdown = (name) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    return (
        <header>
            {/* Верхняя полоса: знак + название слева, вход/язык справа */}
            <div className="header-main">
                <Link to="/" className="brand">
                    <img src={logo} alt={language === 'kk' ? 'ЗҚАИ' : 'ИЗПИ'} className="brand-mark" />
                    <span className="brand-text">
                        <span className="brand-name">{t('heroTitle')}</span>
                    </span>
                </Link>

                <div className="header-top-actions">
                    {user ? (
                        <>
                            <Link to="/dashboard">{t('dashboard')}</Link>
                            <span className="topbar-sep" aria-hidden="true">|</span>
                            <span className="topbar-link" onClick={logout}>{t('logout')}</span>
                        </>
                    ) : (
                        <Link to="/login">{t('login')}</Link>
                    )}
                    <button
                        className="lang-switch"
                        onClick={() => switchLanguage(language === 'ru' ? 'kk' : 'ru')}
                    >
                        {language === 'ru' ? 'ҚАЗ' : 'РУС'}
                    </button>
                </div>

                {/* Burger button */}
                <button
                    className={`burger-btn ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>
            </div>

            {/* Нижняя полоса: навигация по разделам, во всю ширину */}
            <div className="nav-bar">
                <div className={`nav ${menuOpen ? 'mobile-open' : ''}`} ref={navRef}>
                    <ul>
                        <li className={`dropdown ${openDropdown === 'institute' ? 'mobile-dropdown-open' : ''}`}>
                            <span className="dropdown-trigger" onClick={() => toggleDropdown('institute')}>
                                {t('aboutInstitute')} <span className={`dropdown-arrow ${openDropdown === 'institute' ? 'open' : ''}`}>▼</span>
                            </span>
                            <ul className="dropdown-content">
                                <li><Link to="/GraphicPerson">{t('graphicPerson')}</Link></li>
                                <li><Link to="/Structure">{t('structure')}</Link></li>
                                <li><Link to="/RLA">{t('rla')}</Link></li>
                                <li><Link to="/HistoryLLII">{t('history')}</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/Science">{t('science')}</Link></li>
                        <li><Link to="/LegalSupport">{t('legalSupport')}</Link></li>
                        <li><Link to="/Branches">{t('branches')}</Link></li>
                        <li><Link to="/Cooperation">{t('cooperation')}</Link></li>
                        <li className={`dropdown ${openDropdown === 'corruption' ? 'mobile-dropdown-open' : ''}`}>
                            <span className="dropdown-trigger" onClick={() => toggleDropdown('corruption')}>
                                {t('corruption')} <span className={`dropdown-arrow ${openDropdown === 'corruption' ? 'open' : ''}`}>▼</span>
                            </span>
                            <ul className="dropdown-content">
                                <li><Link to="/CallCenter">{t('callCenter')}</Link></li>
                                <li><Link to="/Corruption">{t('antiCorruptionActivity')}</Link></li>
                                <li><Link to="/LegalActs">{t('legalActs')}</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/Editions">{t('editions')}</Link></li>
                        <li><Link to="/Contacts">{t('contacts')}</Link></li>

                        {/* Язык и вход — в бургер-меню на мобильных, на десктопе они в верхней полосе */}
                        <li className="mobile-only lang-switch-li" onClick={() => switchLanguage(language === 'ru' ? 'kk' : 'ru')}>
                            <span>{language === 'ru' ? 'Қазақша' : 'Русский'}</span>
                        </li>
                        {user ? (
                            <>
                                <li className="mobile-only"><Link to="/dashboard">{t('dashboard')}</Link></li>
                                <li className="mobile-only" onClick={logout}><span style={{ cursor: 'pointer' }}>{t('logout')}</span></li>
                            </>
                        ) : (
                            <li className="mobile-only"><Link to="/login">{t('login')}</Link></li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Overlay for mobile */}
            {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
        </header>
    )
}

export default Header;
