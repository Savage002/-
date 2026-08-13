import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';
import './Contacts.css';

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

function ContactCard({ icon, title, children, delay }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} className={`contact-card ${vis ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
            <div className="contact-card-icon">{icon}</div>
            <div className="contact-card-body">
                <h3>{title}</h3>
                {children}
            </div>
        </div>
    );
}

function Contacts() {
    const { language } = useLanguage();
    const [heroRef, heroVis] = useReveal();

    const isKk = language === 'kk';

    return (
        <div className="contacts-page">
            <section className="contacts-hero">
                <div className="contacts-hero-overlay" />
                <div ref={heroRef} className={`contacts-hero-content ${heroVis ? 'is-visible' : ''}`}>
                    <span className="page-eyebrow">{isKk ? 'Байланыс' : 'Связь с нами'}</span>
                    <h1>{isKk ? 'Байланыс ақпараты' : 'Контактная информация'}</h1>
                    <p>{isKk ? 'Бізге хабарласыңыз — біз сізге көмектесуге дайынбыз' : 'Свяжитесь с нами — мы готовы помочь'}</p>
                </div>
            </section>

            <section className="contacts-section">
                <div className="contacts-container">

                    <ContactCard icon="📍" title={isKk ? 'Мекенжай' : 'Адрес'} delay={0}>
                        <p>{isKk ? 'Астана қ., Женіс даңғылы 15 «А»' : 'г. Астана, проспект Женис 15 «А»'}</p>
                    </ContactCard>

                    <ContactCard icon="📞" title={isKk ? 'Канцелярия' : 'Канцелярия'} delay={80}>
                        <p>57-65-08; 57-25-10</p>
                        <p>
                            <a href="mailto:antikorexpertise@zqai.kz">antikorexpertise@zqai.kz</a>
                            {' '}{isKk ? 'және' : 'и'}{' '}
                            <a href="mailto:npa@zqai.kz">npa@zqai.kz</a>
                        </p>
                    </ContactCard>

                    <ContactCard icon="📋" title={isKk ? 'Ресми жариялау мәселелері бойынша' : 'По вопросам официального опубликования'} delay={160}>
                        <p>57-48-66; 57-51-63; 57-81-65; 57-25-04</p>
                    </ContactCard>

                    <ContactCard icon="⚖️" title={isKk ? 'Құқықтық кеңес' : 'Правовая консультация'} delay={240}>
                        <p>8(7172) 58-00-58</p>
                        <div className="legal-links">
                            <a href="https://adilet.zan.kz/rus" target="_blank" rel="noreferrer" className="legal-link">
                                <span className="legal-link-icon">🔗</span>
                                adilet.zan.kz
                            </a>
                            <a href="https://advices.adilet.zan.kz/add.html" target="_blank" rel="noreferrer" className="legal-link">
                                <span className="legal-link-icon">📝</span>
                                {isKk ? 'Өтінім беру' : 'Подать обращение'} — advices.adilet.zan.kz
                            </a>
                            <a href="https://t.me/119KenesBot" target="_blank" rel="noreferrer" className="legal-link legal-link-tg">
                                <span className="legal-link-icon">✈️</span>
                                Telegram: @119KenesBot
                            </a>
                            <a href="https://www.e-otiniş.kz" target="_blank" rel="noreferrer" className="legal-link legal-link-eotinis">
                                <span className="legal-link-icon">🌐</span>
                                {isKk ? 'Е-өтініш арқылы өтінім беру' : 'Подать обращение через Е-отіниш'}
                            </a>
                        </div>
                    </ContactCard>

                </div>
            </section>

            <section className="contacts-map-section">
                <div className="contacts-container">
                    <div className="contacts-map-wrap">
                        <iframe
                            title="map"
                            src="https://www.google.com/maps?q=Астана,+проспект+Женис+15+А&output=embed"
                            width="100%"
                            height="400"
                            style={{ border: 0, borderRadius: '16px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contacts;
