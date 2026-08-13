import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import './Main.css';

/* SVG Icon components for services */
const ServiceIcon = ({ type }) => {
    const icons = {
        scale: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 7l3-4 3 4M15 7l3-4 3 4M3 7v4a3 3 0 006 0V7M15 7v4a3 3 0 006 0V7" />
            </svg>
        ),
        database: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
        ),
        phone: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
        ),
        research: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6M10 21h4" />
                <path d="M12 3a6 6 0 00-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0012 3z" />
            </svg>
        ),
        building: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9l10-6 10 6" />
                <path d="M3 22h18M5 22v-9M9 22v-9M15 22v-9M19 22v-9" />
            </svg>
        ),
        globe: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
        ),
    };
    return <span className="svc-icon">{icons[type]}</span>;
};

/* SVG Icon components for resources */
const ResourceIcon = ({ type }) => {
    const icons = {
        book: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                <path d="M8 7h8M8 11h6" />
            </svg>
        ),
        gavel: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 7l3-4 3 4M15 7l3-4 3 4M3 7v4a3 3 0 006 0V7M15 7v4a3 3 0 006 0V7" />
            </svg>
        ),
        folder: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M8 13h8M8 17h8" />
            </svg>
        ),
        landmark: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9l10-6 10 6" />
                <path d="M3 22h18M5 22v-9M9 22v-9M15 22v-9M19 22v-9" />
            </svg>
        ),
        search: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
            </svg>
        ),
        headset: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
        ),
        newspaper: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                <path d="M7 8h4v4H7zM13 8h4M13 12h4M7 16h10" />
            </svg>
        ),
        shield: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    };
    return <span className="res-icon">{icons[type]}</span>;
};

const servicesData = {
    ru: [
        { icon: "scale", title: "Правовая экспертиза", desc: "Научная правовая, лингвистическая и антикоррупционная экспертиза проектов Республики Казахстан" },
        { icon: "database", title: "База «Әділет»", desc: "Крупнейшая информационно-правовая база Казахстана — более 200 000 нормативных правовых актов на русском и казахском языках" },
        { icon: "phone", title: "Правовая информационная служба", desc: "Бесплатные юридические консультации для граждан 24/7 по телефону, WhatsApp и Telegram" },
        { icon: "research", title: "Научные исследования", desc: "Фундаментальные и прикладные исследования в области законотворчества, сравнительного правоведения и лингвистики" },
        { icon: "building", title: "Эталонный банк НПА", desc: "Ведение официального Эталонного контрольного банка нормативных правовых актов Республики Казахстан" },
        { icon: "globe", title: "Сравнительное правоведение", desc: "Изучение международного права и мониторинг зарубежного законодательства для совершенствования правовой системы РК" },
    ],
    kk: [
        { icon: "scale", title: "Құқықтық сараптама", desc: "Қазақстан Республикасы заңдарының және халықаралық шарттарының жобаларына ғылыми құқықтық, лингвистикалық сараптама және антикоррупциялық" },
        { icon: "database", title: "«Әділет» базасы", desc: "Қазақстанның ең ірі ақпараттық-құқықтық базасы — орыс және қазақ тілдеріндегі 200 000-нан астам нормативтік құқықтық актілер" },
        { icon: "phone", title: "Құқықтық ақпараттық қызмет", desc: "Азаматтарға телефон, WhatsApp және Telegram арқылы 24/7 тегін заңгерлік кеңес беру" },
        { icon: "research", title: "Ғылыми зерттеулер", desc: "Заң шығару, салыстырмалы құқықтану және лингвистика саласындағы іргелі және қолданбалы зерттеулер" },
        { icon: "building", title: "НҚА Эталондық банкі", desc: "Қазақстан Республикасы нормативтік құқықтық актілерінің ресми Эталондық бақылау банкін жүргізу" },
        { icon: "globe", title: "Салыстырмалы құқықтану", desc: "ҚР құқықтық жүйесін жетілдіру үшін халықаралық құқықты зерделеу және шетелдік заңнамаға мониторинг жүргізу" },
    ]
};

const statsData = {
    ru: [
        { num: 30, suffix: "+", label: "лет деятельности" },
        { num: 200, suffix: "К+", label: "НПА в базе «Әділет»" },
        { num: 6, suffix: "", label: "региональных филиалов" },
        { num: 10000, suffix: "+", label: "правовых экспертиз" },
    ],
    kk: [
        { num: 30, suffix: "+", label: "жыл қызмет" },
        { num: 200, suffix: "К+", label: "«Әділет» базасындағы НҚА" },
        { num: 6, suffix: "", label: "өңірлік филиал" },
        { num: 10000, suffix: "+", label: "құқықтық сараптама" },
    ]
};

const projectsData = {
    ru: [
        { icon: "book", name: "Эталонный банк НПА РК", href: "http://zan.gov.kz/", desc: "Официальная база нормативных правовых актов" },
        { icon: "gavel", name: "ИПС «Әділет»", href: "https://adilet.zan.kz/kaz/", desc: "Крупнейшая правовая система Казахстана" },
        { icon: "folder", name: "База данных «ZAN»", href: "https://zan.kz/ru", desc: "Первая база НПА на государственном языке" },
        { icon: "landmark", name: "Государственный реестр НПА РК", href: "https://zanorda.kz/", desc: "Официальный реестр нормативных актов" },
        { icon: "search", name: "База исследований", href: "https://base.adilet.zan.kz/webapp/", desc: "Научные правовые исследования" },
        { icon: "headset", name: "Правовая информационная служба", href: "http://pis.zqai.kz/", desc: "Бесплатная юридическая помощь гражданам" },
        { icon: "newspaper", name: "Журнал «Вестник ИЗПИ РК»", href: "https://vestnik.zqai.kz/index.php/vestnik/index", desc: "Научный юридический журнал" },
        { icon: "shield", name: "Антикоррупционная экспертиза", href: "https://e-expert.zan.kz/login", desc: "Единая платформа научной антикоррупционной экспертизы" },
    ],
    kk: [
        { icon: "book", name: "ҚР НҚА Эталондық банкі", href: "http://zan.gov.kz/", desc: "Нормативтік құқықтық актілердің ресми базасы" },
        { icon: "gavel", name: "«Әділет» ақпараттық-құқықтық жүйесі", href: "https://adilet.zan.kz/kaz/", desc: "Қазақстанның ең ірі құқықтық жүйесі" },
        { icon: "folder", name: "«ZAN» деректер базасы", href: "https://zan.kz/ru", desc: "Мемлекеттік тілдегі алғашқы НҚА базасы" },
        { icon: "landmark", name: "ҚР НҚА Мемлекеттік тізілімі", href: "https://zanorda.kz/", desc: "Нормативтік актілердің ресми тізілімі" },
        { icon: "search", name: "Зерттеулер базасы", href: "https://base.adilet.zan.kz/webapp/", desc: "Ғылыми құқықтық зерттеулер" },
        { icon: "headset", name: "Құқықтық ақпараттық қызмет", href: "http://pis.zqai.kz/", desc: "Азаматтарға тегін заңгерлік көмек" },
        { icon: "newspaper", name: "«ҚР ЗҚАИ Жаршысы» журналы", href: "https://vestnik.zqai.kz/index.php/vestnik/index", desc: "Ғылыми заң журналы" },
        { icon: "shield", name: "Сыбайлас жемқорлыққа қарсы сараптама", href: "https://e-expert.zan.kz/login", desc: "Ғылыми сыбайлас жемқорлыққа қарсы сараптаманың бірыңғай платформасы" },
    ]
};

const historyMilestonesData = {
    ru: [
        { year: "1993", event: "На основании Указа Президента РК № 1228 созданы Республиканский центр правовой информации и Институт законодательства РК." },
        { year: "1995", event: "В областных центрах Республики Казахстан открыты региональные центры правовой информации." },
        { year: "1998", event: "Научно-исследовательский институт законодательства преобразован в Институт при Министерстве юстиции РК." },
        { year: "1999", event: "Создана База данных «Зан» — первая в Казахстане база НПА на государственном языке." },
        { year: "2004", event: "Институт приобрёл статус научного учреждения, аккредитованного Министерством образования и науки РК." },
        { year: "2011", event: "Организована Правовая информационная служба. Разработана и размещена система «Әділет»." },
        { year: "2014", event: "РЦПИ наделено функцией ведения Эталонного контрольного банка НПА Республики Казахстан." },
        { year: "2019", event: "Постановлением Правительства РК № 149 создан РГП «Институт законодательства и правовой информации РК»." },
    ],
    kk: [
        { year: "1993", event: "ҚР Президентінің № 1228 Жарлығы негізінде Республикалық құқықтық ақпарат орталығы және ҚР Заңнама институты құрылды." },
        { year: "1995", event: "Қазақстан Республикасының облыс орталықтарында өңірлік құқықтық ақпарат орталықтары ашылды." },
        { year: "1998", event: "Заңнама ғылыми-зерттеу институты ҚР Әділет министрлігі жанындағы Институт болып қайта құрылды." },
        { year: "1999", event: "Қазақстанда алғаш рет мемлекеттік тілдегі НҚА базасы — «Заң» деректер базасы құрылды." },
        { year: "2004", event: "Институт ҚР Білім және ғылым министрлігі аккредиттеген ғылыми мекеме мәртебесіне ие болды." },
        { year: "2011", event: "Құқықтық ақпараттық қызмет ұйымдастырылды. «Әділет» жүйесі әзірленіп, орналастырылды." },
        { year: "2014", event: "РҚАО-ға Қазақстан Республикасы НҚА Эталондық бақылау банкін жүргізу функциясы жүктелді." },
        { year: "2019", event: "ҚР Үкіметінің № 149 Қаулысымен «ҚР Заңнама және құқықтық ақпарат институты» РМК құрылды." },
    ]
};

function useCounter(target, suffix, isVisible) {
    const [display, setDisplay] = useState('0');
    useEffect(() => {
        if (!isVisible) return;
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplay(current.toLocaleString('ru-RU') + suffix);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isVisible, target, suffix]);
    return display;
}

function useScrollReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

function StatCard({ num, suffix }) {
    const [ref, visible] = useScrollReveal();
    const display = useCounter(num, suffix, visible);
    return (
        <div ref={ref} className={`hero-stat-anim ${visible ? 'stat-visible' : ''}`}>
            <span className="stat-num-val">{display}</span>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';

function EventsCalendar({ language }) {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetch(`/api/events?lang=${language}`)
            .then(r => r.json())
            .then(data => {
                 setEvents(Array.isArray(data) ? data : []);
            })
            .catch(console.error);
    }, [language]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = language === 'kk' ? 
        ['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'] :
        ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
        
    const dayNames = language === 'kk' ? ['Дс','Сс','Ср','Бс','Жм','Сб','Жк'] : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const tooltipLabels = language === 'kk'
        ? { time: 'Уақыты', location: 'Орны', noTime: 'Көрсетілмеген', noLocation: 'Көрсетілмеген' }
        : { time: 'Время', location: 'Место', noTime: 'Не указано', noLocation: 'Не указано' };

    const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} className="cal-day blank"></div>);
    const days = Array.from({ length: daysInMonth }).map((_, i) => {
        const dayNum = i + 1;
        const dayEvents = events.filter(e => {
            const ed = new Date(e.event_date);
            return ed.getDate() === dayNum && ed.getMonth() === month && ed.getFullYear() === year;
        });

        const hasUpcoming = dayEvents.some(e => !e.news_id);
        const hasPast = dayEvents.some(e => !!e.news_id);
        
        let dayClass = 'cal-day';
        if (hasUpcoming) dayClass += ' has-upcoming';
        else if (hasPast) dayClass += ' has-past';

        return (
            <div key={`day-${dayNum}`} className={dayClass}>
                <span className="day-num">{dayNum}</span>
                <div className="day-events">
                    {dayEvents.map(ev => {
                        const isLinked = !!ev.news_id;
                        return (
                            <div 
                                key={ev.id} 
                                className={`cal-event-badge ${isLinked ? 'ev-green' : 'ev-red'}`}
                                onClick={() => isLinked && navigate(`/news/${ev.news_id}`)}
                                style={{ cursor: isLinked ? 'pointer' : 'default' }}
                            >
                                <span className="cal-event-title">{ev.title}</span>
                                <div className="cal-tooltip">
                                    <strong>{ev.title}</strong>
                                    <span>⏰ {tooltipLabels.time}: {ev.time || tooltipLabels.noTime}</span>
                                    <span>📍 {tooltipLabels.location}: {ev.location || tooltipLabels.noLocation}</span>
                                    {isLinked && (
                                        <span className="cal-tooltip-click-hint">
                                            {language === 'kk' ? '📰 Жаңалықты көру үшін басыңыз' : '📰 Нажмите для перехода к новости'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    });

    return (
        <div className="events-calendar-widget">
            <div className="calendar-header-nav">
                <button onClick={prevMonth} className="cal-nav-btn">&larr;</button>
                <h2>{monthNames[month]} {year}</h2>
                <button onClick={nextMonth} className="cal-nav-btn">&rarr;</button>
            </div>

            {/* Calendar legend */}
            <div className="cal-legend">
                <span className="cal-legend-item">
                    <span className="cal-legend-dot ev-red-dot"></span>
                    {language === 'kk' ? 'Алдағы іс-шара' : 'Предстоящее'}
                </span>
                <span className="cal-legend-item">
                    <span className="cal-legend-dot ev-green-dot"></span>
                    {language === 'kk' ? 'Жаңалыққа сілтеме' : 'Ссылка на новость'}
                </span>
            </div>

            <div className="calendar-grid">
                <div className="cal-weekdays">
                    {dayNames.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="cal-days-grid">
                    {blanks}{days}
                </div>
            </div>
        </div>
    );
}

export default function Main() {
    const { language, t } = useLanguage();
    const [newsItems, setNewsItems] = useState([]);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news?limit=3&lang=${language}`);
                const data = await res.json();
                setNewsItems(data.map(item => ({
                    id: item.id,
                    title: item.title,
                    date: new Date(item.created_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ'),
                    image: item.image_url || null,
                    content: item.content || ''
                })));
            } catch (err) { console.error('Failed to load news:', err); }
        };
        fetchNews();
    }, [language]);


    const displayNews = newsItems.length > 0 ? newsItems : [
        { 
            id: 195, 
            title: language === 'kk' ? "Астанада 2026 жылғы конституциялық реформа аясында Құрылтайға өту және жаңа саяси институттар талқыланды" : "В Астане обсудили переход к Курултаю и новые политические институты в рамках конституционной реформы 2026 года", 
            date: "16.02.2026", 
            image: null,
            content: language === 'kk' ? "Заңнамалық бастамалар, құқықтық сараптамалар мен маңызды мемлекеттік бағдарламалардың жүзеге асырылуы туралы материалдар." : "Материалы о законодательных инициативах, правовых экспертизах и реализации ключевых государственных программ."
        },
        { 
            id: 190, 
            title: language === 'kk' ? "Астанада жаңа Конституция жобасын сараптамалық талқылау өтті" : "В Астане состоялось экспертное обсуждение проекта новой Конституции", 
            date: "10.02.2026", 
            image: null,
            content: language === 'kk' ? "Институт ғалымдары мен сарапшыларының жаңа заң жобаларын талқылауы туралы есептер." : "Отчёты об обсуждении новых законопроектов учеными и экспертами Института законодательства."
        },
        { 
            id: 188, 
            title: language === 'kk' ? "Сарапшылар жаңа Конституция жобасын талқылады: отбасылық құндылықтардың құқықтық іргетасы және әлеуметтік қорғау" : "Эксперты обсудили проект новой Конституции: правовой фундамент семейных ценностей и социальная защита", 
            date: "05.02.2026", 
            image: null,
            content: language === 'kk' ? "Еліміздің құқықтық жүйесін дамыту мен жетілдіру жөніндегі ғылыми-зерттеу жұмыстарының қорытындылары." : "Итоги научно-исследовательских работ по развитию и совершенствованию правовой системы страны."
        },
    ];

    const stats = statsData[language] || statsData.ru;

    return (
        <div className="main-page">
            <section className="hero-section nitec-style">
                <div className="hero-bg-concentric">
                    <div className="bg-circle c1"></div>
                    <div className="bg-circle c2"></div>
                    <div className="bg-circle c3"></div>
                </div>

                <div className={`hero-content-nitec ${heroVisible ? 'hero-visible' : ''}`}>
                    {/* Left Column: News Block */}
                    <div className="hero-news-col">
                        <h2>{language === 'kk' ? 'Соңғы жаңалықтар' : 'Последние новости'}</h2>
                        
                        {/* Latest News Card */}
                        {displayNews[0] && (
                            <Link to={`/news/${displayNews[0].id}`} className="hero-news-main-card">
                                {displayNews[0].image ? (
                                    <img src={displayNews[0].image} alt={displayNews[0].title} className="hero-news-main-img" />
                                ) : (
                                    <div className="hero-news-main-img hero-news-img-placeholder">
                                        <span>📰</span>
                                    </div>
                                )}
                                <div className="hero-news-main-body">
                                    <div>
                                        <span className="hero-news-main-date">📅 {displayNews[0].date}</span>
                                        <h3 className="hero-news-main-title">{displayNews[0].title}</h3>
                                        <p className="hero-news-main-desc">
                                            {displayNews[0].content 
                                                ? (displayNews[0].content.replace(/<[^>]*>/g, '').substring(0, 140) + '...') 
                                                : ''}
                                        </p>
                                    </div>
                                    <span className="hero-news-main-link">
                                        {language === 'kk' ? 'Толығырақ оқу' : 'Читать далее'} →
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Older News Grid (2 cards) */}
                        <div className="hero-news-sub-list">
                            {displayNews.slice(1, 3).map((item) => (
                                <Link key={item.id} to={`/news/${item.id}`} className="hero-news-sub-card">
                                    <h3 className="hero-news-sub-title">{item.title}</h3>
                                    <span className="hero-news-sub-date">📅 {item.date}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Calendar Block */}
                    <div className="hero-cal-col">
                        <h2 className="calendar-section-title">
                            {language === 'kk' ? 'Іс-шаралар күнтізбесі' : 'Календарь мероприятий'}
                        </h2>
                        <EventsCalendar language={language} />
                    </div>
                </div>
            </section>

            <section className="about-stats-bar">
                <div className="about-stats-container">
                    <div className="about-col">
                        <h2>{language === 'kk' ? 'Біз туралы' : 'О нас'}</h2>
                        <p>{language === 'kk' ? 'Қазақстан Республикасының құқықтық жүйесін дамыту және заңнаманы жетілдіру' : 'Ведущий научно-правовой институт страны, обеспечивающий правовую и лингвистическую экспертизу'}</p>
                        <Link to="/HistoryLLII" className="btn-about-link">{language === 'kk' ? 'Толығырақ →' : 'Подробнее →'}</Link>
                    </div>
                    <div className="stats-col">
                        {stats.map((s, i) => (
                            <div key={i} className="stat-card-nitec">
                                <div className="stat-card-icon">
                                    {i === 0 && '★'}
                                    {i === 1 && '🗂️'}
                                    {i === 2 && '🌐'}
                                    {i === 3 && '⚖️'}
                                </div>
                                <div className="stat-card-info">
                                    <span className="stat-label-top">{s.label}</span>
                                    <div className="stat-num-wrapper">
                                        <StatCard num={s.num} suffix={s.suffix} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ServicesSection language={language} />

            <ProjectsSection language={language} />

            <NewsSection displayNews={displayNews} t={t} language={language} />

            <MilestonesTableSection language={language} />

            <ContactInfoSection language={language} />

        </div>
    );
}

function ServicesSection({ language }) {
    const [ref, visible] = useScrollReveal();
    const services = servicesData[language] || servicesData.ru;

    return (
        <section className="services-section" ref={ref}>
            <div className="section-container">
                <div className={`section-header ${visible ? 'fade-up' : ''}`}>
                    <h2>{language === 'kk' ? 'Негізгі қызмет бағыттары' : 'Основные направления деятельности'}</h2>
                </div>
                <div className="services-grid">
                    {services.map((s, i) => (
                        <div key={i} className="service-card">
                            <div className="service-card-icon">
                                <ServiceIcon type={s.icon} />
                            </div>
                            <div className="service-card-body">
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectsSection({ language }) {
    const [ref, visible] = useScrollReveal();
    const projects = projectsData[language] || projectsData.ru;

    return (
        <section className="projects-section" ref={ref}>
            <div className="section-container">
                <div className={`section-header ${visible ? 'fade-up' : ''}`}>
                    <h2>{language === 'kk' ? 'Ақпараттық ресурстар' : 'Информационные ресурсы'}</h2>
                    <p>{language === 'kk' ? 'Азаматтар мен мемлекеттік органдарға арналған Институттың цифрлық платформалары' : 'Цифровые платформы Института для граждан и государственных органов'}</p>
                </div>
                <div className="resources-grid">
                    {projects.map((p, i) => (
                        <a
                            key={i}
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card"
                        >
                            <div className="resource-card-icon">
                                <ResourceIcon type={p.icon} />
                            </div>
                            <div className="resource-card-body">
                                <strong>{p.name}</strong>
                                <span>{p.desc}</span>
                            </div>
                            <span className="resource-card-arrow">→</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function NewsSection({ displayNews, t, language }) {
    const [ref, visible] = useScrollReveal();
    return (
        <section className="news-section" ref={ref}>
            <div className="section-container">
                <div className={`section-header news-header-row ${visible ? 'fade-up' : ''}`}>
                    <div>
                        <h2>{t('lastNews') || (language === 'kk' ? 'Соңғы жаңалықтар' : 'Последние новости')}</h2>
                    </div>
                    <Link to="/news" className="all-news-btn">{(t('allNews') || (language === 'kk' ? 'Барлық жаңалықтар' : 'Все новости'))} →</Link>
                </div>
                <div className="news-grid">
                    {displayNews.map((item, index) => (
                        <NewsCard key={index} item={item} delay={index * 100} language={language} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function NewsCard({ item, delay, language }) {
    const [ref, visible] = useScrollReveal();
    return (
        <Link
            ref={ref}
            to={`/news/${item.id}`}
            className={`news-card ${visible ? 'fade-up' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="news-image-wrapper">
                {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <div className="news-image-placeholder"><span>📰</span></div>
                }
                <div className="news-date-badge">{item.date}</div>
            </div>
            <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <span className="news-read-more">{language === 'kk' ? 'Толығырақ оқу →' : 'Читать далее →'}</span>
            </div>
        </Link>
    );
}

function MilestonesTableSection({ language }) {
    const [ref, visible] = useScrollReveal();
    const milestones = historyMilestonesData[language] || historyMilestonesData.ru;

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.05 });

        const rows = document.querySelectorAll('.milestones-table-row');
        rows.forEach((el) => observer.observe(el));

        return () => {
            rows.forEach((el) => observer.unobserve(el));
        };
    }, [language]);

    return (
        <section className="milestones-section" ref={ref}>
            <div className="section-container">
                <div className={`section-header ${visible ? 'fade-up' : ''}`}>
                    <h2>{language === 'kk' ? 'Дамудың негізгі кезеңдері' : 'Основные этапы развития'}</h2>
                    <p>{language === 'kk' ? 'Қазақстан Республикасының Заңнама және құқықтық ақпарат институты тарихындағы негізгі белестер' : 'Ключевые вехи в истории Института законодательства и правовой информации Республики Казахстан'}</p>
                </div>
                <div className="milestones-table-wrapper">
                    <div className="milestones-table">
                        <div className="milestones-table-header">
                            <div className="mt-col mt-col-num">№</div>
                            <div className="mt-col mt-col-year">{language === 'kk' ? 'Жыл' : 'Год'}</div>
                            <div className="mt-col mt-col-event">{language === 'kk' ? 'Оқиға' : 'Событие'}</div>
                        </div>
                        {milestones.map((m, i) => (
                            <div key={i} className="milestones-table-row">
                                <div className="mt-col mt-col-num">{i + 1}</div>
                                <div className="mt-col mt-col-year"><strong>{m.year}</strong></div>
                                <div className="mt-col mt-col-event">{m.event}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="milestones-cta">
                    <Link to="/HistoryLLII" className="btn-gov-link">
                        {language === 'kk' ? 'Институттың толық тарихы →' : 'Полная история института →'}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function ContactInfoSection({ language }) {
    return (
        <section className="contact-info-section">
            <div className="section-container">
                <div className="section-header">
                    <h2>{language === 'kk' ? 'Байланыс ақпараты' : 'Контактная информация'}</h2>
                </div>
                <div className="contact-info-grid">
                    <div className="contact-info-block">
                        <h3>{language === 'kk' ? 'Құқықтық ақпараттық қызмет' : 'Правовая информационная служба'}</h3>
                        <p>{language === 'kk' ? 'Азаматтарға тәулік бойы тегін заңгерлік кеңес беру' : 'Бесплатные юридические консультации для граждан — круглосуточно'}</p>
                        <ul className="contact-list">
                            <li><strong>{language === 'kk' ? 'Телефон' : 'Телефон'}:</strong> <a href="tel:+77172580058">+7 (7172) 58-00-58</a></li>
                            <li><strong>Telegram:</strong> <a href="https://t.me/119KenesBot" target="_blank" rel="noopener noreferrer">@119KenesBot</a></li>
                            <li><strong>E-mail:</strong> <a href="mailto:npa@zqai.kz">npa@zqai.kz</a></li>
                        </ul>
                    </div>
                    <div className="contact-info-block">
                        <h3>{language === 'kk' ? 'Ресми сілтемелер' : 'Официальные ссылки'}</h3>
                        <ul className="contact-list">
                            <li>
                                <a href="https://www.gov.kz/memleket/entities/adilet" target="_blank" rel="noopener noreferrer">
                                    {language === 'kk' ? 'ҚР Әділет министрлігі' : 'Министерство юстиции РК'} →
                                </a>
                            </li>
                            <li>
                                <a href="https://adilet.zan.kz" target="_blank" rel="noopener noreferrer">
                                    {language === 'kk' ? '«Әділет» ақпараттық-құқықтық жүйесі' : 'ИПС «Әділет»'} →
                                </a>
                            </li>
                            <li>
                                <a href="http://zan.gov.kz/" target="_blank" rel="noopener noreferrer">
                                    {language === 'kk' ? 'НҚА Эталондық банкі' : 'Эталонный банк НПА'} →
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
