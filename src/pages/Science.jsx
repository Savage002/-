import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Science.css';

const categoriesData = {
    ru: [
        {
            icon: "⚖️",
            title: "Правовая экспертиза",
            color: "#d4a843",
            items: [
                "Научная правовая экспертиза проектов законов и международных договоров Республики Казахстан.",
                "Лингвистическая экспертиза проектов законодательных актов на соответствие нормам литературного языка и юридической терминологии.",
                "Анализ эффективности законодательства и нормативных правовых актов.",
            ]
        },
        {
            icon: "🔬",
            title: "Научные исследования",
            color: "#4a709c",
            items: [
                "Разработка научных концепций развития законодательства Республики Казахстан.",
                "Проведение фундаментальных и прикладных исследований в области законотворчества и правовой информации.",
                "Проведение сравнительно-правовых исследований зарубежного опыта.",
                "Подготовка научно-практических комментариев к кодексам и законам Республики Казахстан.",
            ]
        },
        {
            icon: "🌐",
            title: "Международное сотрудничество",
            color: "#1a7a4a",
            items: [
                "Развитие научных связей с научными учреждениями других государств и международными организациями.",
                "Участие в международных научных и научно-практических конференциях, семинарах, круглых столах.",
                "Оказание научных экспертно-консультационных услуг.",
            ]
        },
        {
            icon: "📋",
            title: "Правовая информация",
            color: "#7a4a1a",
            items: [
                "Взаимодействие с государственными органами по вопросам законотворчества.",
                "Оказание услуг по переводу законодательства и правовой информации.",
                "Экспертно-консультационные услуги государственным органам и организациям.",
            ]
        },
    ],
    kk: [
        {
            icon: "⚖️",
            title: "Құқықтық сараптама",
            color: "#d4a843",
            items: [
                "Қазақстан Республикасы заңдарының және халықаралық шарттарының жобаларына ғылыми құқықтық сараптама.",
                "Заңнамалық актілер жобаларының әдеби тіл нормаларына және заң терминологиясына сәйкестігіне лингвистикалық сараптама.",
                "Заңнама мен нормативтік құқықтық актілердің тиімділігін талдау.",
            ]
        },
        {
            icon: "🔬",
            title: "Ғылыми зерттеулер",
            color: "#4a709c",
            items: [
                "Қазақстан Республикасының заңнамасын дамытудың ғылыми тұжырымдамаларын әзірлеу.",
                "Заң шығару және құқықтық ақпарат саласындағы іргелі және қолданбалы зерттеулер жүргізу.",
                "Шетелдік тәжірибені салыстырмалы-құқықтық зерттеу.",
                "Қазақстан Республикасының кодекстері мен заңдарына ғылыми-практикалық түсініктемелер дайындау.",
            ]
        },
        {
            icon: "🌐",
            title: "Халықаралық ынтымақтастық",
            color: "#1a7a4a",
            items: [
                "Басқа мемлекеттердің ғылыми мекемелерімен және халықаралық ұйымдармен ғылыми байланыстарды дамыту.",
                "Халықаралық ғылыми және ғылыми-практикалық конференцияларға, семинарларға, дөңгелек үстелдерге қатысу.",
                "Ғылыми сараптамалық-кеңес беру қызметтерін көрсету.",
            ]
        },
        {
            icon: "📋",
            title: "Құқықтық ақпарат",
            color: "#7a4a1a",
            items: [
                "Заң шығару мәселелері бойынша мемлекеттік органдармен өзара іс-қимыл.",
                "Заңнаманы және құқықтық ақпаратты аудару бойынша қызметтер көрсету.",
                "Мемлекеттік органдар мен ұйымдарға сараптамалық-кеңес беру қызметтері.",
            ]
        },
    ]
};

const scienceStatsData = {
    ru: [
        { num: "500+", label: "научных публикаций", icon: "📚" },
        { num: "30+", label: "лет научной деятельности", icon: "🏛️" },
        { num: "50+", label: "международных партнёров", icon: "🌐" },
        { num: "12", label: "направлений экспертизы", icon: "⚖️" },
    ],
    kk: [
        { num: "500+", label: "ғылыми жарияланым", icon: "📚" },
        { num: "30+", label: "жыл ғылыми қызмет", icon: "🏛️" },
        { num: "50+", label: "халықаралық серіктес", icon: "🌐" },
        { num: "12", label: "сараптама бағыты", icon: "⚖️" },
    ]
};

function useReveal() {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

function RevealCard({ children, delay = 0, className = '' }) {
    const [ref, vis] = useReveal();
    return <div ref={ref} className={`reveal-card ${vis ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Science() {
    const { language } = useLanguage();
    const [heroRef, heroVis] = useReveal();

    const categories = categoriesData[language] || categoriesData.ru;
    const scienceStats = scienceStatsData[language] || scienceStatsData.ru;

    return (
        <div className="science-page-new">
            <section className="science-hero">
                <div className="science-hero-bg" />
                <div ref={heroRef} className={`science-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">{language === 'kk' ? 'ҚР ЗҚАИ институты' : 'Институт ИЗПИ РК'}</span>
                    <h1>{language === 'kk' ? 'Ғылыми қызмет' : 'Научная деятельность'}</h1>
                    <p>{language === 'kk' ? 'Қазақстан Республикасының Заңнама және құқықтық ақпарат институты — 1993 жылдан бастап құқық және заң шығару саласындағы жетекші ғылыми орталық' : 'Институт законодательства и правовой информации Республики Казахстан — ведущий научный центр в области права и законотворчества с 1993 года'}</p>
                </div>
            </section>

            <section className="science-stats-bar">
                {scienceStats.map((s, i) => (
                    <RevealCard key={i} delay={i * 80} className="sci-stat">
                        <span className="sci-stat-icon">{s.icon}</span>
                        <strong>{s.num}</strong>
                        <span>{s.label}</span>
                    </RevealCard>
                ))}
            </section>

            <section className="science-activities">
                <div className="sci-container">
                    <RevealCard className="sci-section-header">
                        <span className="page-eyebrow">{language === 'kk' ? 'Негізгі бағыттар' : 'Основные направления'}</span>
                        <h2>{language === 'kk' ? 'Ғылыми қызмет түрлері' : 'Виды научной деятельности'}</h2>
                    </RevealCard>

                    <div className="sci-categories">
                        {categories.map((cat, ci) => (
                            <RevealCard key={ci} delay={ci * 100} className="sci-category">
                                <div className="sci-cat-header" style={{ borderColor: cat.color }}>
                                    <div className="sci-cat-icon" style={{ background: cat.color + '18' }}>
                                        <span>{cat.icon}</span>
                                    </div>
                                    <h3 style={{ color: cat.color }}>{cat.title}</h3>
                                </div>
                                <ul className="sci-items">
                                    {cat.items.map((item, ii) => (
                                        <li key={ii} className="sci-item">
                                            <span className="sci-bullet" style={{ background: cat.color }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </RevealCard>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Science;
