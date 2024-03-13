document.addEventListener("DOMContentLoaded", function () {
    const index: NodeListOf<Element> = document.querySelectorAll(".quoteback");

    if (!index.length) {
        console.log('No elements found with class "quoteback".');
        return;
    }

    for (let item = 0; item < index.length; item++) {
        console.log(index[item]);
        index[item].removeChild(index[item].querySelector("footer") as Node);

        let text: string = index[item].innerHTML;
        let url: string = index[item].getAttribute("cite") || '';
        let author: string = index[item].getAttribute("data-author") || '';
        let title: string = index[item].getAttribute("data-title") || '';

        let component: string = `
        <quoteback-component
            url="${url}"
            text="${encodeURIComponent(text)}"
            author="${author}"
            title="${title}"
        ></quoteback-component>    
        `;
        let newEl: HTMLElement = document.createElement('div');
        newEl.innerHTML = component;

        index[item].parentNode?.replaceChild(newEl, index[item]);

        let template: HTMLTemplateElement = document.createElement('template');
        template.innerHTML = `
        <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" tabindex="0">
            <div id="quoteback-parent" class="quoteback-parent">
                <div class="quoteback-content"></div>       
            </div>

            <div class="quoteback-head">        
                <div class="quoteback-metadata">
                    <div class="metadata-inner">
                        <div aria-label="" id="quoteback-author" class="quoteback-author"></div>
                        <div aria-label="" class="quoteback-title"></div>
                        <div class="quoteback-backlink"><a target="_blank" aria-label="Go to the full text of this quotation" rel="noopener" href="" class="quoteback-url"></a></div>
                    </div>  
                </div>
            </div>  
        </div>`;

        class QuoteBack extends HTMLElement {
            text: string;
            author: string;
            title: string;
            url: string;

            constructor() {
                super();
                this.appendChild(template.content.cloneNode(true));

                this.text = decodeURIComponent(this.getAttribute('text') || '');
                this.author = this.getAttribute('author') || '';
                this.title = this.getAttribute('title') || '';
                this.url = this.getAttribute('url') || '';
            };

            connectedCallback() {
                this.updateElement('.quoteback-content', this.text);
                this.updateElement('.quoteback-author', `${this.author}:`, "Quote by: " + this.author);
                this.updateElement('.quoteback-title', this.title, "Post title: " + this.title);
                this.updateElement('.quoteback-url', `${this.url}`, '', this.url);
            };

            updateElement(selector: string, innerHTML: string, ariaLabel?: string, href?: string) {
                let element = this.querySelector(selector);
                if (element) {
                    element.innerHTML = innerHTML;
                    if (ariaLabel) {
                        element.setAttribute("aria-label", ariaLabel);
                    }
                    if (href) {
                        element.setAttribute('href', href);
                    }
                }
            }
        }

        if (!customElements.get('quoteback-component')) {
            window.customElements.define('quoteback-component', QuoteBack)
        }
    }
});