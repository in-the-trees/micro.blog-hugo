document.addEventListener("DOMContentLoaded", () => {
    const ogs:NodeListOf<HTMLElement> = document.querySelectorAll(".og-container");

    ogs.forEach((og_container) => {
        const og: HTMLElement = og_container.querySelector('.og') as HTMLElement;

        const url = og.dataset.url || '';
        const title = og.dataset.title || '';
        const snippet = og.dataset.snippet || '';
        
        let innerHTML: string = "";

        if (snippet.length > 0) {
            innerHTML +=
            `
                <p class="og-snippet">${snippet}</p>
            `;
        }

        innerHTML +=
        `
            <div class="og-metadata">
                <div>
                    ${title ? `<span class="og-title">${title}</span>` : ''}
                    <span class="og-url">${url}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;

        const a: HTMLAnchorElement = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');

        og.innerHTML = innerHTML;
        og.removeAttribute('data-url');
        og.removeAttribute('data-title');
        og.removeAttribute('data-snippet');
        og.classList.remove('og-hide');

        a.appendChild(og);
        og_container.appendChild(a);
    });
});