import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './CallCenter.css';

const channelsData = {
    ru: [
        { icon: "mail", label: "Email", value: "npa@zqai.kz", href: "mailto:npa@zqai.kz", color: "#f59e0b" },
    ],
    kk: [
        { icon: "mail", label: "Email", value: "npa@zqai.kz", href: "mailto:npa@zqai.kz", color: "#f59e0b" },
    ]
};

const faqData = {
    ru: [
        { q: "Кто может обратиться в правовую службу?", a: "Любой гражданин Республики Казахстан, а также иностранные граждане и лица без гражданства, находящиеся на территории РК." },
        { q: "Платная ли услуга?", a: "Нет. Правовая информационная служба предоставляет бесплатную квалифицированную юридическую помощь населению." },
        { q: "В какое время работает служба?", a: "По телефону — круглосуточно, в том числе в выходные и праздничные дни. По email и мессенджерам — ответ в течение 1 рабочего дня." },
        { q: "Какие вопросы можно задать?", a: "Трудовые споры, семейное право, жилищные вопросы, административные процедуры, обращения в госорганы — любые правовые вопросы." },
        { q: "Гарантируется ли конфиденциальность?", a: "Да. Все обращения обрабатываются конфиденциально. При желании вы можете задать вопрос анонимно через Telegram-бота." },
    ],
    kk: [
        { q: "Құқықтық қызметке кім жүгіне алады?", a: "Кез келген Қазақстан Республикасының азаматы, сондай-ақ ҚР аумағында жүрген шетел азаматтары мен азаматтығы жоқ адамдар." },
        { q: "Қызмет ақылы ма?", a: "Жоқ. Құқықтық ақпараттық қызмет халыққа тегін білікті заң көмегін көрсетеді." },
        { q: "Қызмет қай уақытта жұмыс істейді?", a: "Телефон арқылы — тәулік бойы, соның ішінде демалыс және мереке күндері. Email және мессенджерлер бойынша — 1 жұмыс күні ішінде жауап беріледі." },
        { q: "Қандай сұрақтар қоюға болады?", a: "Еңбек даулары, отбасылық құқық, тұрғын үй мәселелері, әкімшілік рәсімдер, мемлекеттік органдарға өтініштер — кез келген құқықтық мәселелер." },
        { q: "Құпиялыққа кепілдік беріле ме?", a: "Иә. Барлық өтініштер құпия түрде өңделеді. Қаласаңыз, Telegram-бот арқылы сұрақты анонимді түрде қоя аласыз." },
    ]
};

// Strips CR/LF so a crafted email value can't inject extra mailto: headers (e.g. bcc=).
const sanitizeMailto = (value) => String(value).replace(/[\r\n]/g, '');

function useReveal() {
    const ref = useRef(null); const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

function CallCenter() {
    const { language } = useLanguage();
    const [openFaq, setOpenFaq] = useState(null);
    const [officer, setOfficer] = useState(null);

    const channels = channelsData[language] || channelsData.ru;
    const faq = faqData[language] || faqData.ru;

    useEffect(() => {
        fetch('/api/compliance-officer')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setOfficer(d); })
            .catch(() => { });
    }, []);

    return (
        <div className="cc-page-new">
            <section className="cc-channels-section">
                <div className="cc-container">
                    <ChannelHeader language={language} />
                    <div className="cc-channels-grid">
                        {channels.map((c, i) => <ChannelCard key={i} c={c} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            {officer && (
                <section className="cc-officer-section">
                    <div className="cc-container">
                        <ComplianceOfficerCard officer={officer} language={language} />
                    </div>
                </section>
            )}

            <section className="cc-hours-section">
                <div className="cc-container">
                    <HoursCard language={language} />
                </div>
            </section>

            <section className="cc-faq-section">
                <div className="cc-container">
                    <FaqHeader language={language} />
                    <div className="faq-list">
                        {faq.map((f, i) => (
                            <FaqItem key={i} f={f} i={i} delay={i * 70}
                                open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ChannelHeader({ language }) {
    const [ref, vis] = useReveal();
    return <div ref={ref} className={`cc-sec-header ${vis ? 'is-visible' : ''}`}>
        <span className="page-eyebrow">{language === 'kk' ? 'Бізбен қалай байланысуға болады' : 'Как с нами связаться'}</span>
        <h2>{language === 'kk' ? 'Байланыс арналары' : 'Каналы обращения'}</h2>
    </div>;
}

function ChannelCard({ c, delay }) {
    const [ref, vis] = useReveal();
    return (
        <a ref={ref} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
            className={`cc-channel-card ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms`, '--ch-color': c.color }}>
            <Icon name={c.icon} className="cc-ch-icon" style={{ borderColor: c.color }} />
            <div className="cc-ch-text">
                <span className="cc-ch-label">{c.label}</span>
                <strong className="cc-ch-value">{c.value}</strong>
            </div>
            <span className="cc-ch-arrow" style={{ color: c.color }}>→</span>
        </a>
    );
}

function HoursCard({ language }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`cc-hours-card ${vis ? 'is-visible' : ''}`}>
            <Icon name="clock" className="hours-icon" />
            <div>
                <h3>{language === 'kk' ? 'Жұмыс уақыты' : 'Время работы'}</h3>
                <div className="hours-grid">
                    <div className="hours-row">
                        <span>{language === 'kk' ? 'Email / жазбаша өтініштер' : 'Email / обращения письменно'}</span>
                        <strong>{language === 'kk' ? 'Дс–Жм: 09:00 – 18:00' : 'Пн–Пт: 09:00 – 18:00'}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqHeader({ language }) {
    const [ref, vis] = useReveal();
    return <div ref={ref} className={`cc-sec-header ${vis ? 'is-visible' : ''}`}>
        <span className="page-eyebrow">{language === 'kk' ? 'Жиі қойылатын сұрақтар' : 'Частые вопросы'}</span>
        <h2>{language === 'kk' ? 'Сұрақтар мен жауаптар' : 'Вопросы и ответы'}</h2>
    </div>;
}

function FaqItem({ f, delay, open, toggle }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`faq-item ${vis ? 'is-visible' : ''} ${open ? 'open' : ''}`}
            style={{ transitionDelay: `${delay}ms` }} onClick={toggle}>
            <div className="faq-question">
                <span>{f.q}</span>
                <span className="faq-chevron">{open ? '▲' : '▼'}</span>
            </div>
            {open && <div className="faq-answer">{f.a}</div>}
        </div>
    );
}

function ComplianceOfficerCard({ officer, language }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`cc-sec-header ${vis ? 'is-visible' : ''}`} style={{ marginBottom: '2rem' }}>
            <span className="page-eyebrow">{language === 'kk' ? 'Жауапты тұлға' : 'Ответственное лицо'}</span>
            <h2>{language === 'kk' ? 'Комплаенс офицер' : 'Комплаенс офицер'}</h2>

            <div className={`cc-officer-card ${vis ? 'is-visible' : ''}`}>
                <div className="cc-officer-photo-wrap">
                    {officer.photo_url
                        ? <img src={officer.photo_url} alt={officer.full_name} className="cc-officer-photo" />
                        : <div className="cc-officer-photo-placeholder"><Icon name="user" variant="bare" size={64} /></div>
                    }
                </div>
                <div className="cc-officer-info">
                    <h3 className="cc-officer-name">{officer.full_name}</h3>
                    <p className="cc-officer-position">{language === 'kk' && officer.position_kk ? officer.position_kk : officer.position}</p>
                    {officer.description && (
                        <p className="cc-officer-desc">{language === 'kk' && officer.description_kk ? officer.description_kk : officer.description}</p>
                    )}
                    <div className="cc-officer-contacts">

                        {officer.email && (
                            <a href={`mailto:${sanitizeMailto(officer.email)}`} className="cc-officer-contact">
                                <Icon name="mail" variant="bare" size={20} className="cc-officer-contact-icon" style={{ color: '#b45309' }} />
                                <span>{officer.email}</span>
                            </a>
                        )}
                        {officer.reception_schedule && (
                            <div className="cc-officer-contact">
                                <Icon name="clock" variant="bare" size={20} className="cc-officer-contact-icon" style={{ color: '#1a4a8a' }} />
                                <span>{officer.reception_schedule}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CallCenter;

