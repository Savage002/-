--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4 (Postgres.app)
-- Dumped by pg_dump version 18.4 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: compliance_officer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compliance_officer (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    "position" character varying(255),
    phone character varying(100),
    email character varying(255),
    reception_schedule text,
    photo_url text,
    description text,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: compliance_officer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compliance_officer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compliance_officer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compliance_officer_id_seq OWNED BY public.compliance_officer.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name_ru character varying(255) NOT NULL,
    name_kk character varying(255) NOT NULL,
    director_full_name character varying(255),
    director_title_ru character varying(255) DEFAULT 'Директор департамента'::character varying,
    director_title_kk character varying(255) DEFAULT 'Департамент директоры'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: divisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions (
    id integer NOT NULL,
    department_id integer,
    name_ru character varying(255) NOT NULL,
    name_kk character varying(255) NOT NULL,
    head_full_name character varying(255),
    head_title_ru character varying(255) DEFAULT 'Начальник отдела'::character varying,
    head_title_kk character varying(255) DEFAULT 'Бөлім басшысы'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: divisions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.divisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: divisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.divisions_id_seq OWNED BY public.divisions.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    event_date date NOT NULL,
    "time" character varying(50),
    location character varying(255),
    language character varying(10) DEFAULT 'ru'::character varying,
    news_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: managers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.managers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    image_url text,
    language character varying(5) DEFAULT 'ru'::character varying,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reception_day character varying(255),
    reception_time character varying(50),
    photo_url text
);


--
-- Name: managers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.managers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: managers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.managers_id_seq OWNED BY public.managers.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    language character varying(10) DEFAULT 'ru'::character varying
);


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: news_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_images (
    id integer NOT NULL,
    news_id integer,
    image_url text NOT NULL,
    display_order integer DEFAULT 0
);


--
-- Name: news_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_images_id_seq OWNED BY public.news_images.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.positions (
    id integer NOT NULL,
    division_id integer,
    title_ru character varying(255) NOT NULL,
    title_kk character varying(255) NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: positions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.positions_id_seq OWNED BY public.positions.id;


--
-- Name: sector_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sector_positions (
    id integer NOT NULL,
    sector_id integer,
    title_ru character varying(255) NOT NULL,
    title_kk character varying(255) NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sector_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sector_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sector_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sector_positions_id_seq OWNED BY public.sector_positions.id;


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    division_id integer,
    name_ru character varying(255) NOT NULL,
    name_kk character varying(255) NOT NULL,
    head_full_name character varying(255),
    head_title_ru character varying(255) DEFAULT 'Руководитель сектора'::character varying,
    head_title_kk character varying(255) DEFAULT 'Сектор басшысы'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sectors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sectors_id_seq OWNED BY public.sectors.id;


--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_logs (
    id integer NOT NULL,
    event_type character varying(50) NOT NULL,
    user_id integer,
    details text,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: system_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_logs_id_seq OWNED BY public.system_logs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: compliance_officer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_officer ALTER COLUMN id SET DEFAULT nextval('public.compliance_officer_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: divisions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions ALTER COLUMN id SET DEFAULT nextval('public.divisions_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: managers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managers ALTER COLUMN id SET DEFAULT nextval('public.managers_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: news_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images ALTER COLUMN id SET DEFAULT nextval('public.news_images_id_seq'::regclass);


--
-- Name: positions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions ALTER COLUMN id SET DEFAULT nextval('public.positions_id_seq'::regclass);


--
-- Name: sector_positions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sector_positions ALTER COLUMN id SET DEFAULT nextval('public.sector_positions_id_seq'::regclass);


--
-- Name: sectors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors ALTER COLUMN id SET DEFAULT nextval('public.sectors_id_seq'::regclass);


--
-- Name: system_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs ALTER COLUMN id SET DEFAULT nextval('public.system_logs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: compliance_officer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compliance_officer (id, full_name, "position", phone, email, reception_schedule, photo_url, description, updated_at) FROM stdin;
1	Мырзагалиев Жанарбек Нуржангалиевич	Комплаенс офицер	+7 (7172) 58-00-58	compliance@zqai.kz	Понедельник – пятница: 09:00 – 18:00	/uploads/compliance_officer.jpg	Осуществляет контроль за соблюдением требований законодательства Республики Казахстан, внутренних политик и процедур организации. Принимает обращения о нарушениях, обеспечивает их конфиденциальное рассмотрение.	2026-02-23 15:38:28.915506
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (id, name_ru, name_kk, director_full_name, director_title_ru, director_title_kk, created_at) FROM stdin;
1	Департамент Информационных технологий	Ақпараттық технологиялар департаменті	Ауезханов Дархан Азаматович	Директор департамента	Департамент директоры	2026-02-25 10:31:43.077159
2	Департамент научной деятельности	Ғылыми қызмет департаменті	Авенов Тимур Кайратович	Директор департамента	Департамент директоры	2026-04-30 10:48:52.45862
3	Департамент формирования баз данных	Деректер базасын қалыптастыру департаменті	\N	Директор департамента	Департамент директоры	2026-04-30 11:19:22.139081
4	Отдел издательской и типографской деятельности	Баспа және типографиялық қызмет бөлімі	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
5	Управление экономики и финансов	Экономика және қаржы басқармасы	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
6	Отдел кадров	Кадрлар бөлімі	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
7	Отдел документационного обеспечения	Құжаттамалық қамтамасыз ету бөлімі	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
8	Отдел инфраструктурного обслуживания	Инфрақұрылымдық қызмет бөлімі	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
9	Отдел развития, контроля и внешних коммуникаций	Даму, бақылау және сыртқы коммуникациялар бөлімі	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
10	Управление методологии и обеспечения праворазъяснительной работы	Құқықтық түсіндіру жұмысын методологиялық қамтамасыз ету басқармасы	\N	Директор департамента	Департамент директоры	2026-06-18 15:39:37.959804
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions (id, department_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk, created_at) FROM stdin;
1	1	Отдел Разработки	Әзірлеу бөлімі	Асылбек Нуржан Нургалиулы	Начальник отдела	Бөлім басшысы	2026-02-25 10:31:43.07759
2	1	Отдел Сопровождения	Сүйемелдеу бөлімі	\N	Начальник отдела	Бөлім басшысы	2026-02-25 10:31:43.07759
3	2	Отдел конституционного законодательства и государственного управления	Конституциялық заңнама және мемлекеттік басқару бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 10:48:52.463
4	2	Отдел законодательства отраслей экономики и социальной сферы	Экономика және әлеуметтік сала салаларының заңнамасы бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 10:48:52.465373
5	2	Отдел международного права и сравнительного правоведения	Халықаралық құқық және салыстырмалы құқықтану бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 10:48:52.465889
6	2	Отдел координации научных экспертиз	Ғылыми сараптамаларды үйлестіру бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 10:48:52.46625
7	2	Центр лингвистики и правовой терминологии	Лингвистика және құқықтық терминология орталығы	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 10:48:52.466701
8	3	Управление формирования Эталонного контрольного банка нормативных правовых актов РК	ҚР нормативтік құқықтық актілердің Эталондық бақылау банкін қалыптастыру басқармасы	\N	Руководитель управления	Басқарма басшысы	2026-04-30 11:19:22.142484
9	5	Отдел бухгалтерского учета и отчетности	Бухгалтерлік есеп және есептілік бөлімі	\N	Начальник отдела	Бөлім басшысы	2026-06-18 15:39:37.959804
10	5	Отдел планирования и организации государственных закупок	Мемлекеттік сатып алуды жоспарлау және ұйымдастыру бөлімі	\N	Начальник отдела	Бөлім басшысы	2026-06-18 15:39:37.959804
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, title, event_date, "time", location, language, news_id, created_at) FROM stdin;
4	Конференция	2026-06-25	13:00	Женис 15а	ru	\N	2026-06-21 21:57:55.58325
\.


--
-- Data for Name: managers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.managers (id, name, role, image_url, language, display_order, created_at, reception_day, reception_time, photo_url) FROM stdin;
2	Ибышев Ержар Садуахасович	Заместитель директора по цифровизации	/uploads/Ibyshev.jpg	ru	2	2026-02-19 16:44:35.127764+05	\N	\N	\N
3	Блялов Бахытжан Ерикович	Заместитель директора по финансово-хозяйственной деятельности	/uploads/blalov.jpeg	ru	3	2026-02-19 16:44:35.127764+05	\N	\N	\N
5	Ибышев Ержар Садуахасович	Цифрландыру жөніндегі директордың орынбасары	/uploads/Ibyshev.jpg	kk	2	2026-02-19 16:44:35.128043+05	\N	\N	\N
6	Блялов Бахытжан Ерикович	Қаржы-экономикалық қызмет жөніндегі директордың орынбасары	/uploads/blalov.jpeg	kk	3	2026-02-19 16:44:35.128043+05	\N	\N	\N
7	 	Первый заместитель директора	\N	ru	4	2026-04-29 12:10:26.924981+05	\N	\N	\N
8	 	Директордың бірінші орынбасары	\N	kk	4	2026-04-29 12:10:26.924981+05	\N	\N	\N
1	Джигитекова Жанара Нуржановна	Директор	/uploads/director_dzhigitekova.jpg	ru	1	2026-02-19 16:44:35.127764+05	\N	\N	\N
4	Джигитекова Жанара Нуржановна	Директор	/uploads/director_dzhigitekova.jpg	kk	1	2026-02-19 16:44:35.128043+05	\N	\N	\N
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, content, created_by, created_at, language) FROM stdin;
5	В Астане состоялось экспертное обсуждение  проекта новой Конституции	г. Астана, 18 февраля 2026 г.\nСегодня в Институте законодательства и правовой информации состоялась экспертная встреча с депутатом Мажилиса Парламента Республики Казахстан, членом Комиссии по конституционной реформе, доктором юридических наук, профессором Маратом Башимовым.\nВ центре внимания экспертного диалога оказалась тема: «Конституционные новеллы в сфере защиты прав человека: новые механизмы и гарантии». В обсуждении приняли участие руководство Института, ведущие научные сотрудники, а также авторитетные правоведы и специалисты в области конституционного права.\nВстреча прошла в формате открытой дискуссии, посвященной анализу проекта новой Конституции. Участники детально рассмотрели трансформацию политико-правовых институтов и усиление роли правозащитных механизмов в Основном законе страны.\nВыступая перед экспертным сообществом, Марат Башимов акцентировал внимание на гуманизации правовой системы:\n«Проект новой Конституции – это, прежде всего, документ прямого действия, ориентированный на защиту интересов гражданина. Мы видим качественную эволюцию конституционных норм: от декларирования прав к созданию действенных механизмов их реализации».\nВ ходе встречи эксперты Института и депутат обсудили практические аспекты имплементации новых конституционных норм в действующее законодательство. Были подняты вопросы совершенствования административной юстиции, обеспечения верховенства права и взаимодействия гражданского общества с государственными органами.\nДиректор Института Индира Аубакирова отметила важность синхронизации законотворческого процесса с фундаментальной наукой:\n«Участие депутатов Парламента в экспертных обсуждениях на площадке нашего Института позволяет проводить глубокую правовую диагностику предлагаемых новелл. Опыт Марата Советовича как ученого и практика-парламентария неоценим для выработки качественных рекомендаций по совершенствованию законодательства».\nПо итогам встречи участники пришли к единому мнению о том, что предлагаемые конституционные реформы отвечают современным вызовам и международным стандартам в области прав человека.\n\nКонтакты для СМИ: Авенов Тимур Кайратович, тел.: 8 778 615 4181\n	2	2026-02-19 14:51:29.877455+05	ru
9	Астанада жаңа Конституция жобасы бойынша  сараптамалық талқылау өтті	Астана қ., 2026 жылғы 18 ақпан\nБүгін Заңнама және құқықтық ақпарат институтында Қазақстан Республикасы Парламенті Мәжілісінің депутаты, Конституциялық реформа жөніндегі комиссияның мүшесі, заң ғылымдарының докторы, профессор Марат Башимовтың қатысуымен сараптамалық кездесу өтті.\nСараптамалық диалогтың өзегінде «Адам құқықтарын қорғау саласындағы конституциялық жаңашылдықтар: жаңа тетіктер мен кепілдіктер» тақырыбы болды. Талқылауға Институт басшылығы, жетекші ғылыми қызметкерлер, сондай-ақ беделді құқықтанушылар мен конституциялық құқық саласының мамандары қатысты.\nКездесу жаңа Конституция жобасын талдауға арналған ашық пікірталас форматында өтті. Қатысушылар саяси-құқықтық институттардың трансформациясын және елдің Негізгі заңындағы құқық қорғау тетіктерінің рөлін күшейтуді жан-жақты қарастырды.\nСарапшылар қауымдастығы алдында сөз сөйлеген Марат Башимов құқықтық жүйені ізгілендіруге ерекше назар аударды:\n«Жаңа Конституция жобасы — ең алдымен, азаматтың мүддесін қорғауға бағытталған тікелей қолданылатын құжат. Біз конституциялық нормалардың сапалы эволюциясын көріп отырмыз: құқықтарды жариялаудан оларды іске асырудың пәрменді тетіктерін қалыптастыруға дейін».\nКездесу барысында Институт сарапшылары мен депутат жаңа конституциялық нормаларды қолданыстағы заңнамаға енгізудің практикалық аспектілерін талқылады. Әкімшілік әділеттілікті жетілдіру, құқық үстемдігін қамтамасыз ету және азаматтық қоғамның мемлекеттік органдармен өзара іс-қимылы мәселелері көтерілді.\nИнститут директоры Индира Әубакірова заң шығару үдерісін іргелі ғылыммен үйлестірудің маңыздылығын атап өтті:\n«Парламент депутаттарының біздің Институт алаңындағы сараптамалық талқылауларға қатысуы ұсынылып отырған жаңалықтарға терең құқықтық диагностика жүргізуге мүмкіндік береді. Марат Советұлының ғалым әрі практик-парламентарий ретіндегі тәжірибесі заңнаманы жетілдіру бойынша сапалы ұсынымдар әзірлеуде баға жетпес».\nКездесу қорытындысы бойынша қатысушылар ұсынылып отырған конституциялық реформалар адам құқықтары саласындағы заманауи сын-қатерлер мен Халықаралық стандарттарға сай келеді деген ортақ пікірге келді.\n\nБАҚ үшін байланыс: Авенов Тимур Кайратович, тел.: 8 778 615 4181\n	2	2026-02-19 16:30:47.855695+05	kk
10	«Право ЕАЭС и деятельность Суда Союза в условиях цифровой трансформации: потенциал развития», состоявшейся в рамках Евразийского экономического форума.	28 мая 2026 года сотрудники научных отделов Института законодательства и правовой информации Республики Казахстан приняли участие в совместной сессии Суда Евразийского экономического союза и Евразийской экономической комиссии на тему: «Право ЕАЭС и деятельность Суда Союза в условиях цифровой трансформации: потенциал развития», состоявшейся в рамках Евразийского экономического форума.\n\nВ ходе специализированной правовой сессии были рассмотрены актуальные вопросы совершенствования механизмов разрешения споров и практики Суда ЕАЭС в условиях цифровой трансформации современных правоотношений, а также влияние цифровизации на развитие правового пространства Евразийского экономического союза.\n\nОсобое внимание участники уделили вопросам роли Суда ЕАЭС в формировании единого экономического пространства, влияния процессов цифровизации, искусственного интеллекта и защиты персональных данных на право Союза, перспективам развития институционального диалога судебных систем государств-членов ЕАЭС, а также повышению уровня осведомленности о праве ЕАЭС как важного фактора повышения эффективности интеграционных процессов и защиты интересов бизнеса.\n\nМодератором сессии выступил Аскар Кишкембаев – заместитель Председателя Суда Евразийского экономического союза.\n\nС содержательными докладами в рамках сессии выступили представители судебных и государственных органов государств-членов ЕАЭС, а также Евразийской экономической комиссии, в числе которых:\n\n– Эльвира Азимова – Председатель Конституционного Суда Республики Казахстан;\n\n– Александр Басалыга – заместитель директора Правового департамента Евразийской экономической комиссии;\n\n– Михаил Виноградов – начальник Главного управления международно-правового сотрудничества Генеральной прокуратуры Российской Федерации;\n\n– Алексей Дронов – Председатель Суда Евразийского экономического союза;\n\n– Наталья Павлова – судья Суда Евразийского экономического союза;\n\n– Наталья Филиппова – первый заместитель Министра юстиции Республики Беларусь;\n\n– Сайра Ызакова – первый заместитель Министра юстиции Кыргызской Республики.\n\nУчастие сотрудников ИЗПИ в данном мероприятии способствовало расширению профессионального и научно-экспертного взаимодействия с представителями международных и национальных правовых институтов государств-членов ЕАЭС.\n\n	1	2026-05-30 11:32:15.113121+05	ru
\.


--
-- Data for Name: news_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_images (id, news_id, image_url, display_order) FROM stdin;
29	5	/uploads/1771841001094-382239011.jpeg	6
30	5	/uploads/1771841001103-610142459.jpeg	7
31	9	/uploads/1771841021603-213691091.jpeg	6
32	9	/uploads/1771841021612-800807405.jpeg	7
33	10	/uploads/1780122733510-53799440.jpeg	0
34	10	/uploads/1780122733521-546407132.jpeg	1
35	10	/uploads/1780122733524-58503930.jpeg	2
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.positions (id, division_id, title_ru, title_kk, sort_order, created_at) FROM stdin;
1	1	Менеджер	Менеджер	1	2026-02-25 10:31:43.07759
2	1	Программист	Бағдарламашы	2	2026-02-25 10:31:43.07759
3	1	Архитектор проекта	Жоба сәулетшісі	3	2026-02-25 10:31:43.07759
4	1	Инженер	Инженер	4	2026-02-25 10:31:43.07759
5	1	Главный Системный администратор	Бас жүйелік әкімші	5	2026-02-25 10:31:43.07759
6	1	Младший Системный администратор	Кіші жүйелік әкімші	6	2026-02-25 10:31:43.07759
7	2	Главный специалист	Бас маман	1	2026-02-25 10:31:43.07759
8	2	Техник	Техник	2	2026-02-25 10:31:43.07759
9	3	Руководитель отдела	Бөлім басшысы	1	2026-04-30 10:48:52.464537
10	3	Главный научный сотрудник	Бас ғылыми қызметкер	2	2026-04-30 10:48:52.464537
11	3	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	3	2026-04-30 10:48:52.464537
12	3	Старший научный сотрудник	Аға ғылыми қызметкер	4	2026-04-30 10:48:52.464537
13	3	Научный сотрудник	Ғылыми қызметкер	5	2026-04-30 10:48:52.464537
14	4	Руководитель отдела	Бөлім басшысы	1	2026-04-30 10:48:52.465626
15	4	Главный научный сотрудник	Бас ғылыми қызметкер	2	2026-04-30 10:48:52.465626
16	4	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	3	2026-04-30 10:48:52.465626
17	4	Старший научный сотрудник	Аға ғылыми қызметкер	4	2026-04-30 10:48:52.465626
18	4	Научный сотрудник	Ғылыми қызметкер	5	2026-04-30 10:48:52.465626
19	5	Руководитель отдела	Бөлім басшысы	1	2026-04-30 10:48:52.466082
20	5	Главный научный сотрудник	Бас ғылыми қызметкер	2	2026-04-30 10:48:52.466082
21	5	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	3	2026-04-30 10:48:52.466082
22	5	Старший научный сотрудник	Аға ғылыми қызметкер	4	2026-04-30 10:48:52.466082
23	5	Научный сотрудник	Ғылыми қызметкер	5	2026-04-30 10:48:52.466082
24	6	Руководитель отдела	Бөлім басшысы	1	2026-04-30 10:48:52.466472
25	6	Главный научный сотрудник	Бас ғылыми қызметкер	2	2026-04-30 10:48:52.466472
26	6	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	3	2026-04-30 10:48:52.466472
27	6	Старший научный сотрудник	Аға ғылыми қызметкер	4	2026-04-30 10:48:52.466472
28	6	Научный сотрудник	Ғылыми қызметкер	5	2026-04-30 10:48:52.466472
29	7	Руководитель отдела	Бөлім басшысы	1	2026-04-30 10:48:52.46689
30	8	Руководитель управления	Басқарма басшысы	1	2026-04-30 11:19:22.145024
\.


--
-- Data for Name: sector_positions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sector_positions (id, sector_id, title_ru, title_kk, sort_order, created_at) FROM stdin;
1	1	Главный научный сотрудник	Бас ғылыми қызметкер	1	2026-04-30 10:56:09.267449
2	1	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	2	2026-04-30 10:56:09.267449
3	1	Старший научный сотрудник	Аға ғылыми қызметкер	3	2026-04-30 10:56:09.267449
4	1	Научный сотрудник	Ғылыми қызметкер	4	2026-04-30 10:56:09.267449
5	2	Ведущий научный сотрудник	Жетекші ғылыми қызметкер	1	2026-04-30 10:56:09.269828
6	2	Научный сотрудник	Ғылыми қызметкер	2	2026-04-30 10:56:09.269828
7	2	Младший научный сотрудник	Кіші ғылыми қызметкер	3	2026-04-30 10:56:09.269828
8	3	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.147593
9	3	Главный специалист	Бас маман	2	2026-04-30 11:19:22.147593
10	4	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.149442
11	4	Главный специалист	Бас маман	2	2026-04-30 11:19:22.149442
12	5	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.150148
13	5	Главный специалист	Бас маман	2	2026-04-30 11:19:22.150148
14	6	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.150799
15	6	Главный специалист	Бас маман	2	2026-04-30 11:19:22.150799
16	7	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.151468
17	7	Главный специалист	Бас маман	2	2026-04-30 11:19:22.151468
18	8	Руководитель отдела	Бөлім басшысы	1	2026-04-30 11:19:22.152165
19	8	Главный специалист	Бас маман	2	2026-04-30 11:19:22.152165
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sectors (id, division_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk, created_at) FROM stdin;
1	7	Сектор научно-лингвистической экспертизы НПА и международных договоров	НҚА және халықаралық шарттардың ғылыми-лингвистикалық сараптамасы секторы	\N	Руководитель сектора	Сектор басшысы	2026-04-30 10:56:09.262237
2	7	Сектор терминологии и научной коммуникации	Терминология және ғылыми коммуникация секторы	\N	Руководитель сектора	Сектор басшысы	2026-04-30 10:56:09.269117
3	8	Отдел формирования законодательных и подзаконных нормативных правовых актов	Заңнамалық және заңға тәуелді нормативтік құқықтық актілерді қалыптастыру бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.14677
4	8	Отдел формирования нормативных правовых актов, прошедших государственную регистрацию в органах юстиции	Әділет органдарында мемлекеттік тіркеуден өткен нормативтік құқықтық актілерді қалыптастыру бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.148619
5	8	Отдел актуализации и контроля нормативных правовых актов	Нормативтік құқықтық актілерді өзектілендіру және бақылау бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.149842
6	8	Отдел актуализации информационных правовых систем	Ақпараттық құқықтық жүйелерді өзектілендіру бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.150487
7	8	Отдел формирования информационных систем	Ақпараттық жүйелерді қалыптастыру бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.151195
8	8	Отдел тематической обработки НПА РК	ҚР НҚА-ны тақырыптық өңдеу бөлімі	\N	Руководитель отдела	Бөлім басшысы	2026-04-30 11:19:22.151941
\.


--
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_logs (id, event_type, user_id, details, ip_address, created_at) FROM stdin;
1	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-17 13:30:13.850484+05
2	LOGIN_SUCCESS	1	User admin logged in successfully	::1	2026-02-17 13:39:37.211965+05
3	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-17 17:51:39.661411+05
4	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 14:46:04.39244+05
5	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 14:51:40.413778+05
6	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 14:51:46.580707+05
7	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 14:52:12.065604+05
8	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 15:22:08.284152+05
9	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 15:22:14.786554+05
10	LOGIN_FAILED	1	Failed login attempt for user: admin	::1	2026-02-19 15:24:14.309744+05
11	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 15:42:09.750005+05
12	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 15:50:28.544741+05
13	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 15:50:59.340708+05
14	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 15:51:15.091419+05
15	LOGIN_SUCCESS	2	User manager logged in successfully	::1	2026-02-19 16:30:01.079449+05
16	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-23 13:49:47.446832+05
17	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-23 14:08:52.787577+05
18	LOGIN_SUCCESS	2	User manager logged in successfully	\N	2026-02-23 14:13:10.776962+05
19	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-23 14:27:15.026482+05
20	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-23 15:29:10.579582+05
21	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-24 10:29:49.431154+05
22	LOGIN_FAILED	\N	Failed login attempt for user: admin1	\N	2026-02-25 12:25:13.348825+05
23	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-02-25 12:25:14.894476+05
24	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-04-29 12:17:05.765233+05
25	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-05-05 10:59:49.424034+05
26	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-05-06 12:52:29.917784+05
27	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-05-30 11:30:41.138856+05
28	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-06-11 13:26:10.817524+05
29	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-06-11 17:05:31.02327+05
30	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-06-16 12:02:55.419892+05
31	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-06-16 12:20:56.862494+05
32	LOGIN_SUCCESS	1	User admin logged in successfully	\N	2026-06-21 21:55:56.028366+05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

-- SECURITY: the hashes below are placeholders for the demo password
-- "ChangeMe_2026!" — change both passwords immediately after the first
-- deploy (Dashboard → Аккаунты → 🔑 Пароль, while logged in as admin).
-- Never commit real production password hashes to this file.
COPY public.users (id, username, surname, name, role, password_hash, created_at) FROM stdin;
1	admin	Adminov	Admin	admin	$2b$10$CTNHDCgzxfTsvX6lGLxL/OeQVNDebeZgMpeO0BZTQQ9cZtbKu0ApC	2026-02-17 11:31:10.391506+05
2	manager	Managerov	Manager	manager	$2b$10$IqThHwRyjYPtiR01Fbo70udJMC75j6lb3rHXEhPwfGhD2zMVFGRzG	2026-02-17 11:54:44.108005+05
\.


--
-- Name: compliance_officer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.compliance_officer_id_seq', 1, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_id_seq', 10, true);


--
-- Name: divisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.divisions_id_seq', 10, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 4, true);


--
-- Name: managers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.managers_id_seq', 8, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 15, true);


--
-- Name: news_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_images_id_seq', 50, true);


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.positions_id_seq', 30, true);


--
-- Name: sector_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sector_positions_id_seq', 19, true);


--
-- Name: sectors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sectors_id_seq', 8, true);


--
-- Name: system_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_logs_id_seq', 32, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: compliance_officer compliance_officer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compliance_officer
    ADD CONSTRAINT compliance_officer_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: divisions divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT divisions_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: managers managers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT managers_pkey PRIMARY KEY (id);


--
-- Name: news_images news_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images
    ADD CONSTRAINT news_images_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: sector_positions sector_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sector_positions
    ADD CONSTRAINT sector_positions_pkey PRIMARY KEY (id);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: divisions divisions_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT divisions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;


--
-- Name: events events_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE SET NULL;


--
-- Name: news news_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: news_images news_images_news_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images
    ADD CONSTRAINT news_images_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: positions positions_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: sector_positions sector_positions_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sector_positions
    ADD CONSTRAINT sector_positions_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE CASCADE;


--
-- Name: sectors sectors_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: system_logs system_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict TqceQFttM0sNJ9Cw5migWU6jXgNYQ95lVZskmbB2eWMRo6Aba3pHnhoxf4u1fm6

