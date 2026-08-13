import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Branches.css';

// Приблизительные координаты городов на схематичной карте (в процентах от контейнера)
const branchesData = {
    ru: [
        { city: "Алматы", region: "Алматинская обл.", address: "ул. Панфилова, 106", phone: "+7 (727) 272-29-63", email: "almaty@zqai.kz", icon: "🌆", x: 76, y: 84, activities: "Правовые исследования, экспертная и научно-аналитическая работа, бесплатная юридическая помощь гражданам." },
        { city: "Актобе", region: "Актюбинская обл.", address: "пр. Абилкайыр хана, 25", phone: "+7 (7132) 54-41-45", email: "aktobe@zqai.kz", icon: "🏙️", x: 16, y: 36, activities: "Единый государственный учёт НПА региона, консультирование граждан и организаций." },
        { city: "Тараз", region: "Жамбылская обл.", address: "ул. Колбасшы Койгельды, 158а", phone: "+7 (7262) 45-15-96", email: "taraz@zqai.kz", icon: "🏘️", x: 54, y: 78, activities: "Мониторинг регионального законодательства, участие в правовых семинарах и круглых столах." },
        { city: "Қарағанды", region: "Карагандинская обл.", address: "ул. Гоголя, 22а", phone: "+7 (7212) 41-89-20", email: "karaganda@zqai.kz", icon: "⚒️", x: 47, y: 46, activities: "Научно-аналитическая работа, взаимодействие с местными исполнительными органами." },
        { city: "Қостанай", region: "Костанайская обл.", address: "ул. Аль-Фараби, 43", phone: "+7 (7142) 54-47-56", email: "kostanay@zqai.kz", icon: "🌾", x: 26, y: 18, activities: "Правовое просвещение населения, экспертиза нормативных правовых актов." },
        { city: "Семей", region: "Абайская обл.", address: "ул. Утепбаева, 5", phone: "+7 (7222) 35-40-88", email: "semey@zqai.kz", icon: "📚", x: 78, y: 24, activities: "Научно-правовые исследования, организация мероприятий по праворазъяснительной работе." },
    ],
    kk: [
        { city: "Алматы", region: "Алматы обл.", address: "Панфилов көш., 106", phone: "+7 (727) 272-29-63", email: "almaty@zqai.kz", icon: "🌆", x: 76, y: 84, activities: "Құқықтық зерттеулер, сараптамалық-ғылыми жұмыс, азаматтарға тегін заң көмегін көрсету." },
        { city: "Ақтөбе", region: "Ақтөбе обл.", address: "Әбілқайыр хан даңғ., 25", phone: "+7 (7132) 54-41-45", email: "aktobe@zqai.kz", icon: "🏙️", x: 16, y: 36, activities: "Өңір бойынша НҚА-ның бірыңғай мемлекеттік есебі, азаматтар мен ұйымдарға консультация беру." },
        { city: "Тараз", region: "Жамбыл обл.", address: "Колбасшы Койгельды көш., 158а", phone: "+7 (7262) 45-15-96", email: "taraz@zqai.kz", icon: "🏘️", x: 54, y: 78, activities: "Өңірлік заңнаманы мониторингілеу, құқықтық семинарлар мен дөңгелек үстелдерге қатысу." },
        { city: "Қарағанды", region: "Қарағанды обл.", address: "Гоголь көш., 22а", phone: "+7 (7212) 41-89-20", email: "karaganda@zqai.kz", icon: "⚒️", x: 47, y: 46, activities: "Ғылыми-талдамалық жұмыс, жергілікті атқарушы органдармен өзара іс-қимыл." },
        { city: "Қостанай", region: "Қостанай обл.", address: "Аль-Фараби көш., 43", phone: "+7 (7142) 54-47-56", email: "kostanay@zqai.kz", icon: "🌾", x: 26, y: 18, activities: "Халықты құқықтық ағарту, нормативтік құқықтық актілерге сараптама жасау." },
        { city: "Семей", region: "Абай обл.", address: "Утепбаева көш., 5", phone: "+7 (7222) 35-40-88", email: "semey@zqai.kz", icon: "📚", x: 78, y: 24, activities: "Ғылыми-құқықтық зерттеулер, праворазъяснительная жұмыс бойынша іс-шаралар ұйымдастыру." },
    ]
};

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

/* Схематичная интерактивная карта РК с метками филиалов */
function BranchesMap({ branches, language, activeCity, onPinClick }) {
    return (
        <div className="branches-map-wrap">
            <div className="branches-map-panel">
                <div className="branches-map-silhouette">
                    {branches.map((b, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`branch-pin ${activeCity === b.city ? 'active' : ''}`}
                            style={{ left: `${b.x}%`, top: `${b.y}%` }}
                            onClick={() => onPinClick(b.city)}
                            title={b.city}
                        >
                            <span className="branch-pin-dot" />
                            <span className="branch-pin-label">{b.city}</span>
                        </button>
                    ))}
                </div>
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
