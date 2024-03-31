document.addEventListener("DOMContentLoaded", () => {
    const timeElements:NodeListOf<HTMLElement> = document.querySelectorAll("time");
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
    timeElements.forEach((timeElement) => {
        const date = new Date(timeElement.getAttribute('datetime') || '');
        const now = new Date();
        const diff = (date.getTime() - now.getTime()) / 1000;

        const twoWeeksInSeconds = 2 * 7 * 24 * 60 * 60;
        if (Math.abs(diff) >= twoWeeksInSeconds) {
            return;
        }

        const units: Intl.RelativeTimeFormatUnit[] = [
            'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second'
        ];

        const divisors = [
            31536000, 7776000, 2592000, 604800, 86400, 3600, 60, 1
        ];

        for (let i = 0; i < units.length; i++) {
            if (Math.abs(diff) >= divisors[i]) {
                timeElement.title = timeElement.textContent || '';
                timeElement.innerHTML = rtf.format(Math.round(diff / divisors[i]), units[i]);
                break;
            }
        }
    });
});