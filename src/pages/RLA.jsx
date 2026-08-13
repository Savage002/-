import React, { useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './RLA.css';

const documentsData = {
    ru: [
        {
            category: "Закон",
            title: "Об органах юстиции",
            desc: "Определяет правовое положение, задачи и полномочия органов юстиции Республики Казахстан.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_organah_yusticii.pdf"
        },
        {
            category: "Постановление Правительства",
            title: "О некоторых вопросах нормотворческой деятельности в Республике Казахстан",
            desc: "Регламентирует порядок разработки, согласования, экспертизы и принятия нормативных правовых актов.",
            url: "https://zqai.kz/sites/default/files/2025-08/o_nekotoryh_voprosah_normotvorcheskoy_deyatelnosti_v_respublike_kazahstan.pdf"
        },
        {
            category: "Постановление Правительства",
            title: "Об утверждении Правил ведения Государственного реестра нормативных правовых актов РК и Эталонного контрольного банка НПА РК",
            desc: "Устанавливает порядок формирования, ведения и актуализации государственного реестра НПА Республики Казахстан.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_utverzhdenii_pravil_vedeniya_gosudarstvennogo_reestra_normativnyh_pravovyh_aktov_respubliki_kazahstan_etalonnogo_kontrolnogo_banka_normativnyh_pravovyh_aktov_respubliki_kazahstan.pdf"
        },
        {
            category: "Постановление Правительства",
            title: "Некоторые вопросы организации и проведения научной экспертизы",
            desc: "Определяет порядок проведения научной правовой и лингвистической экспертизы проектов законодательных актов.",
            url: "https://zqai.kz/sites/default/files/2025-08/nekotorye_voprosy_organizacii_i_provedeniya_nauchnoy_ekspertizy.pdf"
        },
        {
            category: "Постановление Правительства",
            title: "О внесении изменений в постановление Правительства РК от 8 февраля 2011 года № 94 «О Стратегическом плане Министерства финансов РК на 2011–2015 годы»",
            desc: "Вносит корректировки в стратегический план развития в части правового обеспечения финансовой деятельности.",
            url: "https://zqai.kz/sites/default/files/2025-08/p1300000439.30042013.document.pdf"
        },
        {
            category: "Приказ",
            title: "Об утверждении Инструкции по формированию Эталонного контрольного банка НПА РК, а также внесению в него сведений",
            desc: "Устанавливает технические и методологические требования к формированию и ведению эталонного банка нормативных правовых актов.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_utverzhdenii_instrukcii_po_formirovaniyu_etalonnogo_kontrolnogo_banka_normativnyh_pravovyh_aktov_respubliki_kazahstan_a_takzhe_vneseniyu_v_nego_svedeniy.pdf"
        }
    ],
    kk: [
        {
            category: "Заң",
            title: "Әділет органдары туралы",
            desc: "Қазақстан Республикасы әділет органдарының құқықтық жағдайын, міндеттері мен өкілеттіктерін айқындайды.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_organah_yusticii.pdf"
        },
        {
            category: "Үкімет Қаулысы",
            title: "Қазақстан Республикасындағы норма шығармашылық қызметтің кейбір мәселелері туралы",
            desc: "Нормативтік құқықтық актілерді әзірлеу, келісу, сараптау және қабылдау тәртібін реттейді.",
            url: "https://zqai.kz/sites/default/files/2025-08/o_nekotoryh_voprosah_normotvorcheskoy_deyatelnosti_v_respublike_kazahstan.pdf"
        },
        {
            category: "Үкімет Қаулысы",
            title: "ҚР нормативтік құқықтық актілерінің Мемлекеттік тізілімін және ҚР НҚА Эталондық бақылау банкін жүргізу қағидаларын бекіту туралы",
            desc: "Қазақстан Республикасы НҚА мемлекеттік тізілімін қалыптастыру, жүргізу және өзектендіру тәртібін белгілейді.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_utverzhdenii_pravil_vedeniya_gosudarstvennogo_reestra_normativnyh_pravovyh_aktov_respubliki_kazahstan_etalonnogo_kontrolnogo_banka_normativnyh_pravovyh_aktov_respubliki_kazahstan.pdf"
        },
        {
            category: "Үкімет Қаулысы",
            title: "Ғылыми сараптаманы ұйымдастыру мен жүргізудің кейбір мәселелері",
            desc: "Заңнамалық актілердің жобаларына ғылыми құқықтық және лингвистикалық сараптама жүргізу тәртібін айқындайды.",
            url: "https://zqai.kz/sites/default/files/2025-08/nekotorye_voprosy_organizacii_i_provedeniya_nauchnoy_ekspertizy.pdf"
        },
        {
            category: "Үкімет Қаулысы",
            title: "«ҚР Қаржы министрлігінің 2011-2015 жылдарға арналған Стратегиялық жоспары туралы» ҚР Үкіметінің 2011 жылғы 8 ақпандағы № 94 қаулысына өзгерістер енгізу туралы",
            desc: "Қаржы қызметін құқықтық қамтамасыз ету бөлігінде дамудың стратегиялық жоспарына түзетулер енгізеді.",
            url: "https://zqai.kz/sites/default/files/2025-08/p1300000439.30042013.document.pdf"
        },
        {
            category: "Бұйрық",
            title: "ҚР НҚА Эталондық бақылау банкін қалыптастыру, сондай-ақ оған мәліметтер енгізу жөніндегі нұсқаулықты бекіту туралы",
            desc: "Нормативтік құқықтық актілердің эталондық банкін қалыптастыруға және жүргізуге қойылатын техникалық және әдіснамалық талаптарды белгілейді.",
            url: "https://zqai.kz/sites/default/files/2025-08/ob_utverzhdenii_instrukcii_po_formirovaniyu_etalonnogo_kontrolnogo_banka_normativnyh_pravovyh_aktov_respubliki_kazahstan_a_takzhe_vneseniyu_v_nego_svedeniy.pdf"
        }
    ]
};

const categoryColors = {
    "Закон": { bg: "#e8f5e9", color: "#2e7d32" },
    "Постановление Правительства": { bg: "#e3f2fd", color: "#1565c0" },
    "Приказ": { bg: "#fff3e0", color: "#e65100" },
    "Заң": { bg: "#e8f5e9", color: "#2e7d32" },
    "Үкімет Қаулысы": { bg: "#e3f2fd", color: "#1565c0" },
    "Бұйрық": { bg: "#fff3e0", color: "#e65100" }
};

function RLA() {
    const { language } = useLanguage();
    const documents = documentsData[language] || documentsData.ru;

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.rla-card');
        hiddenElements.forEach((el) => observer.observe(el));

        return () => {
            hiddenElements.forEach((el) => observer.unobserve(el));
        };
    }, [language]);

    return (
        <div className="rla-page">
            <div className="rla-hero">
                <h1>{language === 'kk' ? 'Институт қызметін реттейтін НҚА' : 'НПА, регламентирующие деятельность института'}</h1>
                <p>{language === 'kk' ? 'Қазақстан Республикасының Заңнама және құқықтық ақпарат институтының құқықтық жағдайын, міндеттерін, функциялары мен өкілеттіктерін айқындайтын нормативтік құқықтық актілер' : 'Нормативные правовые акты, определяющие правовое положение, задачи, функции и полномочия Института законодательства и правовой информации Республики Казахстан'}</p>
            </div>

            <div className="rla-container">
                <div className="rla-summary">
                    <div className="rla-summary-item">
                        <span className="rla-summary-num">6</span>
                        <span className="rla-summary-label">{language === 'kk' ? 'Нормативтік актілер' : 'Нормативных актов'}</span>
                    </div>
                    <div className="rla-summary-item">
                        <span className="rla-summary-num">3</span>
                        <span className="rla-summary-label">{language === 'kk' ? 'Құжаттар санаты' : 'Категории документов'}</span>
                    </div>
                    <div className="rla-summary-item">
                        <span className="rla-summary-num">PDF</span>
                        <span className="rla-summary-label">{language === 'kk' ? 'Жүктеу форматы' : 'Формат для скачивания'}</span>
                    </div>
                </div>

                <div className="rla-list">
                    {documents.map((doc, index) => {
                        const cat = categoryColors[doc.category] || { bg: "#f0f0f0", color: "#555" };
                        return (
                            <div key={index} className="rla-card">
                                <div className="rla-card-top">
                                    <span
                                        className="rla-category"
                                        style={{ backgroundColor: cat.bg, color: cat.color }}
                                    >
                                        {doc.category}
                                    </span>
                                    <span className="rla-num">#{index + 1}</span>
                                </div>
                                <h3 className="rla-doc-title">{doc.title}</h3>
                                <p className="rla-doc-desc">{doc.desc}</p>
                                <div className="rla-action">
                                    <button
                                        className="download-btn"
                                        onClick={() => window.open(doc.url, '_blank')}
                                    >
                                        <Icon name="download" variant="bare" size={16} /> {language === 'kk' ? 'PDF жүктеу' : 'Скачать PDF'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RLA;
