import { Conversation } from './interfaces';

const metaPermalink: HTMLMetaElement | null = document.querySelector('meta[name="permalink"]'); // via head.html partial
const permalink: string = metaPermalink ? metaPermalink.content : '';
const conversationURL: string = `https://micro.blog/conversation.js?url=${permalink}&format=jsonfeed`;

const fetchConversationJSON = async (): Promise<Conversation | null> => {
    const response: Response = await fetch(conversationURL);
    if (!response.ok) {
        console.error(response.status);
        return null;
    };
    const conversationJSON: Conversation = await response.json() as Conversation;

    return conversationJSON;
};

const main = async () => {
    const microblogReplyLink: HTMLAnchorElement = document.getElementById('to-microblog') as HTMLAnchorElement;
    const conversationJSON: Conversation | null = await fetchConversationJSON();

    if (conversationJSON) {
        const mbURL: string = conversationJSON.home_page_url;

        if (mbURL) {
            microblogReplyLink.href = mbURL;
        }

        writeConversationToDOM(conversationJSON);
    } else {
        microblogReplyLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Post is still syncing to the Micro.blog timeline; try again soon.');
        });
    }
}

const writeConversationToDOM = (conversation: Conversation): void => {
    const conversationHTML: HTMLElement = document.createElement('div');
    conversationHTML.classList.add('microblog-conversation');
    conversationHTML.innerHTML += `<hr>`;

    conversation.items.forEach((reply) => {
        const replyMetadata: HTMLElement = document.createElement('div');
        replyMetadata.classList.add('reply-metadata');
        const replyHTML: HTMLElement = document.createElement('div');
        replyHTML.classList.add('conversation-reply');
        
        const myMBUsername: string = 'typejade';
        if (reply.author._microblog.username === myMBUsername) {
            replyMetadata.innerHTML += `<span class="reply-author"><span class="author-name">Jade van Dorsten</span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg></span>`;
        } else {
            replyMetadata.innerHTML += `<span class="reply-author"><span class="author-name">${ reply.author.name }</span></span>`;
        };
        
        const date: Date = new Date(reply.date_published);
        const dateOptions: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en', dateOptions);
        const formattedDate: string = dateFormatter.format(date);
        const cformattedDate = formattedDate.replace(' at ', ', ');
        const isoDate: string = date.toISOString();
        replyMetadata.innerHTML += `
            <div class="timestamp">
                <a href="${ reply.url }" class="u-url enter"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg></a>
                <span class="reply-date" datetime="${ isoDate }">${ cformattedDate }</span>
            </div>
        `;

        replyHTML.appendChild(replyMetadata);

        const imgParser: DOMParser = new DOMParser();
        const parsedReplyContent: Document = imgParser.parseFromString(reply.content_html, 'text/html');
        parsedReplyContent.querySelectorAll('img').forEach(img => {
            img.loading = 'lazy';
            const a: HTMLAnchorElement = document.createElement('a');
            a.href = img.src;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.title = 'Open image in new tab';

            const figure: HTMLElement = document.createElement('figure');
            figure.classList.add('figimg')
            figure.appendChild(a);
            a.appendChild(img.cloneNode(true));
            if (img.alt || img.alt !== '') {
                figure.innerHTML += `<figcaption>${ img.alt }</figcaption>`;
            }
            img.parentNode?.replaceChild(figure, img);
        });
        replyHTML.innerHTML += `<div class="reply-content">${ parsedReplyContent.body.innerHTML }</div>`;

        conversationHTML.appendChild(replyHTML);
    });

    const coversationContainer: HTMLElement = document.getElementById('col-2-container') as HTMLElement;

    if (conversation.items.length > 0) {
        coversationContainer.appendChild(conversationHTML);
    };
};

main();