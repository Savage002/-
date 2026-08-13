import { useLanguage } from '../context/useLanguage';
import Icon from '../components/Icon/Icon';
import './Editions.css';

const publicationsData = {
    ru: [
        {
            icon: "newspaper",
            color: "#3a6ea8",
            title: "Журнал «Вестник ИЗПИ РК»",
            type: "Периодическое издание",
            desc: "Научно-правовое издание, публикующее статьи по актуальным вопросам законодательства, правовой теории и практики. Выходит ежеквартально. Включен в Перечень изданий, рекомендуемых для публикации результатов научной деятельности по юридическим наукам (список 2).",
            link: "https://vestnik.zqai.kz/index.php/vestnik/index",
            linkLabel: "Перейти на сайт журнала ↗"
        },
        {
            icon: "bookOpen",
            color: "#1a7a4a",
            title: "Сборники научных трудов",
            type: "Научное издание",
            desc: "Материалы конференций и результаты фундаментальных правовых исследований, проводимых сотрудниками Института."
        },
        {
            icon: "graduation",
            color: "#c06a1e",
            title: "Методические пособия",
            type: "Учебно-методическое издание",
            desc: "«Методика проведения научной лингвистической экспертизы», «Методика анализа нормативных правовых актов» и другие пособия."
        },
        {
            icon: "document",
            color: "#1a8a8a",
            title: "Информационные бюллетени",
            type: "Информационное издание",
            desc: "Регулярные анонсы изменений в законодательстве Республики Казахстан, правовые комментарии и новости правотворчества."
        }
    ],
    kk: [
        {
            icon: "newspaper",
            color: "#3a6ea8",
            title: "«ҚР ЗҚАИ Жаршысы» журналы",
            type: "Мерзімді басылым",
            desc: "Заңнама, құқықтық теория мен тәжірибенің өзекті мәселелері бойынша мақалалар жариялайтын ғылыми-құқықтық басылым. Тоқсан сайын шығады. Заңтану ғылымдары бойынша ғылыми қызмет нәтижелерін жариялауға ұсынылатын басылымдар тізіміне енгізілген (2-тізім).",
            link: "https://vestnik.zqai.kz/index.php/vestnik/index",
            linkLabel: "Журнал сайтына өту ↗"
        },
        {
            icon: "bookOpen",
            color: "#1a7a4a",
            title: "Ғылыми еңбектер жинақтары",
            type: "Ғылыми басылым",
            desc: "Институт қызметкерлері жүргізетін іргелі құқықтық зерттеулердің нәтижелері мен конференция материалдары."
        },
        {
            icon: "graduation",
            color: "#c06a1e",
            title: "Әдістемелік құралдар",
            type: "Оқу-әдістемелік басылым",
            desc: "«Ғылыми лингвистикалық сараптама жүргізу әдістемесі», «Нормативтік құқықтық актілерді талдау әдістемесі» және басқа да құралдар."
        },
        {
            icon: "document",
            color: "#1a8a8a",
            title: "Ақпараттық бюллетеньдер",
            type: "Ақпараттық басылым",
            desc: "Қазақстан Республикасының заңнамасындағы өзгерістердің тұрақты анонстары, құқықтық түсініктемелер және құқық шығармашылық жаңалықтары."
        }
    ]
};

function Editions() {
    const { language } = useLanguage();
    const publications = publicationsData[language] || publicationsData.ru;

    return (
        <div className="page-content editions-page">
            <h1>{language === 'kk' ? 'Басылымдар' : 'Издания'}</h1>
            <p className="editions-intro">
                {language === 'kk'
                    ? 'ҚР Заңнама және құқықтық ақпарат институты құқықтық білімді таратуға және ғылыми қауымдастықты қолдауға бағытталған әртүрлі мерзімді және ғылыми басылымдар шығарады.'
                    : 'Институт законодательства и правовой информации РК выпускает разнообразные периодические и научные издания, направленные на распространение правовых знаний и поддержку научного сообщества.'}
            </p>
            <div className="editions-grid">
                {publications.map((pub, i) => (
                    <div key={i} className="edition-card" style={{ '--acc': pub.color, borderTopColor: pub.color }}>
                        <Icon name={pub.icon} className="edition-icon" />
                        <div className="edition-type" style={{ color: pub.color }}>{pub.type}</div>
                        <h3 className="edition-title">{pub.title}</h3>
                        <p className="edition-desc">{pub.desc}</p>
                        {pub.link && (
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="edition-link" style={{ color: pub.color }}>
                                {pub.linkLabel}
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Editions;
