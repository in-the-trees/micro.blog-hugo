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
    const microblogReplyLink: HTMLAnchorElement = document.getElementById('reply-link-mb') as HTMLAnchorElement;
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
        
        const myMBUsername: string = 'jadevandorsten';
        if (reply.author._microblog.username === myMBUsername) {
            replyMetadata.innerHTML += `<span class="reply-author">Jade van Dorsten<span> (op)</span></span>`;
        } else {
            replyMetadata.innerHTML += `<span class="reply-author">${ reply.author.name }</span>`;
        };
        
        const date: Date = new Date(reply.date_published);
        const dateOptions: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en', dateOptions);
        const formattedDate: string = dateFormatter.format(date);
        const cformattedDate = formattedDate.replace(' at ', ', ');
        const isoDate: string = date.toISOString();
        replyMetadata.innerHTML += ` on <a href="${ reply.url }"><span class="reply-date" datetime="${ isoDate }">${ cformattedDate }</span></a>`;

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

    const dom_main: HTMLElement = document.querySelector('main') as HTMLElement;

    if (conversation.items.length > 0) {
        dom_main.appendChild(conversationHTML);
    };
};

main();