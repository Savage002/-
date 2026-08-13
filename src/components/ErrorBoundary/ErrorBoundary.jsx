import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled render error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <h1 style={{ margin: 0 }}>Что-то пошло не так</h1>
                    <p style={{ margin: 0, color: '#666' }}>Попробуйте обновить страницу.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={{ padding: '0.6rem 1.4rem', cursor: 'pointer' }}
                    >
                        Обновить страницу
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
