import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Corruption.css';

const anticorDocsData = {
    ru: [
        { title: "ИЗПИ — политика противодействия коррупции", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D0%BA%D0%BE%D1%80%D1%80%D1%83%D0%BF%D1%86%D0%B8%D0%B8.pdf", icon: "📄" },
        { title: "ИЗПИ — положение комплаенс-офицера", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B0%D0%B5%D0%BD%D1%81-%D0%BE%D1%84%D0%B8%D1%86%D0%B5%D1%80%D0%B0.docx.pdf.pdf", icon: "👤" },
        { title: "ИЗПИ — правила проведения служебного расследования", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%A1%D0%A0.docx.pdf.pdf", icon: "🔍" },
        { title: "ИЗПИ — регламент горячей линии", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%20%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B5%D0%B9%20%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8.docx.pdf.pdf", icon: "📞" },
        { title: "ИЗПИ — регламент личного приёма", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%20%D0%9B%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0.docx.pdf.pdf", icon: "🤝" },
    ],
    kk: [
        { title: "ЗҚАИ — сыбайлас жемқорлыққа қарсы іс-қимыл саясаты", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D0%BA%D0%BE%D1%80%D1%80%D1%83%D0%BF%D1%86%D0%B8%D0%B8.pdf", icon: "📄" },
        { title: "ЗҚАИ — комплаенс-офицер ережесі", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B0%D0%B5%D0%BD%D1%81-%D0%BE%D1%84%D0%B8%D1%86%D0%B5%D1%80%D0%B0.docx.pdf.pdf", icon: "👤" },
        { title: "ЗҚАИ — қызметтік тергеу жүргізу қағидалары", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%A1%D0%A0.docx.pdf.pdf", icon: "🔍" },
        { title: "ЗҚАИ — жедел желі регламенті", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%20%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B5%D0%B9%20%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8.docx.pdf.pdf", icon: "📞" },
        { title: "ЗҚАИ — жеке қабылдау регламенті", href: "https://zqai.kz/sites/default/files/2025-11/%D0%98%D0%97%D0%9F%D0%98-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%20%D0%9B%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%B8%D0%B5%D0%BC%D0%B0.docx.pdf.pdf", icon: "🤝" },
    ]
};

const standardsData = {
    ru: [
        { icon: "📋", text: "Формирование и соблюдение антикоррупционных стандартов" },
        { icon: "💰", text: "Финансовый контроль" },
        { icon: "🚫", text: "Антикоррупционные ограничения" },
        { icon: "⚖️", text: "Предотвращение и разрешение конфликта интересов" },
        { icon: "📢", text: "Сообщение о коррупционных правонарушениях" },
        { icon: "🔄", text: "Устранение последствий коррупционных правонарушений" },
    ],
    kk: [
        { icon: "📋", text: "Сыбайлас жемқорлыққа қарсы стандарттарды қалыптастыру және сақтау" },
        { icon: "💰", text: "Қаржылық бақылау" },
        { icon: "🚫", text: "Сыбайлас жемқорлыққа қарсы шектеулер" },
        { icon: "⚖️", text: "Мүдделер қақтығысының алдын алу және шешу" },
        { icon: "📢", text: "Сыбайлас жемқорлық құқық бұзушылықтар туралы хабарлау" },
        { icon: "🔄", text: "Сыбайлас жемқорлық құқық бұзушылықтардың салдарын жою" },
    ]
};

function useReveal() {
    const ref = useRef(null); const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

function Corruption() {
    const { language } = useLanguage();
    const [heroRef, heroVis] = useReveal();

    const standards = standardsData[language] || standardsData.ru;
    const anticorDocs = anticorDocsData[language] || anticorDocsData.ru;

    return (
        <div className="corruption-page-new">
            <section className="anticor-hero">
                <div className="anticor-hero-overlay" />
                <div ref={heroRef} className={`anticor-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">{language === 'kk' ? 'Ашықтық және адалдық' : 'Прозрачность и честность'}</span>
                    <h1>{language === 'kk' ? 'Сыбайлас жемқорлыққа қарсы іс-қимыл' : 'Противодействие коррупции'}</h1>
                    <p>{language === 'kk' ? 'ҚР Заңнама және құқықтық ақпарат институты «Сыбайлас жемқорлыққа қарсы іс-қимыл туралы» ҚР Заңына сәйкес сыбайлас жемқорлықтың алдын алу және оған қарсы іс-қимыл бойынша дәйекті саясат жүргізеді' : 'Институт законодательства и правовой информации РК проводит последовательную политику по предупреждению и противодействию коррупции в соответствии с Законом РК «О противодействии коррупции»'}</p>
                </div>
            </section>

            <section className="anticor-hotline">
                <HotlineCard language={language} />
            </section>

            <section className="anticor-standards-section">
                <div className="anticor-container">
                    <SectionHeader 
                        eyebrow={language === 'kk' ? 'Жұмыс бағыттары' : 'Направления работы'} 
                        title={language === 'kk' ? 'Сыбайлас жемқорлыққа қарсы стандарттар' : 'Антикоррупционные стандарты'} 
                    />
                    <div className="anticor-standards-grid">
                        {standards.map((s, i) => (
                            <StandardCard key={i} s={s} delay={i * 70} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="anticor-docs-section">
                <div className="anticor-container">
                    <SectionHeader 
                        eyebrow={language === 'kk' ? 'Құжаттар' : 'Документы'} 
                        title={language === 'kk' ? 'ЗҚАИ нормативтік құжаттары' : 'Нормативные документы ИЗПИ'} 
                    />
                    <div className="anticor-docs-list">
                        {anticorDocs.map((d, i) => (
                            <DocItem key={i} d={d} delay={i * 80} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="anticor-agency-section">
                <div className="anticor-container">
                    <AgencyCard language={language} />
                </div>
            </section>
        </div>
    );
}

function HotlineCard({ language }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`hotline-card ${vis ? 'is-visible' : ''}`}>
            <div className="hotline-icon">🛡️</div>
            <div className="hotline-text">
                <h2>{language === 'kk' ? 'Сыбайлас жемқорлық бойынша жедел желі' : 'Горячая линия по коррупции'}</h2>
                <p>{language === 'kk' ? 'Сыбайлас жемқорлық құқық бұзушылық фактілері туралы хабарлау үшін:' : 'Для сообщения о фактах коррупционных правонарушений:'}</p>
                <div className="hotline-contacts">
                    <a href="mailto:anticorruption@zqai.kz" className="hotline-contact-btn email">✉️ anticorruption@zqai.kz</a>
                    <a href="tel:+77172576507" className="hotline-contact-btn phone">📞 +7 (7172) 57-65-07</a>
                </div>
                <p className="hotline-note">{language === 'kk' ? 'Барлық өтініштер тіркеледі және заңнамада белгіленген мерзімде қаралады. Анонимдікке кепілдік беріледі.' : 'Все обращения регистрируются и рассматриваются в установленные законодательством сроки. Анонимность гарантируется.'}</p>
            </div>
        </div>
    );
}

function SectionHeader({ eyebrow, title }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`anticor-sec-header ${vis ? 'is-visible' : ''}`}>
            <span className="page-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
        </div>
    );
}

function StandardCard({ s, delay }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`standard-card ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <span className="standard-icon">{s.icon}</span>
            <p>{s.text}</p>
        </div>
    );
}

function DocItem({ d, delay }) {
    const [ref, vis] = useReveal();
    return (
        <a ref={ref} href={d.href} target="_blank" rel="noopener noreferrer"
            className={`doc-item ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <span className="doc-icon">{d.icon}</span>
            <span className="doc-title">{d.title}</span>
            <span className="doc-arrow">↓ PDF</span>
        </a>
    );
}

function AgencyCard({ language }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`agency-card ${vis ? 'is-visible' : ''}`}>
            <h3>{language === 'kk' ? 'ҚР Сыбайлас жемқорлыққа қарсы іс-қимыл агенттігі' : 'Агентство РК по противодействию коррупции'}</h3>
            <p>{language === 'kk' ? 'Қазақстан Республикасының Сыбайлас жемқорлыққа қарсы іс-қимыл агенттігіне (Сыбайлас жемқорлыққа қарсы қызмет) өтініш жасау үшін:' : 'Для обращений в Агентство Республики Казахстан по противодействию коррупции (Антикоррупционная служба):'}</p>
            <a href="https://www.gov.kz/memleket/entities/qazaqstan-respyblikasy-sayasy-qazynashy" target="_blank" rel="noopener noreferrer" className="agency-btn">
                {language === 'kk' ? 'Агенттік сайтына өту ↗' : 'Перейти на сайт Агентства ↗'}
            </a>
        </div>
    );
}

export default Corruption;
