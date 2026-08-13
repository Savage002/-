import { useEffect } from 'react';

const useScrollAnimation = (dependencies = []) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.fade-in-section');
        hiddenElements.forEach((el) => observer.observe(el));

        return () => {
            hiddenElements.forEach((el) => observer.unobserve(el));
        };
        // `dependencies` is intentionally forwarded from the caller as a dynamic array.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};

export default useScrollAnimation;
