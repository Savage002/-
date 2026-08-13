import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import './Dashboard.css';

const EVENT_COLORS = {
    LOGIN_SUCCESS: { bg: '#e8f8f0', color: '#1a7a4a', dot: '#27ae60', label: 'Вход' },
    LOGIN_FAILED: { bg: '#EBF2FA', color: '#004B87', dot: '#e74c3c', label: 'Ошибка входа' },
    USER_CREATED: { bg: '#e8f0ff', color: '#1a4a8a', dot: '#3498db', label: 'Создан' },
    DEFAULT: { bg: '#f4f6f9', color: '#445', dot: '#95a5a6', label: 'Событие' },
};

export default function Dashboard() {
    const { user, logout, loading, authFetch } = useAuth();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const isAdmin = user?.role === 'admin';
    const [activeTab, setActiveTab] = useState('news');

    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [newsImages, setNewsImages] = useState([]);
    const [newsLanguage, setNewsLanguage] = useState(language);
    const [uploading, setUploading] = useState(false);
    const [newsSuccess, setNewsSuccess] = useState('');
    const [newsEventId, setNewsEventId] = useState('');
    const [unboundEvents, setUnboundEvents] = useState([]);

    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsFilter, setLogsFilter] = useState('ALL');

    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regName, setRegName] = useState('');
    const [regSurname, setRegSurname] = useState('');
    const [regRole, setRegRole] = useState('manager');
    const [regLoading, setRegLoading] = useState(false);
    const [regMsg, setRegMsg] = useState({ type: '', text: '' });

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [pwModal, setPwModal] = useState(null);
    const [newPw, setNewPw] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [allNews, setAllNews] = useState([]);
    const [allNewsLoading, setAllNewsLoading] = useState(false);
    const [editNews, setEditNews] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editLang, setEditLang] = useState('ru');
    const [editImages, setEditImages] = useState([]);
    const [editUploading, setEditUploading] = useState(false);
    const [editMsg, setEditMsg] = useState({ type: '', text: '' });
    const [newsDeleteConfirm, setNewsDeleteConfirm] = useState(null);

    const [stats, setStats] = useState({ news: 0, managers: 0, users: 0 });

    const [eventsList, setEventsList] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLanguage, setEventLanguage] = useState(language);
    const [eventNewsId, setEventNewsId] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventSuccess, setEventSuccess] = useState('');

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        fetch('/api/news').then(r => r.json()).then(d => setStats(s => ({ ...s, news: Array.isArray(d) ? d.length : 0 }))).catch(err => console.error('Failed to load news stats:', err));
        fetch('/api/managers').then(r => r.json()).then(d => setStats(s => ({ ...s, managers: Array.isArray(d) ? d.length : 0 }))).catch(err => console.error('Failed to load managers stats:', err));
    }, []);

    const fetchLogs = () => {
        setLogsLoading(true);
        authFetch('/api/logs')
            .then(r => r.json())
            .then(d => { setLogs(Array.isArray(d) ? d : []); setLogsLoading(false); })
            .catch(() => setLogsLoading(false));
    };

    const fetchUsers = () => {
        setUsersLoading(true);
        authFetch('/api/auth/users')
            .then(r => r.json())
            .then(d => { setUsers(Array.isArray(d) ? d : []); setUsersLoading(false); })
            .catch(() => setUsersLoading(false));
    };

    const fetchAllNews = () => {
        setAllNewsLoading(true);
        fetch('/api/news')
            .then(r => r.json())
            .then(d => { setAllNews(Array.isArray(d) ? d : []); setAllNewsLoading(false); })
            .catch(() => setAllNewsLoading(false));
    };

    const openEditNews = async (newsItem) => {
        setEditMsg({ type: '', text: '' });
        try {
            const res = await fetch(`/api/news/${newsItem.id}`);
            const data = await res.json();
            setEditNews(data);
            setEditTitle(data.title);
            setEditContent(data.content);
            setEditLang(data.language || 'ru');
            setEditImages(data.images ? data.images.map((url) => ({ id: null, image_url: url })) : []);
        } catch (err) {
            setEditMsg({ type: 'error', text: '❌ Не удалось загрузить новость: ' + err.message });
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setEditMsg({ type: '', text: '' });
        try {
            const res = await authFetch(`/api/news/${editNews.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, content: editContent, language: editLang })
            });
            const data = await res.json();
            if (res.ok) {
                setEditMsg({ type: 'success', text: '✅ ' + data.message });
                setAllNews(prev => prev.map(n => n.id === editNews.id ? { ...n, title: editTitle, language: editLang } : n));
            } else {
                setEditMsg({ type: 'error', text: '❌ ' + data.message });
            }
        } catch { setEditMsg({ type: 'error', text: '❌ Ошибка соединения' }); }
    };

    const handleUploadEditImages = async (e) => {
        const files = Array.from(e.target.files);
        setEditUploading(true);
        const urls = [];
        for (const file of files) {
            const fd = new FormData(); fd.append('image', file);
            try {
                const res = await authFetch('/api/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.imageUrl) urls.push(data.imageUrl);
                else console.error('Upload failed:', data.message);
            } catch (err) { console.error('Upload failed:', err); }
        }
        if (urls.length > 0 && editNews) {
            try {
                const res = await authFetch(`/api/news/${editNews.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ images: urls })
                });
                const data = await res.json();
                if (res.ok) {
                    setEditImages(data.images.map(img => ({ id: img.id, image_url: img.image_url })));
                }
            } catch (err) { console.error('Failed to attach images:', err); }
        }
        setEditUploading(false);
    };

    const handleRemoveEditImage = async (imgId, imgUrl) => {
        if (imgId && !String(imgId).startsWith('_')) {
            await authFetch(`/api/news/${editNews.id}/images/${imgId}`, { method: 'DELETE' })
                .catch(err => console.error('Failed to delete image:', err));
        }
        setEditImages(prev => prev.filter(img => img.image_url !== imgUrl));
    };

    const handleDeleteNews = async (id) => {
        try {
            const res = await authFetch(`/api/news/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAllNews(prev => prev.filter(n => n.id !== id));
                setNewsDeleteConfirm(null);
                setStats(s => ({ ...s, news: Math.max(0, s.news - 1) }));
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Не удалось удалить новость');
            }
        } catch (err) {
            alert('Ошибка соединения: ' + err.message);
        }
    };

    const fetchUnboundEvents = () => {
        fetch('/api/events')
            .then(r => r.json())
            .then(d => {
                const all = Array.isArray(d) ? d : [];
                setUnboundEvents(all.filter(ev => !ev.news_id));
            })
            .catch(err => console.error('Failed to load events:', err));
    };

    const fetchEvents = () => {
        setEventsLoading(true);
        fetch('/api/events')
            .then(r => r.json())
            .then(d => { setEventsList(Array.isArray(d) ? d : []); setEventsLoading(false); })
            .catch(() => setEventsLoading(false));
    };

    useEffect(() => {
        if (activeTab === 'logs' && isAdmin) fetchLogs();
        if (activeTab === 'accounts' && isAdmin) fetchUsers();
        if ((activeTab === 'manage' || activeTab === 'events') && isAdmin) fetchAllNews();
        if (activeTab === 'events') fetchEvents();
        if (activeTab === 'news') fetchUnboundEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, isAdmin]);

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: eventTitle,
                    event_date: eventDate,
                    time: eventTime,
                    location: eventLocation,
                    language: eventLanguage,
                    news_id: eventNewsId || null
                })
            });
            if (res.ok) {
                setEventSuccess('Мероприятие успешно добавлено!');
                setEventTitle(''); setEventDate(''); setEventTime(''); setEventNewsId(''); setEventLocation('');
                fetchEvents();
                setTimeout(() => setEventSuccess(''), 3000);
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Не удалось добавить мероприятие');
            }
        } catch (err) {
            alert('Ошибка соединения: ' + err.message);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Удалить мероприятие?')) return;
        try {
            const res = await authFetch(`/api/events/${id}`, { method: 'DELETE' });
            if (res.ok) fetchEvents();
            else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Не удалось удалить мероприятие');
            }
        } catch (err) {
            alert('Ошибка соединения: ' + err.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMsg('');
        try {
            const res = await authFetch(`/api/auth/users/${pwModal.id}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPw })
            });
            const data = await res.json();
            if (res.ok) {
                setPwMsg('✅ ' + data.message);
                setTimeout(() => { setPwModal(null); setNewPw(''); setPwMsg(''); }, 1500);
            } else {
                setPwMsg('❌ ' + data.message);
            }
        } catch { setPwMsg('❌ Ошибка соединения'); }
    };

    const handleDeleteUser = async (id) => {
        try {
            const res = await authFetch(`/api/auth/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
                setDeleteConfirm(null);
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Не удалось удалить пользователя');
            }
        } catch (err) {
            alert('Ошибка соединения: ' + err.message);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        const urls = [];
        for (const file of files) {
            const fd = new FormData(); fd.append('image', file);
            try {
                const res = await authFetch('/api/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.imageUrl) urls.push(data.imageUrl);
                else alert(data.message || 'Не удалось загрузить файл');
            } catch (err) { alert('Ошибка загрузки: ' + err.message); }
        }
        setNewsImages(prev => [...prev, ...urls]);
        setUploading(false);
    };

    const handleSubmitNews = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newsTitle, content: newsContent, images: newsImages, language: newsLanguage })
            });
            if (res.ok) {
                const data = await res.json();
                const createdNewsId = data.newsId;

                // If an event was selected, bind it to this news
                if (newsEventId && createdNewsId) {
                    const selectedEv = unboundEvents.find(ev => String(ev.id) === String(newsEventId));
                    if (selectedEv) {
                        await authFetch(`/api/events/${newsEventId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: selectedEv.title,
                                event_date: selectedEv.event_date,
                                time: selectedEv.time,
                                location: selectedEv.location,
                                language: selectedEv.language,
                                news_id: createdNewsId
                            })
                        }).catch(err => console.error('Failed to bind event:', err));
                    }
                }

                setNewsSuccess('Новость успешно опубликована!' + (newsEventId ? ' Мероприятие привязано.' : ''));
                setNewsTitle(''); setNewsContent(''); setNewsImages([]); setNewsEventId('');
                setStats(s => ({ ...s, news: s.news + 1 }));
                fetchUnboundEvents();
                setTimeout(() => setNewsSuccess(''), 3000);
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Не удалось опубликовать новость');
            }
        } catch (err) {
            alert('Ошибка соединения: ' + err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPassword !== regConfirm) {
            setRegMsg({ type: 'error', text: 'Пароли не совпадают' });
            return;
        }
        setRegLoading(true);
        setRegMsg({ type: '', text: '' });
        try {
            const res = await authFetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: regUsername, password: regPassword, role: regRole, name: regName, surname: regSurname })
            });
            const data = await res.json();
            if (res.ok) {
                setRegMsg({ type: 'success', text: `✅ Пользователь «${data.user.username}» создан (${data.user.role})` });
                setRegUsername(''); setRegPassword(''); setRegConfirm(''); setRegName(''); setRegSurname('');
                setStats(s => ({ ...s, users: s.users + 1 }));
            } else {
                setRegMsg({ type: 'error', text: data.message || 'Ошибка создания' });
            }
        } catch {
            setRegMsg({ type: 'error', text: 'Ошибка соединения с сервером' });
        }
        setRegLoading(false);
    };

    if (loading || !user) return (
        <div className="db-loading">
            <div className="db-spinner" />
            <span>Загрузка...</span>
        </div>
    );

    const tabs = [
        { id: 'news', icon: '📰', label: 'Создать' },
        { id: 'events', icon: '📅', label: 'Мероприятия' },
        ...(isAdmin ? [
            { id: 'manage', icon: '✏️', label: 'Новости' },
            { id: 'accounts', icon: '👤', label: 'Аккаунты' },
            { id: 'logs', icon: '📋', label: 'Логи' },
        ] : []),
    ];

    const statsCards = [
        { icon: '📰', label: 'Новостей', value: stats.news, color: '#004B87' },
        { icon: '👥', label: 'Сотрудников', value: stats.managers, color: '#1a4a8a' },
        { icon: '🏛️', label: 'Филиалов', value: 18, color: '#1a7a4a' },
        ...(isAdmin ? [{ icon: '🔑', label: 'Аккаунтов', value: '2+', color: '#7a4a1a' }] : []),
    ];

    const filteredLogs = logsFilter === 'ALL' ? logs : logs.filter(l => l.event_type === logsFilter);

    return (
        <div className="db-layout">

            <aside className="db-sidebar">
                <div className="db-sidebar-header">
                    <div className="db-avatar">{(user.username || '?').charAt(0).toUpperCase()}</div>
                    <div className="db-user-info">
                        <strong>{user.username}</strong>
                        <span className={`db-role-badge ${user.role}`}>
                            {isAdmin ? '⭐ Администратор' : '👤 Менеджер'}
                        </span>
                    </div>
                </div>

                <nav className="db-nav">
                    {tabs.map(tab => (
                        <button key={tab.id}
                            className={`db-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}>
                            <span className="db-nav-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <button className="db-logout-btn" onClick={() => { logout(); navigate('/'); }}>
                    <span>🚪</span> Выйти
                </button>
            </aside>


            <main className="db-main">
                <header className="db-topbar">
                    <div className="db-topbar-title">
                        <h1>{tabs.find(t => t.id === activeTab)?.label}</h1>
                        <span className="db-breadcrumb">Панель управления → {tabs.find(t => t.id === activeTab)?.label}</span>
                    </div>
                    <div className="db-topbar-date">
                        {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </header>

                <div className="db-stats-row">
                    {statsCards.map((s, i) => (
                        <div key={i} className="db-stat-card" style={{ '--c': s.color }}>
                            <div className="db-stat-icon" style={{ background: s.color + '18' }}>{s.icon}</div>
                            <div>
                                <strong>{s.value}</strong>
                                <span>{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>


                {activeTab === 'news' && (
                    <div className="db-card db-news-form">
                        <div className="db-card-header">
                            <h2>📰 Создать новость</h2>
                            <p>Заполните форму для публикации новости на сайте</p>
                        </div>
                        {newsSuccess && <div className="db-alert success">{newsSuccess}</div>}
                        <form onSubmit={handleSubmitNews} className="db-form">
                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label>Язык публикации</label>
                                    <select value={newsLanguage} onChange={e => setNewsLanguage(e.target.value)}>
                                        <option value="ru">🇷🇺 Русский</option>
                                        <option value="kk">🇰🇿 Қазақша</option>
                                    </select>
                                </div>
                                <div className="db-form-group">
                                    <label>📅 Привязать к мероприятию</label>
                                    <select value={newsEventId} onChange={e => setNewsEventId(e.target.value)}>
                                        <option value="">-- Без привязки --</option>
                                        {unboundEvents.map(ev => (
                                            <option key={ev.id} value={ev.id}>
                                                {new Date(ev.event_date).toLocaleDateString('ru-RU')} — {ev.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="db-form-group">
                                <label>Заголовок *</label>
                                <input type="text" placeholder="Введите заголовок..." value={newsTitle} onChange={e => setNewsTitle(e.target.value)} required />
                            </div>
                            <div className="db-form-group">
                                <label>Содержание *</label>
                                <textarea placeholder="Введите текст новости..." value={newsContent} onChange={e => setNewsContent(e.target.value)} rows={6} required />
                            </div>
                            <div className="db-form-group">
                                <label>Изображения</label>
                                <label className="db-file-upload">
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                                    {uploading ? '⏳ Загрузка...' : '📎 Прикрепить изображения'}
                                </label>
                                {newsImages.length > 0 && (
                                    <div className="db-image-previews">
                                        {newsImages.map((url, idx) => (
                                            <div key={idx} className="db-img-wrap">
                                                <img src={url} alt="Preview" />
                                                <button type="button" className="db-img-remove"
                                                    onClick={() => setNewsImages(p => p.filter((_, i) => i !== idx))}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="db-form-actions">
                                <button type="submit" className="db-btn-primary" disabled={uploading}>🚀 Опубликовать</button>
                                <button type="button" className="db-btn-secondary"
                                    onClick={() => { setNewsTitle(''); setNewsContent(''); setNewsImages([]); setNewsEventId(''); }}>Очистить</button>
                            </div>
                        </form>
                    </div>
                )}


                {activeTab === 'events' && (
                    <div className="db-card db-news-form">
                        <div className="db-card-header">
                            <h2>📅 Мероприятия календаря</h2>
                            <p>Добавляйте мероприятия и связывайте их с опубликованными новостями</p>
                        </div>
                        {eventSuccess && <div className="db-alert success">{eventSuccess}</div>}
                        <form onSubmit={handleSubmitEvent} className="db-form">
                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label>Дата *</label>
                                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                                </div>
                                <div className="db-form-group">
                                    <label>Время (опционально)</label>
                                    <input type="text" placeholder="10:00 - 12:00" value={eventTime} onChange={e => setEventTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="db-form-group">
                                <label>Название мероприятия *</label>
                                <input type="text" placeholder="Введите название..." value={eventTitle} onChange={e => setEventTitle(e.target.value)} required />
                            </div>
                            <div className="db-form-group">
                                <label>Место проведения</label>
                                <input type="text" placeholder="г. Астана, ул. Мангилик Ел, 8" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
                            </div>
                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label>Язык</label>
                                    <select value={eventLanguage} onChange={e => setEventLanguage(e.target.value)}>
                                        <option value="ru">🇷🇺 Русский</option>
                                        <option value="kk">🇰🇿 Қазақша</option>
                                    </select>
                                </div>
                                <div className="db-form-group">
                                    <label>Привязать к новости (если новость уже опубликована)</label>
                                    <select value={eventNewsId} onChange={e => setEventNewsId(e.target.value)}>
                                        <option value="">-- Нет привязки --</option>
                                        {allNews.map(n => (
                                            <option key={n.id} value={n.id}>{n.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="db-form-actions">
                                <button type="submit" className="db-btn-primary">Добавить мероприятие</button>
                            </div>
                        </form>

                        <div className="db-users-table-wrap" style={{ marginTop: '2rem' }}>
                            {eventsLoading ? (
                                <div className="db-logs-loading"><div className="db-spinner" /> Загрузка...</div>
                            ) : eventsList.length === 0 ? (
                                <div className="db-logs-empty">📭 Нет мероприятий</div>
                            ) : (
                                <table className="db-users-table">
                                    <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Время</th>
                                            <th>Название</th>
                                            <th>Место</th>
                                            <th>Новость</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventsList.map(ev => (
                                            <tr key={ev.id}>
                                                <td>{new Date(ev.event_date).toLocaleDateString()}</td>
                                                <td>{ev.time || '—'}</td>
                                                <td>{ev.title}</td>
                                                <td>{ev.location || '—'}</td>
                                                <td>{ev.news_id ? '✅ Привязана' : '❌ Нет'}</td>
                                                <td>
                                                    <button className="db-btn-danger db-btn-sm" onClick={() => handleDeleteEvent(ev.id)}>Удалить</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}



                {activeTab === 'manage' && isAdmin && (
                    <>
                        <div className="db-card">
                            <div className="db-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2>✏️ Управление новостями</h2>
                                    <p>Редактирование и удаление опубликованных новостей</p>
                                </div>
                                <button className="db-btn-secondary db-btn-sm" onClick={fetchAllNews}>🔄 Обновить</button>
                            </div>
                            <div className="db-users-table-wrap">
                                {allNewsLoading ? (
                                    <div className="db-logs-loading"><div className="db-spinner" /> Загрузка...</div>
                                ) : allNews.length === 0 ? (
                                    <div className="db-logs-empty">📭 Нет новостей</div>
                                ) : (
                                    <table className="db-users-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Изображение</th>
                                                <th>Заголовок</th>
                                                <th>Язык</th>
                                                <th>Дата</th>
                                                <th>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allNews.map((item, i) => (
                                                <tr key={item.id}>
                                                    <td className="db-td-num">{i + 1}</td>
                                                    <td>
                                                        {item.image_url
                                                            ? <img src={item.image_url} alt="" className="db-news-thumb" />
                                                            : <span className="db-no-img">—</span>}
                                                    </td>
                                                    <td style={{ maxWidth: '320px' }}>
                                                        <span className="db-news-title-cell">{item.title}</span>
                                                    </td>
                                                    <td>
                                                        <span className="db-role-pill manager">{item.language === 'kk' ? '🇰🇿 Қаз' : '🇷🇺 Рус'}</span>
                                                    </td>
                                                    <td className="db-td-date">
                                                        {item.created_at ? new Date(item.created_at).toLocaleDateString('ru-RU') : '—'}
                                                    </td>
                                                    <td className="db-td-actions">
                                                        <button className="db-action-btn pw" onClick={() => openEditNews(item)}>
                                                            ✏️ Изменить
                                                        </button>
                                                        <button className="db-action-btn del" onClick={() => setNewsDeleteConfirm(item)}>
                                                            🗑️ Удалить
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>


                        {editNews && (
                            <div className="db-modal-overlay" onClick={() => setEditNews(null)}>
                                <div className="db-modal db-edit-modal" onClick={e => e.stopPropagation()}>
                                    <div className="db-edit-modal-header">
                                        <h3>✏️ Редактировать новость</h3>
                                        <button className="db-modal-close" onClick={() => setEditNews(null)}>✕</button>
                                    </div>
                                    {editMsg.text && <div className={`db-alert ${editMsg.type}`}>{editMsg.text}</div>}
                                    <form onSubmit={handleSaveEdit}>
                                        <div className="db-form-group" style={{ marginTop: '1rem' }}>
                                            <label>Язык</label>
                                            <select value={editLang} onChange={e => setEditLang(e.target.value)}>
                                                <option value="ru">🇷🇺 Русский</option>
                                                <option value="kk">🇰🇿 Қазақша</option>
                                            </select>
                                        </div>
                                        <div className="db-form-group">
                                            <label>Заголовок *</label>
                                            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                                        </div>
                                        <div className="db-form-group">
                                            <label>Содержание *</label>
                                            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={5} required />
                                        </div>


                                        <div className="db-form-group">
                                            <label>Фотографии</label>
                                            {editImages.length > 0 && (
                                                <div className="db-image-previews" style={{ marginBottom: '0.75rem' }}>
                                                    {editImages.map((img, idx) => (
                                                        <div key={idx} className="db-img-wrap">
                                                            <img src={img.image_url} alt="" />
                                                            <button type="button" className="db-img-remove"
                                                                onClick={() => handleRemoveEditImage(img.id, img.image_url)}>✕</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <label className="db-file-upload">
                                                <input type="file" multiple accept="image/*" onChange={handleUploadEditImages} />
                                                {editUploading ? '⏳ Загрузка...' : '📎 Добавить фото'}
                                            </label>
                                        </div>

                                        <div className="db-modal-actions">
                                            <button type="submit" className="db-btn-primary">💾 Сохранить</button>
                                            <button type="button" className="db-btn-secondary" onClick={() => setEditNews(null)}>Отмена</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}


                        {newsDeleteConfirm && (
                            <div className="db-modal-overlay" onClick={() => setNewsDeleteConfirm(null)}>
                                <div className="db-modal" onClick={e => e.stopPropagation()}>
                                    <h3>🗑️ Удалить новость?</h3>
                                    <p>Будет удалена новость: <strong>«{newsDeleteConfirm.title}»</strong>. Все изображения тоже будут удалены. Это действие необратимо.</p>
                                    <div className="db-modal-actions">
                                        <button className="db-btn-danger" onClick={() => handleDeleteNews(newsDeleteConfirm.id)}>Да, удалить</button>
                                        <button className="db-btn-secondary" onClick={() => setNewsDeleteConfirm(null)}>Отмена</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}



                {activeTab === 'accounts' && isAdmin && (
                    <>

                        <div className="db-card">
                            <div className="db-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2>👥 Все пользователи</h2>
                                    <p>Управление существующими аккаунтами</p>
                                </div>
                                <button className="db-btn-secondary db-btn-sm" onClick={fetchUsers}>🔄 Обновить</button>
                            </div>

                            <div className="db-users-table-wrap">
                                {usersLoading ? (
                                    <div className="db-logs-loading"><div className="db-spinner" /> Загрузка...</div>
                                ) : users.length === 0 ? (
                                    <div className="db-logs-empty">📭 Нет пользователей</div>
                                ) : (
                                    <table className="db-users-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Логин</th>
                                                <th>Имя</th>
                                                <th>Роль</th>
                                                <th>Дата создания</th>
                                                <th>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u, i) => (
                                                <tr key={u.id}>
                                                    <td className="db-td-num">{i + 1}</td>
                                                    <td><span className="db-td-username">@{u.username}</span></td>
                                                    <td>{[u.surname, u.name].filter(Boolean).join(' ') || '—'}</td>
                                                    <td>
                                                        <span className={`db-role-pill ${u.role}`}>
                                                            {u.role === 'admin' ? '⭐ Администратор' : '👤 Менеджер'}
                                                        </span>
                                                    </td>
                                                    <td className="db-td-date">
                                                        {u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : '—'}
                                                    </td>
                                                    <td className="db-td-actions">
                                                        <button className="db-action-btn pw"
                                                            onClick={() => { setPwModal({ id: u.id, username: u.username }); setNewPw(''); setPwMsg(''); }}>
                                                            🔑 Пароль
                                                        </button>
                                                        {u.id !== user.id && (
                                                            <button className="db-action-btn del"
                                                                onClick={() => setDeleteConfirm(u)}>
                                                                🗑️ Удалить
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>


                        <div className="db-card">
                            <div className="db-card-header">
                                <h2>➕ Создать аккаунт</h2>
                                <p>Добавить нового сотрудника с доступом к панели управления</p>
                            </div>
                            {regMsg.text && <div className={`db-alert ${regMsg.type}`}>{regMsg.text}</div>}
                            <form onSubmit={handleRegister} className="db-form">
                                <div className="db-form-row">
                                    <div className="db-form-group">
                                        <label>Имя</label>
                                        <input type="text" placeholder="Имя" value={regName} onChange={e => setRegName(e.target.value)} />
                                    </div>
                                    <div className="db-form-group">
                                        <label>Фамилия</label>
                                        <input type="text" placeholder="Фамилия" value={regSurname} onChange={e => setRegSurname(e.target.value)} />
                                    </div>
                                </div>
                                <div className="db-form-row">
                                    <div className="db-form-group">
                                        <label>Логин *</label>
                                        <input type="text" placeholder="username" value={regUsername} onChange={e => setRegUsername(e.target.value)} required />
                                    </div>
                                    <div className="db-form-group">
                                        <label>Роль *</label>
                                        <select value={regRole} onChange={e => setRegRole(e.target.value)}>
                                            <option value="manager">👤 Менеджер</option>
                                            <option value="admin">⭐ Администратор</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="db-form-row">
                                    <div className="db-form-group">
                                        <label>Пароль *</label>
                                        <input type="password" placeholder="Минимум 6 символов" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6} />
                                    </div>
                                    <div className="db-form-group">
                                        <label>Повторите пароль *</label>
                                        <input type="password" placeholder="Повторите пароль" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="db-form-actions">
                                    <button type="submit" className="db-btn-primary" disabled={regLoading}>
                                        {regLoading ? '⏳ Создание...' : '✅ Создать аккаунт'}
                                    </button>
                                </div>
                            </form>
                        </div>


                        {pwModal && (
                            <div className="db-modal-overlay" onClick={() => setPwModal(null)}>
                                <div className="db-modal" onClick={e => e.stopPropagation()}>
                                    <h3>🔑 Смена пароля</h3>
                                    <p>Пользователь: <strong>@{pwModal.username}</strong></p>
                                    <form onSubmit={handleChangePassword}>
                                        <div className="db-form-group">
                                            <label>Новый пароль</label>
                                            <input type="password" placeholder="Минимум 6 символов" value={newPw}
                                                onChange={e => setNewPw(e.target.value)} required minLength={6} autoFocus />
                                        </div>
                                        {pwMsg && <p className={`db-modal-msg ${pwMsg.startsWith('✅') ? 'ok' : 'err'}`}>{pwMsg}</p>}
                                        <div className="db-modal-actions">
                                            <button type="submit" className="db-btn-primary">Сохранить</button>
                                            <button type="button" className="db-btn-secondary" onClick={() => setPwModal(null)}>Отмена</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}


                        {deleteConfirm && (
                            <div className="db-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                                <div className="db-modal" onClick={e => e.stopPropagation()}>
                                    <h3>🗑️ Удалить аккаунт?</h3>
                                    <p>Вы уверены, что хотите удалить пользователя <strong>@{deleteConfirm.username}</strong>? Это действие необратимо.</p>
                                    <div className="db-modal-actions">
                                        <button className="db-btn-danger" onClick={() => handleDeleteUser(deleteConfirm.id)}>Да, удалить</button>
                                        <button className="db-btn-secondary" onClick={() => setDeleteConfirm(null)}>Отмена</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}


                {activeTab === 'logs' && isAdmin && (
                    <div className="db-card">
                        <div className="db-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2>📋 Системные логи</h2>
                                <p>Последние 100 событий в системе</p>
                            </div>
                            <div className="db-logs-controls">
                                <select className="db-logs-filter" value={logsFilter} onChange={e => setLogsFilter(e.target.value)}>
                                    <option value="ALL">Все события</option>
                                    <option value="LOGIN_SUCCESS">✅ Входы</option>
                                    <option value="LOGIN_FAILED">❌ Ошибки входа</option>
                                    <option value="USER_CREATED">👤 Созданы</option>
                                </select>
                                <button className="db-btn-secondary db-btn-sm" onClick={fetchLogs}>🔄 Обновить</button>
                            </div>
                        </div>

                        <div className="db-logs-list">
                            {logsLoading ? (
                                <div className="db-logs-loading"><div className="db-spinner" /> Загрузка...</div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="db-logs-empty">📭 Нет событий</div>
                            ) : filteredLogs.map((log, i) => {
                                const style = EVENT_COLORS[log.event_type] || EVENT_COLORS.DEFAULT;
                                return (
                                    <div key={i} className="db-log-row" style={{ '--lb': style.bg, '--lc': style.color, '--ld': style.dot }}>
                                        <div className="db-log-dot" />
                                        <div className="db-log-body">
                                            <div className="db-log-top">
                                                <span className="db-log-badge" style={{ background: style.bg, color: style.color }}>
                                                    {style.label}
                                                </span>
                                                <span className="db-log-time">
                                                    {log.created_at ? new Date(log.created_at).toLocaleString('ru-RU') : '—'}
                                                </span>
                                            </div>
                                            <p className="db-log-details">{log.details}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
