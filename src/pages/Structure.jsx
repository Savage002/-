import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import './Structure.css';


const PRIORITY_KEYWORDS = ['науч', 'формирования', 'дит', 'цифровых', 'информационных технологий'];

function sortDepts(deps) {
    return [...deps].sort((a, b) => {
        const aName = (a.name_ru || '').toLowerCase();
        const bName = (b.name_ru || '').toLowerCase();
        const aIsDept = aName.startsWith('департамент');
        const bIsDept = bName.startsWith('департамент');

        if (aIsDept && !bIsDept) return -1;
        if (!aIsDept && bIsDept) return 1;

        if (aIsDept && bIsDept) {
            const aRank = PRIORITY_KEYWORDS.findIndex(kw => aName.includes(kw));
            const bRank = PRIORITY_KEYWORDS.findIndex(kw => bName.includes(kw));
            return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank);
        }

        return 0;
    });
}

export default function Structure() {
    const { language } = useLanguage();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDepartments(data);
                setLoading(false);
            })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    const n = (item, field) => item[`${field}_${language}`] || item[`${field}_ru`] || '';

    const title    = language === 'kk' ? 'Құрылымдық бөлімшелер' : 'Структурные подразделения';
    const intro    = language === 'kk'
        ? 'Қазақстан Республикасының Заңнама және құқықтық ақпарат институты бірнеше құрылымдық бөлімшелерден тұрады.'
        : 'Институт законодательства и правовой информации Республики Казахстан состоит из структурных подразделений.';
    const detLbl   = language === 'kk' ? 'Толығырақ →' : 'Подробнее →';

    const sorted = sortDepts(departments);

    return (
        <div className="page-content structure-page">
            <h1>{title}</h1>
            <p className="structure-intro">{intro}</p>

            {loading && <div className="structure-loading">⏳</div>}
            {error   && <p className="structure-error">Не удалось загрузить данные с сервера.</p>}

            {!loading && !error && (
                <div className="structure-cards">
                    {sorted.map((dept) => {
                        const isDept = (dept.name_ru || '').toLowerCase().startsWith('департамент');

                        return (
                            <div key={dept.id} className={`dept-card ${isDept ? 'dept-card--main' : ''}`}>
                                <h2 className="dept-card-title">{n(dept, 'name')}</h2>

                                <Link to={`/department/${dept.id}`} className="dept-detail-link">
                                    {detLbl}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
