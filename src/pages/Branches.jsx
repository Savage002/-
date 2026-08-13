import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Branches.css';

// Координаты пинов рассчитаны проекцией реальных координат городов (широта/долгота)
// в ту же систему координат, что и контур карты в KZ_MAP_VIEWBOX/KZ_MAP_PATH ниже —
// см. project([lon, lat]) в скрипте генерации, поэтому пины совпадают с реальным
// положением городов на силуэте Казахстана.
const branchesData = {
    ru: [
        { city: "Алматы", region: "Алматинская обл.", address: "ул. Панфилова, 106", phone: "+7 (727) 272-29-63", email: "almaty@zqai.kz", icon: "🌆", x: 763.02, y: 464.72, activities: "Правовые исследования, экспертная и научно-аналитическая работа, бесплатная юридическая помощь гражданам." },
        { city: "Актобе", region: "Актюбинская обл.", address: "пр. Абилкайыр хана, 25", phone: "+7 (7132) 54-41-45", email: "aktobe@zqai.kz", icon: "🏙️", x: 281.67, y: 206.52, activities: "Единый государственный учёт НПА региона, консультирование граждан и организаций." },
        { city: "Тараз", region: "Жамбылская обл.", address: "ул. Колбасшы Койгельды, 158а", phone: "+7 (7262) 45-15-96", email: "taraz@zqai.kz", icon: "🏘️", x: 628.9, y: 476.49, activities: "Мониторинг регионального законодательства, участие в правовых семинарах и круглых столах." },
        { city: "Қарағанды", region: "Карагандинская обл.", address: "ул. Гоголя, 22а", phone: "+7 (7212) 41-89-20", email: "karaganda@zqai.kz", icon: "⚒️", x: 671.52, y: 224.04, activities: "Научно-аналитическая работа, взаимодействие с местными исполнительными органами." },
        { city: "Қостанай", region: "Костанайская обл.", address: "ул. Аль-Фараби, 43", phone: "+7 (7142) 54-47-56", email: "kostanay@zqai.kz", icon: "🌾", x: 439.85, y: 99.17, activities: "Правовое просвещение населения, экспертиза нормативных правовых актов." },
        { city: "Семей", region: "Абайская обл.", address: "ул. Утепбаева, 5", phone: "+7 (7222) 35-40-88", email: "semey@zqai.kz", icon: "📚", x: 845.58, y: 201.87, activities: "Научно-правовые исследования, организация мероприятий по праворазъяснительной работе." },
    ],
    kk: [
        { city: "Алматы", region: "Алматы обл.", address: "Панфилов көш., 106", phone: "+7 (727) 272-29-63", email: "almaty@zqai.kz", icon: "🌆", x: 763.02, y: 464.72, activities: "Құқықтық зерттеулер, сараптамалық-ғылыми жұмыс, азаматтарға тегін заң көмегін көрсету." },
        { city: "Ақтөбе", region: "Ақтөбе обл.", address: "Әбілқайыр хан даңғ., 25", phone: "+7 (7132) 54-41-45", email: "aktobe@zqai.kz", icon: "🏙️", x: 281.67, y: 206.52, activities: "Өңір бойынша НҚА-ның бірыңғай мемлекеттік есебі, азаматтар мен ұйымдарға консультация беру." },
        { city: "Тараз", region: "Жамбыл обл.", address: "Колбасшы Койгельды көш., 158а", phone: "+7 (7262) 45-15-96", email: "taraz@zqai.kz", icon: "🏘️", x: 628.9, y: 476.49, activities: "Өңірлік заңнаманы мониторингілеу, құқықтық семинарлар мен дөңгелек үстелдерге қатысу." },
        { city: "Қарағанды", region: "Қарағанды обл.", address: "Гоголь көш., 22а", phone: "+7 (7212) 41-89-20", email: "karaganda@zqai.kz", icon: "⚒️", x: 671.52, y: 224.04, activities: "Ғылыми-талдамалық жұмыс, жергілікті атқарушы органдармен өзара іс-қимыл." },
        { city: "Қостанай", region: "Қостанай обл.", address: "Аль-Фараби көш., 43", phone: "+7 (7142) 54-47-56", email: "kostanay@zqai.kz", icon: "🌾", x: 439.85, y: 99.17, activities: "Халықты құқықтық ағарту, нормативтік құқықтық актілерге сараптама жасау." },
        { city: "Семей", region: "Абай обл.", address: "Утепбаева көш., 5", phone: "+7 (7222) 35-40-88", email: "semey@zqai.kz", icon: "📚", x: 845.58, y: 201.87, activities: "Ғылыми-құқықтық зерттеулер, праворазъяснительная жұмыс бойынша іс-шаралар ұйымдастыру." },
    ]
};

// Контур Казахстана, спроецированный из реальных координат границы (Natural Earth,
// общественное достояние) в единую систему координат SVG-карты ниже.
const KZ_MAP_VIEWBOX = '0 0 1040 578';
const KZ_MAP_PATH = "M619.02,499.67 L605,506.42 L572.74,531.91 L562.04,558.07 L552.93,558.31 L546.23,540.99 L515.13,539.8 L510.16,509.85 L498.24,509.59 L500.07,472.92 L470.79,446.21 L428.85,449.07 L400.18,454.39 L376.83,421.43 L356.81,407.61 L318.91,381.43 L314.34,378.25 L251.39,399.86 L252.35,534.67 L239.81,536.46 L222.69,507.79 L206.17,497.55 L178.41,505.15 L167.6,517.32 L166.23,508.4 L172.24,493.17 L167.58,480.43 L139.24,467.97 L128.2,435.14 L114.7,425.89 L113.88,413.98 L137.67,417.45 L138.61,390.72 L159.41,384.78 L180.77,390.24 L185.17,354.57 L180.81,331.96 L156.34,333.73 L135.56,324.8 L107.24,340.88 L84.43,348.55 L72.01,342.63 L74.49,323.82 L58.9,299.39 L40.76,300.41 L20,275.61 L34.12,247.9 L26.97,240.44 L46.48,200.27 L71.63,221.48 L74.68,194.77 L125.16,155.01 L163.35,154.06 L217.25,179.38 L246.21,194.17 L272.16,178.74 L310.92,178.01 L342.2,196.96 L349.3,186.11 L383.65,187.68 L389.78,170.37 L350.15,145.22 L373.62,127.41 L369.04,117.45 L392.52,107.94 L374.86,82.9 L386.08,70.42 L477.58,57.7 L489.52,48.66 L550.71,35.17 L572.7,20 L616.64,27.88 L624.34,65.77 L649.87,56.88 L681.28,69.35 L679.25,89.3 L702.71,87.22 L764,52.71 L755.05,64.18 L786.25,92.42 L840.89,185.28 L853.92,166.14 L887.61,187.2 L922.75,177.81 L936.25,184.38 L948.02,205.51 L965.12,212.61 L975.53,228.13 L1007.02,223.23 L1020,245.6 L1001.39,269.94 L981.08,273.36 L979.91,310.02 L966.31,326.55 L917.8,314.52 L900.15,379.98 L887.63,388.12 L839.19,402.73 L861.2,466.24 L844.43,475.76 L846.38,496.6 L831.31,491.24 L819.04,478.1 L782.76,474.27 L742.21,473.27 L733.33,477.3 L698.5,461.93 L684.62,469.5 L680.82,491.08 L640.59,478.49 L624.49,483.65 L619.02,499.67 Z";

function useReveal() {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

/* Интерактивная карта РК (реальный контур границы) с метками филиалов */
function BranchesMap({ branches, language, activeCity, onPinClick }) {
    return (
        <div className="branches-map-wrap">
            <div className="branches-map-panel">
                <svg
                    className="kz-map-svg"
                    viewBox={KZ_MAP_VIEWBOX}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={language === 'kk' ? 'Қазақстан картасы' : 'Карта Казахстана'}
                >
                    <path className="kz-map-path" d={KZ_MAP_PATH} />
                    {branches.map((b, i) => (
                        <g
                            key={i}
                            className={`kz-map-pin ${activeCity === b.city ? 'active' : ''}`}
                            transform={`translate(${b.x}, ${b.y})`}
                            role="button"
                            tabIndex={0}
                            onClick={() => onPinClick(b.city)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPinClick(b.city); } }}
                        >
                            <title>{b.city}</title>
                            <circle className="kz-map-pin-hit" r="20" />
                            <circle className="kz-map-pin-dot" r="7" />
                            <text className="kz-map-pin-label" y="-14" textAnchor="middle">{b.city}</text>
                        </g>
                    ))}
                </svg>
            </div>
            <p className="branches-map-hint">
                {language === 'kk'
                    ? 'Қаланы картадан таңдап, тиісті филиал туралы ақпаратқа өтіңіз.'
                    : 'Выберите город на карте, чтобы перейти к информации о филиале.'}
            </p>
        </div>
    );
}

function BranchCard({ b, delay, language, id, isActive }) {
    const [ref, vis] = useReveal();
    const [expanded, setExpanded] = useState(false);
    return (
        <div
            id={id}
            ref={ref}
            className={`branch-card-new ${vis ? 'is-visible' : ''} ${isActive ? 'is-active' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="branch-icon-wrap">{b.icon}</div>
            <div className="branch-info">
                <div className="branch-city-region">
                    <h3>{b.city}</h3>
                    <span className="branch-region">{b.region}</span>
                </div>
                <p className="branch-address">📍 {language === 'kk' ? 'қ.' : 'г.'} {b.city}, {b.address}</p>
                <div className="branch-contacts">
                    <a href={`tel:${b.phone.replace(/\s|\(|\)|-/g, '')}`} className="branch-phone">📞 {b.phone}</a>
                    <a href={`mailto:${b.email}`} className="branch-email">✉️ {b.email}</a>
                </div>
                <button type="button" className="branch-more-btn" onClick={() => setExpanded(v => !v)}>
                    {expanded
                        ? (language === 'kk' ? 'Жасыру ▲' : 'Свернуть ▲')
                        : (language === 'kk' ? 'Қызмет бағыттары ▼' : 'Направления деятельности ▼')}
                </button>
                {expanded && (
                    <p className="branch-activities">{b.activities}</p>
                )}
            </div>
        </div>
    );
}

function Branches() {
    const { language } = useLanguage();
    const [search, setSearch] = useState('');
    const [heroRef, heroVis] = useReveal();
    const [activeCity, setActiveCity] = useState(null);

    const branches = branchesData[language] || branchesData.ru;
    const filtered = branches.filter(b =>
        b.city.toLowerCase().includes(search.toLowerCase()) ||
        b.region.toLowerCase().includes(search.toLowerCase())
    );

    const slug = (city) => 'branch-' + city.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-');

    const handlePinClick = (city) => {
        setActiveCity(city);
        const el = document.getElementById(slug(city));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="branches-page-new">
            <section className="branches-hero">
                <div ref={heroRef} className={`branches-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">
                        {language === 'kk' ? 'Қазақстан бойынша' : 'По всему Казахстану'}
                    </span>
                    <h1>{language === 'kk' ? 'Өңірлік филиалдар' : 'Региональные филиалы'}</h1>
                    <p>
                        {language === 'kk' 
                            ? `ҚР ӘМ «Қазақстан Республикасының Заңнама және құқықтық ақпарат институты» ШЖҚ РМК филиалдары еліміздің ${branches.length} өңірінде НҚА-ның бірыңғай мемлекеттік есебін және азаматтарға тегін заңгерлік көмек көрсетеді.` 
                            : `Филиалы РГП на ПХВ «Институт законодательства и правовой информации РК» обеспечивают единый государственный учёт НПА и бесплатную юридическую помощь гражданам в ${branches.length} регионах страны.`}
                    </p>
                    <div className="branches-count-badge">
                        {branches.length} {language === 'kk' ? 'өңірлік кеңсе' : 'региональных офисов'}
                    </div>
                </div>
            </section>

            <div className="branches-search-bar">
                <div className="branches-search-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="branches-search-input"
                        placeholder={language === 'kk' ? 'Қала немесе өңір бойынша іздеу...' : 'Поиск по городу или региону...'}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label={language === 'kk' ? 'Іздеу' : 'Поиск'}
                    />
                    {search && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearch('')}
                            aria-label={language === 'kk' ? 'Тазалау' : 'Очистить'}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <section className="branches-map-section">
                <div className="branches-container">
                    <BranchesMap
                        branches={branches}
                        language={language}
                        activeCity={activeCity}
                        onPinClick={handlePinClick}
                    />
                </div>
            </section>

            <section className="branches-container">
                <div className="branches-grid-new">
                    {filtered.map((b, i) => (
                        <BranchCard
                            key={i}
                            b={b}
                            delay={(i % 6) * 70}
                            language={language}
                            id={slug(b.city)}
                            isActive={activeCity === b.city}
                        />
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="branches-empty">
                        <span>🔍</span>
                        <p>{language === 'kk' ? 'Филиал табылмады' : 'Филиал не найден'}</p>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Branches;
