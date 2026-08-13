import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './LegalSupport.css';

const servicesData = {
    ru: [
        { icon: "search", title: "Правовая экспертиза НПА", color: "#d4a843", desc: "Проведение правовой экспертизы нормативных правовых актов на соответствие Конституции и законодательству Республики Казахстан." },
        { icon: "edit", title: "Нормотворческая деятельность", color: "#4a709c", desc: "Участие в разработке проектов законов, постановлений Правительства и иных нормативных правовых актов." },
        { icon: "chat", title: "Правовые консультации", color: "#1a7a4a", desc: "Предоставление правовых консультаций государственным органам и гражданам по вопросам применения законодательства РК." },
        { icon: "database", title: "Правовые базы данных", color: "#7a4a1a", desc: "Формирование и ведение баз данных НПА Казахстана: Эталонный контрольный банк, «Әділет», «ZAN» и государственный реестр." },
        { icon: "megaphone", title: "Лингвистическая экспертиза", color: "#4a1a7a", desc: "Экспертиза проектов НПА на соответствие нормам государственного языка, юридической терминологии и правилам законодательной техники." },
        { icon: "chart", title: "Мониторинг законодательства", color: "#1a5a6a", desc: "Анализ изменений в законодательстве, подготовка аналитических материалов и мониторинг правоприменительной практики." },
    ],
    kk: [
        { icon: "search", title: "НҚА құқықтық сараптамасы", color: "#d4a843", desc: "Нормативтік құқықтық актілердің Қазақстан Республикасының Конституциясына және заңнамасына сәйкестігіне құқықтық сараптама жүргізу." },
        { icon: "edit", title: "Норма шығармашылық қызмет", color: "#4a709c", desc: "Заңдар, Үкімет қаулылары және өзге де нормативтік құқықтық актілердің жобаларын әзірлеуге қатысу." },
        { icon: "chat", title: "Құқықтық консультациялар", color: "#1a7a4a", desc: "Мемлекеттік органдарға және азаматтарға ҚР заңнамасын қолдану мәселелері бойынша құқықтық консультациялар беру." },
        { icon: "database", title: "Құқықтық деректер базасы", color: "#7a4a1a", desc: "Қазақстан НҚА деректер базасын қалыптастыру және жүргізу: Эталондық бақылау банкі, «Әділет», «ZAN» және мемлекеттік тізілім." },
        { icon: "megaphone", title: "Лингвистикалық сараптама", color: "#4a1a7a", desc: "НҚА жобаларының мемлекеттік тіл нормаларына, заң терминологиясына және заң шығару техникасы қағидаларына сәйкестігін сараптау." },
        { icon: "chart", title: "Заңнама мониторингі", color: "#1a5a6a", desc: "Заңнамадағы өзгерістерді талдау, аналитикалық материалдар дайындау және құқық қолдану практикасына мониторинг жүргізу." },
    ]
};

const databasesData = {
    ru: [
        { name: "Информационно-правовая система «Әділет»", href: "https://adilet.zan.kz/kaz/", icon: "scale", desc: "Крупнейшая правовая база данных, свыше 200 000 документов" },
        { name: "Эталонный контрольный банк НПА РК", href: "http://zan.gov.kz/", icon: "landmark", desc: "Официальная база нормативных правовых актов Казахстана" },
        { name: "База данных «ZAN»", href: "https://zan.kz/ru", icon: "bookOpen", desc: "Первая база НПА на государственном языке (с 1999 года)" },
        { name: "Государственный реестр НПА РК", href: "https://zanorda.kz/", icon: "clipboard", desc: "Официальный государственный реестр нормативных актов" },
    ],
    kk: [
        { name: "«Әділет» ақпараттық-құқықтық жүйесі", href: "https://adilet.zan.kz/kaz/", icon: "scale", desc: "Ең ірі құқықтық деректер базасы, 200 000-нан астам құжат" },
        { name: "ҚР НҚА Эталондық бақылау банкі", href: "http://zan.gov.kz/", icon: "landmark", desc: "Қазақстанның нормативтік құқықтық актілерінің ресми базасы" },
        { name: "«ZAN» деректер базасы", href: "https://zan.kz/ru", icon: "bookOpen", desc: "Мемлекеттік тілдегі алғашқы НҚА базасы (1999 жылдан бастап)" },
        { name: "ҚР НҚА Мемлекеттік тізілімі", href: "https://zanorda.kz/", icon: "clipboard", desc: "Нормативтік актілердің ресми мемлекеттік тізілімі" },
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

function LegalSupport() {
    const { language } = useLanguage();
    const [heroRef, heroVis] = useReveal();

    const services = servicesData[language] || servicesData.ru;
    const databases = databasesData[language] || databasesData.ru;

    return (
        <div className="ls-page-new">
            <section className="ls-hero">
                <div className="ls-hero-bg" />
                <div ref={heroRef} className={`ls-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">{language === 'kk' ? 'Мемлекетті құқықтық қолдау' : 'Правовая поддержка государства'}</span>
                    <h1>{language === 'kk' ? 'Құқықтық қамтамасыз ету' : 'Правовое обеспечение'}</h1>
                    <p>{language === 'kk' ? 'Заңнама және құқықтық ақпарат институты мемлекеттік органдардың норма шығармашылық қызметін құқықтық сүйемелдеуді, құқықтық деректер базасын қалыптастыруды және заңнама деңгейінде сараптамалық-талдамалық қолдауды қамтамасыз етеді' : 'Институт законодательства и правовой информации обеспечивает правовое сопровождение нормотворческой деятельности государственных органов, формирование правовых баз данных и экспертно-аналитическую поддержку на уровне законодательства'}</p>
                </div>
            </section>

            <section className="ls-services-section">
                <div className="ls-container">
                    <SectionHeader 
                        eyebrow={language === 'kk' ? 'Қызметтер' : 'Услуги'} 
                        title={language === 'kk' ? 'Құқықтық қамтамасыз ету түрлері' : 'Виды правового обеспечения'} 
                    />
                    <div className="ls-services-grid">
                        {services.map((s, i) => <ServiceCard key={i} s={s} delay={i * 80} />)}
                    </div>
                </div>
            </section>

            <section className="ls-db-section">
                <div className="ls-container">
                    <SectionHeader 
                        eyebrow={language === 'kk' ? 'Құқықтық ресурстар' : 'Правовые ресурсы'} 
                        title={language === 'kk' ? 'Ақпараттық деректер базасы' : 'Информационные базы данных'} 
                    />
                    <div className="ls-db-list">
                        {databases.map((d, i) => <DbCard key={i} d={d} delay={i * 90} />)}
                    </div>
                </div>
            </section>
        </div>
    );
}

function SectionHeader({ eyebrow, title }) {
    const [ref, vis] = useReveal();
    return <div ref={ref} className={`ls-sec-header ${vis ? 'is-visible' : ''}`}>
        <span className="page-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
    </div>;
}

function ServiceCard({ s, delay }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`ls-service-card ${vis ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${delay}ms`, '--acc': s.color }}>
            <Icon name={s.icon} className="ls-svc-icon" />
            <h3 style={{ color: s.color }}>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="ls-svc-bar" style={{ background: s.color }} />
        </div>
    );
}

function DbCard({ d, delay }) {
    const [ref, vis] = useReveal();
    return (
        <a ref={ref} href={d.href} target="_blank" rel="noopener noreferrer"
            className={`ls-db-card ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <Icon name={d.icon} className="ls-db-icon" />
            <div className="ls-db-text">
                <strong>{d.name}</strong>
                <span>{d.desc}</span>
            </div>
            <span className="ls-db-arrow">↗</span>
        </a>
    );
}

export default LegalSupport;
