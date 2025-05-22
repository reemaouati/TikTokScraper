// ==UserScript==
// @name         TikToker - TikTok Scraper
// @namespace    https://github.com/reemaouati
// @version      0.1
// @description  Scrapes TikTok user info by username.
// @author       Reem Aouati
// @match        https://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Prompt for TikTok username
    const username = prompt("Enter TikTok username:");

    if (!username) {
        alert("TikTok Scraper: No username provided.");
        return;
    }

    const url = `https://www.tiktok.com/@${username}?isUniqueId=true&isSecured=true`;

    fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': navigator.userAgent
        }
    })
        .then(response => response.text())
        .then(html => {
            const extract = (regex) => {
                const match = html.match(regex);
                return match ? match[1] : 'Not Found';
            };

            const data = {
                id: extract(/"id":"(\d+)"/),
                uniqueId: extract(/"uniqueId":"([^"]+)"/),
                nickname: extract(/"nickname":"([^"]+)"/),
                avatar: extract(/"avatarLarger":"([^"]+)"/),
                signature: extract(/"signature":"([^"]*)"/),
                private: extract(/"privateAccount":(true|false)/),
                verified: extract(/"secret":(true|false)/),
                language: extract(/"language":"([^"]+)"/),
                region: (() => {
                    const matches = [...html.matchAll(/"region":"([^"]+)"/g)];
                    return matches[1] ? matches[1][1] : 'Not Found';
                })(),
                followerCount: extract(/"followerCount":(\d+)/),
                followingCount: extract(/"followingCount":(\d+)/),
                likes: extract(/"heartCount":(\d+)/),
                videos: extract(/"videoCount":(\d+)/),
            };

            const output = `
ID: ${data.id}
Username: ${data.uniqueId}
Nickname: ${data.nickname}
Bio: ${data.signature}

Private Account: ${data.private}
Verified Badge: ${data.verified}
Language: ${data.language}
Region: ${data.region}

Followers: ${data.followerCount}
Following: ${data.followingCount}
Likes: ${data.likes}
Videos: ${data.videos}

Avatar: ${data.avatar}
            `.trim();

            alert(output);
        })
        .catch(error => {
            alert("TikTok Scraper: Failed to fetch or parse user data.");
            console.error(error);
        });
})();
