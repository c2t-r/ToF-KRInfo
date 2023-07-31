const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
const fs = require('fs');
//const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    console.log("start");
    const response = await fetch("https://comm-api.game.naver.com/nng_main/v1/user/e5c134b920a0f5667bf50043db6d7cf7/feeds?limit=20&loungeId=TOF&offset=0&order=NEW")
        .then(response => response.json())
        .then(data => {
            let resp = JSON.stringify(data, null, '    ');
            fs.writeFileSync('output.json', resp);
            return data;
        });

    console.log("fetched!");

    const title = response.content.feeds[0].feed.title
    const imageurl = response.content.feeds[0].feed.repImageUrl

    const name = response.content.feeds[0].user.nickname
    const pfLink = `https://game.naver.com/profile/${response.content.feeds[0].user.userIdHash}/TOF#feed`
    const pfp = response.content.feeds[0].user.profileImageUrl

    const feedLink = response.content.feeds[0].feedLink.mobile

    const tag = response.content.feeds[0].board.boardName

    const thumbnail = response.content.feeds[0].lounge.logoImageSquareUrl

    //discord
    const Embed = {
        color: 0x38f4af,
        author: {
            name: name,
            url: pfLink,
            icon_url: pfp
        },
        title: title,
        url: feedLink,
        description: `タグ : ${tag}`,
        thumbnail: {
            url: thumbnail
        },
        image: {
            url: imageurl
        },
        footer: {
            icon_url: "https://raw.githubusercontent.com/c2t-r/ToF-KRInfo/main/icon.png",
            text: "@brooks_up"
        },
        timestamp: new Date()
    };

    if (response.content.feeds[0].feed.iconTypes[0] == "SNIPPET") {
        let ytlink = "https://youtu.be/" + imageurl.slice(23, 34);
        Embed.description = `タグ : ${posttag}  [YouTubeリンク](${ytlink})`
    }

    const data = {
        username: 'ToF KR info',
        avatar_url: "https://raw.githubusercontent.com/c2t-r/ToF-KRInfo/main/icon.png",
        content: '最新の投稿はこちら',
        embeds: [Embed]
    };

    const post = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    console.log(post.status);
    console.log("finish");

    process.exit(0);
})();

function hoge() {
    console.log("time out...");
    process.exit(0);
}

setTimeout(hoge, 20000);
