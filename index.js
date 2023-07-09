const puppeteer = require('puppeteer')
const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
const fs = require('fs');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    console.log("start");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto("https://game.naver.com/profile/e5c134b920a0f5667bf50043db6d7cf7/TOF#feed");
    await sleep(5000);

    await page.screenshot({ path: 'Screenshot.png', fullPage: false });

    // latest post url
    let latest = await page.$("#root > div > div > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > ul  > li > div > div");
    element = await (await latest.getProperty('innerHTML')).jsonValue();
    let imageurl = element.slice((element.indexOf("https://")), (element.indexOf("&quot;);")));
    imageurl = imageurl.replace("?type=w650", "");
    console.log(imageurl);

    //latest post title
    let postdetail = await page.$("#root > div > div > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > ul  > li > div > div > div:nth-child(2) > div");
    let posttitle_result = await postdetail.$("strong");
    let posttitle = await (await posttitle_result.getProperty('textContent')).jsonValue();
    let posttag_result = await postdetail.$("em");
    let posttag = await (await posttag_result.getProperty('textContent')).jsonValue();
    posttag = posttag.replace("공지사항", "お知らせ").replace("일러스트", "イラスト").replace("네 컷 만화", "4コマ漫画").replace("게임 가이드", "ゲームガイド").replace("유튜브 영상", "YouTube");

    browser.close();
    console.log('Took!');

    //discord
    const Embed = {
        color: 0x38f4af,
        author: {
            name: "CM미아",
            url: "https://game.naver.com/profile/e5c134b920a0f5667bf50043db6d7cf7/TOF#feed",
            icon_url: "https://nng-phinf.pstatic.net/MjAyMjA2MjFfMTQ5/MDAxNjU1NzgyNzcwMjgw.iMsMdQv2MbPoKTE0FQVT83xTM9aNgsp36dH8J4U0wcsg.xQwX5rGu_OungiGQ_vNzAykLWHXOP5EF_XFAJM0NYNAg.JPEG/%E6%AC%A2%E8%BF%8E%E8%AF%8D%E5%A4%B4%E5%83%8F.jpg"
        },
        title: posttitle,
        url: "https://game.naver.com/profile/e5c134b920a0f5667bf50043db6d7cf7/TOF#feed",
        description: `タグ : ${posttag}`,
        thumbnail: {
            url: "https://nng-phinf.pstatic.net/MjAyMjEwMjBfMTcy/MDAxNjY2MjI0MjQ5NTU5.dJYNKzFrCDItTYZzeg44AjjDLaqf98YqAQe6Wu2cQs4g.e8U8L2ecHXQff0vTbnB6ncJWZtJ2plMk2Ae3FRzTbSEg.PNG/300300.png"
        },
        image: {
            url: imageurl
        },
        footer: {
            icon_url: "https://cdn.discordapp.com/app-icons/887607844281667584/b97035c621a1ca6d3723d0d6864a379e.png",
            text: "@brooks_up"
        },
        timestamp: new Date()
    };

    var uri = new URL(imageurl);
    if (uri.hostname == "i.ytimg.com") {
        let ytlink = "https://youtu.be/" + imageurl.slice(23, 34);
        Embed.description = `タグ : ${posttag}  [YouTubeリンク](${ytlink})`
    }

    const data = {
        username: 'ToF KR info',
        avatar_url: "https://raw.githubusercontent.com/c2t-r/ToF-KRInfo/main/icon.png",
        content: '最新の投稿はこちら',
        embeds: [Embed]
    };

    let json_data = JSON.stringify(data, null, '    ');
    fs.writeFileSync('output_embed.json', json_data);

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    console.log(response.status);

    process.exit(0);
})();

function hoge(){
  console.log("time out...");
  process.exit(0);
}

setTimeout(hoge, 20000);
