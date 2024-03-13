interface MB_Data {
    username: string;
}

interface Author {
    name: string;
    url: string;
    avatar: string;
    _microblog: MB_Data;
}

interface Reply {
    id: string;
    content_html: string;
    url: string;
    date_published: string;
    author: Author;
}

export interface Conversation {
    version: string;
    title: string;
    home_page_url: string;
    feed_url: string;
    items: Reply[];
}