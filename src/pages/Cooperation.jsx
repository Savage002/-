import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './Cooperation.css';

const directionsData = {
    ru: [
        { icon: "document", title: "Обмен правовой информацией", color: "#d4a843", desc: "Обмен правовой информацией и научными изданиями с ведущими правовыми институтами мира." },
        { icon: "research", title: "Совместные исследования", color: "#4a709c", desc: "Проведение совместных научных исследований в области права, законотворчества и сравнительного правоведения." },
        { icon: "landmark", title: "Международные конференции", color: "#1a7a4a", desc: "Организация международных конференций и семинаров по актуальным правовым вопросам в сфере законодательства." },
        { icon: "graduation", title: "Стажировки", color: "#7a4a1a", desc: "Стажировки сотрудников в ведущих зарубежных правовых центрах и международных организациях." },
        { icon: "handshake", title: "Партнёрские связи", color: "#4a1a7a", desc: "Партнёрские связи с правовыми институтами стран СНГ, Европы и Азии." },
        { icon: "globe", title: "ЕврАзЭС", color: "#1a5a6a", desc: "Участие в заседаниях Совета министров юстиции ЕврАзЭС и развитие правовых связей в рамках интеграции." },
    ],
    kk: [
        { icon: "document", title: "Құқықтық ақпаратпен алмасу", color: "#d4a843", desc: "Әлемнің жетекші құқықтық институттарымен құқықтық ақпарат және ғылыми басылымдармен алмасу." },
        { icon: "research", title: "Бірлескен зерттеулер", color: "#4a709c", desc: "Құқық, заң шығару және салыстырмалы құқықтану саласында бірлескен ғылыми зерттеулер жүргізу." },
        { icon: "landmark", title: "Халықаралық конференциялар", color: "#1a7a4a", desc: "Заңнама саласындағы өзекті құқықтық мәселелер бойынша халықаралық конференциялар мен семинарлар ұйымдастыру." },
        { icon: "graduation", title: "Тағылымдамалар", color: "#7a4a1a", desc: "Қызметкерлердің жетекші шетелдік құқықтық орталықтарда және халықаралық ұйымдарда тағылымдамадан өтуі." },
        { icon: "handshake", title: "Серіктестік байланыстар", color: "#4a1a7a", desc: "ТМД, Еуропа және Азия елдерінің құқықтық институттарымен серіктестік байланыстар." },
        { icon: "globe", title: "ЕурАзЭҚ", color: "#1a5a6a", desc: "ЕурАзЭҚ Әділет министрлері кеңесінің отырыстарына қатысу және интеграция шеңберінде құқықтық байланыстарды дамыту." },
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

// Contours projected from real country-border coordinates (Kazakhstan,
// Belarus, Kyrgyzstan, Uzbekistan — same public-domain source and
// equirectangular+cosine projection as the Branches page map). Russia is a
// hand-simplified schematic silhouette (western/central territory only,
// cropped near 95°E) — a full precise trace wasn't reliably extractable
// through available tooling, so this shape favors "recognizable" over
// "surveyed accuracy" for this one territory.
const PARTNERS_MAP_VIEWBOX = '0 0 1040 574';

const TERRITORY_PATHS = {
    kz: "M685.22,443.82 L677.23,447.79 L658.86,462.76 L652.77,478.13 L647.58,478.27 L643.76,468.09 L626.05,467.4 L623.22,449.8 L616.43,449.65 L617.47,428.11 L600.79,412.42 L576.91,414.1 L560.58,417.23 L547.28,397.87 L535.88,389.75 L514.29,374.37 L511.69,372.51 L475.84,385.2 L476.39,464.39 L469.24,465.43 L459.49,448.59 L450.08,442.58 L434.27,447.05 L428.12,454.19 L427.33,448.96 L430.76,440.01 L428.1,432.52 L411.96,425.21 L405.68,405.92 L397.99,400.49 L397.52,393.49 L411.07,395.53 L411.6,379.82 L423.45,376.34 L435.62,379.54 L438.12,358.59 L435.64,345.31 L421.7,346.35 L409.86,341.11 L393.74,350.55 L380.74,355.05 L373.67,351.58 L375.08,340.53 L366.21,326.18 L355.87,326.78 L344.05,312.21 L352.09,295.93 L348.02,291.55 L359.13,267.96 L373.46,280.41 L375.19,264.73 L403.94,241.37 L425.7,240.81 L456.4,255.68 L472.89,264.37 L487.66,255.31 L509.74,254.88 L527.56,266.01 L531.6,259.64 L551.17,260.56 L554.66,250.39 L532.09,235.62 L545.45,225.16 L542.84,219.31 L556.21,213.72 L546.16,199.01 L552.55,191.68 L604.66,184.21 L611.46,178.9 L646.31,170.97 L658.83,162.06 L683.86,166.69 L688.25,188.95 L702.79,183.73 L720.68,191.05 L719.52,202.77 L732.88,201.55 L767.79,181.28 L762.69,188.01 L780.46,204.61 L811.58,259.15 L819,247.91 L838.19,260.28 L858.2,254.76 L865.89,258.62 L872.6,271.04 L882.33,275.2 L888.26,284.32 L906.2,281.45 L913.59,294.58 L902.99,308.88 L891.42,310.89 L890.76,332.43 L883.01,342.13 L855.38,335.07 L845.33,373.52 L838.21,378.3 L810.62,386.88 L823.15,424.19 L813.6,429.78 L814.71,442.02 L806.12,438.87 L799.14,431.15 L778.48,428.91 L755.38,428.32 L750.32,430.68 L730.49,421.65 L722.58,426.1 L720.42,438.78 L697.5,431.38 L688.33,434.41 L685.22,443.82 Z",
    ru: "M79.9,148.86 L86.86,73.69 L184.35,30.74 L323.63,20 L462.9,30.74 L602.18,52.22 L741.45,84.43 L880.73,116.65 L1020,170.34 L1020,266.98 L908.58,266.98 L811.09,256.25 L671.81,256.25 L532.54,256.25 L393.26,256.25 L351.48,320.68 L323.63,406.58 L253.99,417.32 L226.13,385.11 L184.35,342.15 L226.13,277.72 L142.57,234.77 L128.64,170.34 L93.82,159.6 L79.9,148.86 Z",
    by: "M23.96,193.69 L37.43,193.84 L52.55,185.75 L55.78,173.63 L67.2,166.75 L65.89,157.13 L74.36,153.52 L89.32,145.23 L103.98,150.62 L105.96,155.95 L113.27,153.38 L126.89,158.51 L128.25,168.59 L125.26,174.38 L134,188.44 L139.66,192.36 L138.83,196.24 L148.22,200.02 L152.23,205.74 L146.81,210.44 L135.57,209.7 L132.89,211.7 L136.16,218.83 L139.59,232.59 L127.63,233.86 L123.34,238.57 L122.45,249.38 L116.91,247.31 L104.34,248.34 L100.69,243.32 L95.46,247.06 L90.22,243.96 L79.26,243.53 L63.71,238.37 L49.64,236.69 L38.85,237.16 L31.22,242.99 L24.56,243.82 L24.3,234.26 L20,224.31 L28.35,219.93 L28.43,211.37 L24.57,203.2 L23.96,193.69 Z",
    kg: "M685.22,443.82 L688.33,434.41 L697.5,431.38 L720.42,438.78 L722.58,426.1 L730.49,421.65 L750.32,430.68 L755.38,428.32 L778.48,428.91 L799.14,431.15 L806.12,438.87 L814.71,442.02 L812.75,446.88 L790.8,458.51 L785.84,467.04 L767.98,469.59 L762.71,483.3 L747.97,480.42 L738.34,484.62 L725.05,494.77 L726.97,499.79 L723,504.71 L696.67,507.97 L679.46,500.99 L664.36,502.66 L665.68,490.28 L680.84,493.87 L685.94,487.24 L696.53,489.36 L714.37,473.89 L697.86,462.58 L687.94,467.93 L677.66,459.85 L689.35,445.94 L685.22,443.82 Z",
    uz: "M623.33,549.13 L623.71,535.99 L605.18,526.8 L590.62,516.28 L581.54,506.17 L565.61,491.34 L558.76,469.19 L554.09,465.29 L539.03,466.28 L533.7,461.88 L532.21,444.75 L513.44,433.4 L501.71,445.88 L489.81,453.28 L492.1,464.09 L476.39,464.39 L475.84,385.2 L511.69,372.51 L514.29,374.37 L535.88,389.75 L547.28,397.87 L560.58,417.23 L576.91,414.1 L600.79,412.42 L617.47,428.11 L616.43,449.65 L623.22,449.8 L626.05,467.4 L643.76,468.09 L647.58,478.27 L652.77,478.13 L658.86,462.76 L677.23,447.79 L685.22,443.82 L689.35,445.94 L677.66,459.85 L687.94,467.93 L697.86,462.58 L714.37,473.89 L696.53,489.36 L685.94,487.24 L680.19,487.8 L678.19,481.83 L681.1,471.87 L662.47,476.86 L658.05,490.64 L651.43,502.51 L639.8,501.5 L636.19,510.96 L646.41,516.08 L649.42,532.07 L641.59,553.81 L631.09,549.27 L623.33,549.13 Z",
};

const HOME_PIN = { x: 692, y: 252.38 };
const PARTNER_PINS = {
    ru: { x: 220.8, y: 154.11, city: { ru: 'Москва', kk: 'Мәскеу' } },
    by: { x: 80.75, y: 193.95, city: { ru: 'Минск', kk: 'Минск' } },
    kg: { x: 735.46, y: 430.75, city: { ru: 'Бишкек', kk: 'Бішкек' } },
    uz: { x: 661.23, y: 464.33, city: { ru: 'Ташкент', kk: 'Ташкент' } },
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

                        <PartnersMap
                            activeRegion={activeRegion}
                            onSelectRegion={setActiveRegion}
                            language={language}
                        />

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
            <Icon name={d.icon} className="coop-dir-icon" />
            <h3 style={{ color: d.color }}>{d.title}</h3>
            <p>{d.desc}</p>
            <div className="coop-bar" style={{ background: d.color }} />
        </div>
    );
}

function PartnersMap({ activeRegion, onSelectRegion, language }) {
    return (
        <div className="partners-map-panel">
            <svg
                className="partners-map-svg"
                viewBox={PARTNERS_MAP_VIEWBOX}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={language === 'kk' ? 'Серіктес елдер картасы' : 'Карта стран-партнёров'}
            >
                <defs>
                    <linearGradient id="pmFill" x1="15%" y1="0%" x2="85%" y2="100%">
                        <stop offset="0%" stopColor="#2c8a61" />
                        <stop offset="55%" stopColor="#1a6b48" />
                        <stop offset="100%" stopColor="#0f4a30" />
                    </linearGradient>
                    <radialGradient id="pmPinGrad" cx="35%" cy="28%" r="75%">
                        <stop offset="0%" stopColor="#fdf0ce" />
                        <stop offset="45%" stopColor="#f0c26b" />
                        <stop offset="100%" stopColor="#b9812f" />
                    </radialGradient>
                </defs>

                {Object.entries(TERRITORY_PATHS).map(([key, d]) => {
                    const isHome = key === 'kz';
                    const isActive = activeRegion === key;
                    const isDim = !isHome && activeRegion !== 'all' && !isActive;
                    return (
                        <path
                            key={key}
                            d={d}
                            className={`pm-territory ${isHome ? 'is-home' : 'is-partner'} ${isActive ? 'is-active' : ''} ${isDim ? 'is-dim' : ''}`}
                            onClick={!isHome ? () => onSelectRegion(key) : undefined}
                        />
                    );
                })}

                <g className="pm-pin is-home" transform={`translate(${HOME_PIN.x}, ${HOME_PIN.y})`}>
                    <title>{language === 'kk' ? 'ҚР ЗҚАИ (Астана)' : 'ИЗПИ РК (Астана)'}</title>
                    <ellipse className="pm-pin-shadow" cx="0" cy="2.5" rx="8" ry="2.6" />
                    <path className="pm-pin-body" d="M -5.5 -8 L 0 3 L 5.5 -8 Z" />
                    <circle className="pm-pin-body" cx="0" cy="-12.5" r="9" />
                    <path className="pm-pin-star" d="M0 -16.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" />
                </g>

                {Object.entries(PARTNER_PINS).map(([key, p]) => (
                    <g
                        key={key}
                        className={`pm-pin ${activeRegion === key ? 'active' : ''}`}
                        transform={`translate(${p.x}, ${p.y})`}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectRegion(key)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectRegion(key); } }}
                    >
                        <title>{p.city[language] || p.city.ru}</title>
                        <circle className="pm-pin-hit" cy="-11" r="20" />
                        <ellipse className="pm-pin-shadow" cx="0" cy="2.2" rx="8" ry="2.6" />
                        <circle className="pm-pin-halo" cx="0" cy="-12" r="13" />
                        <path className="pm-pin-body" d="M -5.5 -8 L 0 3 L 5.5 -8 Z" />
                        <circle className="pm-pin-body" cx="0" cy="-12.5" r="9" />
                        <text className="pm-pin-label" y="17" textAnchor="middle">{p.city[language] || p.city.ru}</text>
                    </g>
                ))}
            </svg>
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
