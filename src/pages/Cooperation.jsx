import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Cooperation.css';

const directionsData = {
    ru: [
        { icon: "📄", title: "Обмен правовой информацией", color: "#d4a843", desc: "Обмен правовой информацией и научными изданиями с ведущими правовыми институтами мира." },
        { icon: "🔬", title: "Совместные исследования", color: "#4a709c", desc: "Проведение совместных научных исследований в области права, законотворчества и сравнительного правоведения." },
        { icon: "🏛️", title: "Международные конференции", color: "#1a7a4a", desc: "Организация международных конференций и семинаров по актуальным правовым вопросам в сфере законодательства." },
        { icon: "🎓", title: "Стажировки", color: "#7a4a1a", desc: "Стажировки сотрудников в ведущих зарубежных правовых центрах и международных организациях." },
        { icon: "🤝", title: "Партнёрские связи", color: "#4a1a7a", desc: "Партнёрские связи с правовыми институтами стран СНГ, Европы и Азии." },
        { icon: "🌐", title: "ЕврАзЭС", color: "#1a5a6a", desc: "Участие в заседаниях Совета министров юстиции ЕврАзЭС и развитие правовых связей в рамках интеграции." },
    ],
    kk: [
        { icon: "📄", title: "Құқықтық ақпаратпен алмасу", color: "#d4a843", desc: "Әлемнің жетекші құқықтық институттарымен құқықтық ақпарат және ғылыми басылымдармен алмасу." },
        { icon: "🔬", title: "Бірлескен зерттеулер", color: "#4a709c", desc: "Құқық, заң шығару және салыстырмалы құқықтану саласында бірлескен ғылыми зерттеулер жүргізу." },
        { icon: "🏛️", title: "Халықаралық конференциялар", color: "#1a7a4a", desc: "Заңнама саласындағы өзекті құқықтық мәселелер бойынша халықаралық конференциялар мен семинарлар ұйымдастыру." },
        { icon: "🎓", title: "Тағылымдамалар", color: "#7a4a1a", desc: "Қызметкерлердің жетекші шетелдік құқықтық орталықтарда және халықаралық ұйымдарда тағылымдамадан өтуі." },
        { icon: "🤝", title: "Серіктестік байланыстар", color: "#4a1a7a", desc: "ТМД, Еуропа және Азия елдерінің құқықтық институттарымен серіктестік байланыстар." },
        { icon: "🌐", title: "ЕурАзЭҚ", color: "#1a5a6a", desc: "ЕурАзЭҚ Әділет министрлері кеңесінің отырыстарына қатысу және интеграция шеңберінде құқықтық байланыстарды дамыту." },
    ]
};

const forumHistoryData = {
    ru: [
        { year: "2008", city: "Алматы", event: "10-е заседание Совета министров юстиции при Интеграционном комитете ЕврАзЭС" },
        { year: "2007", city: "Чолпон-Ата", event: "9-е заседание Совета министров юстиции при Интеграционном комитете ЕврАзЭС" },
    ],
    kk: [
        { year: "2008", city: "Алматы", event: "ЕурАзЭҚ Интеграциялық комитеті жанындағы Әділет министрлері кеңесінің 10-шы отырысы" },
        { year: "2007", city: "Шолпан-Ата", event: "ЕурАзЭҚ Интеграциялық комитеті жанындағы Әділет министрлері кеңесінің 9-шы отырысы" },
    ]
};

const partnersData = {
    ru: [
        { name: "Министерство юстиции Российской Федерации", region: "ru", flag: "🇷🇺" },
        { name: "Институт законодательства и сравнительного правоведения при Правительстве РФ", region: "ru", flag: "🇷🇺" },
        { name: "Национальный центр законодательства Кыргызской Республики", region: "kg", flag: "🇰🇬" },
        { name: "Институт законодательства Республики Узбекистан", region: "uz", flag: "🇺🇿" },
        { name: "Министерство юстиции Республики Беларусь", region: "by", flag: "🇧🇾" },
        { name: "Секретариат ЕврАзЭС", region: "int", flag: "🌐" },
        { name: "ОБСЕ / Бюро по демократическим институтам и правам человека", region: "eu", flag: "🇪🇺" },
        { name: "Совет Европы — Венецианская комиссия", region: "eu", flag: "🇪🇺" },
    ],
    kk: [
        { name: "Ресей Федерациясының Әділет министрлігі", region: "ru", flag: "🇷🇺" },
        { name: "РФ Үкіметі жанындағы Заңнама және салыстырмалы құқықтану институты", region: "ru", flag: "🇷🇺" },
        { name: "Қырғыз Республикасының Ұлттық заңнама орталығы", region: "kg", flag: "🇰🇬" },
        { name: "Өзбекстан Республикасының Заңнама институты", region: "uz", flag: "🇺🇿" },
        { name: "Беларусь Республикасының Әділет министрлігі", region: "by", flag: "🇧🇾" },
        { name: "ЕурАзЭҚ Хатшылығы", region: "int", flag: "🌐" },
        { name: "ЕҚЫҰ / Демократиялық институттар және адам құқықтары жөніндегі бюросы", region: "eu", flag: "🇪🇺" },
        { name: "Еуропа Кеңесі — Венеция комиссиясы", region: "eu", flag: "🇪🇺" },
    ]
};

const regionLabels = {
    ru: { all: "Все страны", ru: "Россия", kg: "Кыргызстан", uz: "Узбекистан", by: "Беларусь", int: "Международные организации", eu: "Европа" },
    kk: { all: "Барлық елдер", ru: "Ресей", kg: "Қырғызстан", uz: "Өзбекстан", by: "Беларусь", int: "Халықаралық ұйымдар", eu: "Еуропа" }
};

function useReveal() {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

function Cooperation() {
    const { language } = useLanguage();
    const [heroRef, heroVis] = useReveal();
    const [activeRegion, setActiveRegion] = useState('all');

    const directions = directionsData[language] || directionsData.ru;
    const forumHistory = forumHistoryData[language] || forumHistoryData.ru;
    const partners = partnersData[language] || partnersData.ru;
    const labels = regionLabels[language] || regionLabels.ru;

    const regions = ['all', ...Array.from(new Set(partners.map(p => p.region)))];
    const countriesCount = new Set(partners.map(p => p.region)).size;
    const filteredPartners = activeRegion === 'all' ? partners : partners.filter(p => p.region === activeRegion);

    return (
        <div className="coop-page-new">
            <section className="coop-hero">
                <div className="coop-hero-overlay" />
                <div ref={heroRef} className={`coop-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">{language === 'kk' ? 'Халықаралық деңгей' : 'Международный уровень'}</span>
                    <h1>{language === 'kk' ? 'Ынтымақтастық' : 'Сотрудничество'}</h1>
                    <p>{language === 'kk' ? 'Институт ТМД және алыс шет елдердің жетекші құқықтық орталықтарымен және ұйымдарымен халықаралық ғылыми байланыстарды белсенді дамытуда' : 'Институт активно развивает международные научные связи с ведущими правовыми центрами и организациями государств СНГ и дальнего зарубежья'}</p>
                </div>
            </section>

            <section className="coop-directions">
                <div className="coop-container">
                    <CoopSection title={language === 'kk' ? 'Негізгі бағыттар' : 'Основные направления'}>
                        <div className="coop-grid">
                            {directions.map((d, i) => (
                                <CoopCard key={i} d={d} delay={i * 80} />
                            ))}
                        </div>
                    </CoopSection>
                </div>
            </section>

            <section className="coop-partners-section">
                <div className="coop-container">
                    <CoopSection title={language === 'kk' ? 'Халықаралық серіктестер' : 'Международные партнёры'}>
                        <div className="partners-stats">
                            <div className="partners-stat">
                                <strong>{countriesCount}</strong>
                                <span>{language === 'kk' ? 'ел-серіктес' : 'стран-партнёров'}</span>
                            </div>
                            <div className="partners-stat">
                                <strong>{partners.length}</strong>
                                <span>{language === 'kk' ? 'ұйым-серіктес' : 'организаций-партнёров'}</span>
                            </div>
                            <div className="partners-stat">
                                <strong>{forumHistory.length}</strong>
                                <span>{language === 'kk' ? 'халықаралық форум' : 'международных форумов'}</span>
                            </div>
                        </div>

                        <div className="partners-region-tabs">
                            {regions.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    className={`partners-region-tab ${activeRegion === r ? 'active' : ''}`}
                                    onClick={() => setActiveRegion(r)}
                                >
                                    {labels[r] || r}
                                </button>
                            ))}
                        </div>

                        <div className="partners-grid">
                            {filteredPartners.map((p, i) => (
                                <PartnerItem key={p.name} name={p.name} flag={p.flag} delay={i * 60} />
                            ))}
                        </div>
                    </CoopSection>
                </div>
            </section>

            <section className="coop-forums">
                <div className="coop-container">
                    <CoopSection title={language === 'kk' ? 'Халықаралық ЕурАзЭҚ форумдары' : 'Международные форумы ЕврАзЭС'}>
                        <div className="forum-list">
                            {forumHistory.map((f, i) => (
                                <ForumItem key={i} f={f} delay={i * 100} language={language} />
                            ))}
                        </div>
                    </CoopSection>
                </div>
            </section>
        </div>
    );
}

function CoopSection({ title, children }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`coop-section-block ${vis ? 'is-visible' : ''}`}>
            <h2 className="coop-section-title">{title}</h2>
            {children}
        </div>
    );
}

function CoopCard({ d, delay }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`coop-dir-card ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms`, '--accent': d.color }}>
            <div className="coop-dir-icon" style={{ background: d.color + '18' }}>{d.icon}</div>
            <h3 style={{ color: d.color }}>{d.title}</h3>
            <p>{d.desc}</p>
            <div className="coop-bar" style={{ background: d.color }} />
        </div>
    );
}

function PartnerItem({ name, flag, delay }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`partner-item ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <span className="partner-flag">{flag}</span>
            <span>{name}</span>
        </div>
    );
}

function ForumItem({ f, delay, language }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`forum-item ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <span className="forum-year">{f.year}</span>
            <div className="forum-body">
                <strong>{language === 'kk' ? 'қ.' : 'г.'} {f.city}</strong>
                <p>{f.event}</p>
            </div>
        </div>
    );
}

export default Cooperation;
