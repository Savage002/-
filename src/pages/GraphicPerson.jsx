import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import './GraphicPerson.css';

function GraphicPerson() {
    const { language } = useLanguage();
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetch(`/api/reception?lang=${language}`)
            .then(res => res.json())
            .then(data => {
                if (cancelled) return;
                if (Array.isArray(data)) setScheduleData(data);
                setLoading(false);
            })
            .catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [language]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.05 });
        const cards = document.querySelectorAll('.gp-leader-card');
        cards.forEach((el) => observer.observe(el));
        return () => cards.forEach((el) => observer.unobserve(el));
    }, [scheduleData]);

    const title = language === 'kk' ? 'Институт басшылығы' : 'Руководство Института';
    const subtitle = language === 'kk'
        ? 'ҚР Әділет министрлігінің «ЗҚАИ» РМК басшылығы'
        : 'Руководство РГП «ИЗПИ» Министерства юстиции РК';

    const info = language === 'kk'
        ? [
            { icon: '📍', label: 'Мекенжай', value: 'Астана қ., Женис к., 15а' },
            { icon: '📞', label: 'Қабылдау телефоны', value: '+7 (7172) 26-61-22' },
            { icon: '✉️', label: 'Email', value: 'info@zqai.kz' },
        ]
        : [
            { icon: '📍', label: 'Адрес', value: 'г. Астана, ул. Женис, 15а' },
            { icon: '📞', label: 'Телефон приёмной', value: '+7 (7172) 26-61-22' },
            { icon: '✉️', label: 'Email', value: 'info@zqai.kz' },
        ];

    const sorted = [...scheduleData].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const director = sorted.find(item => /директор/i.test(item.role || '') && !/орынбасары|заместитель/i.test(item.role || '')) || sorted[0];
    const deputies = sorted.filter(item => item !== director);

    const renderCard = (item, key) => (
        <div key={key} className={`gp-leader-card${item === director ? ' gp-director-card' : ''}`}>
            <div className="gp-leader-avatar-wrap">
                <div className="gp-leader-avatar">
                    {item.image_url || item.photo_url ? (
                        <img src={item.image_url || item.photo_url} alt={item.name} className="gp-leader-avatar-img" />
                    ) : (
                        <span className="gp-leader-avatar-placeholder">👤</span>
                    )}
                </div>
            </div>
            <div className="gp-leader-info">
                <h3 className="gp-leader-name">{item.name || '—'}</h3>
                <span className="gp-leader-role">{item.role || '—'}</span>
            </div>
        </div>
    );

    return (
        <div className="graphic-page">
            <div className="graphic-hero">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <div className="graphic-container">
                <div className="graphic-info-grid">
                    {info.map((item, i) => (
                        <div key={i} className="graphic-info-card">
                            <span className="graphic-info-icon">{item.icon}</span>
                            <div>
                                <p className="graphic-info-label">{item.label}</p>
                                <p className="graphic-info-value">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="graphic-loading">⏳</div>
                ) : scheduleData.length === 0 ? (
                    <p className="graphic-empty">—</p>
                ) : (
                    <div className="gp-hierarchy">
                        {director && (
                            <div className="gp-director-row">
                                {renderCard(director, 'director')}
                            </div>
                        )}
                        {deputies.length > 0 && (
                            <div className="gp-cards-grid">
                                {deputies.map((item, index) => renderCard(item, index))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GraphicPerson;
