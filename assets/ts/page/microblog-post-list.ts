document.addEventListener("DOMContentLoaded", () => {
    const postList:HTMLElement = document.getElementById("post-list") as HTMLElement;
    const ephemeral = postList.classList.contains('ephemeral');

    if (ephemeral) {
        const posts:NodeListOf<HTMLElement> = postList.querySelectorAll(".microblog-item");

        posts.forEach((post) => {
            const postDate = new Date(post.getAttribute('data-date') || '');
    
            const hoursDiff = (new Date().getTime() - postDate.getTime()) / (1000 * 3600);
            if (hoursDiff > 24) {
                post.remove();
            }
        });
    }

    postList.classList.remove('mbpl-h');
});