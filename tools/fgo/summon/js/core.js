var useRandomOrgApi = false;

// 获取0-1之间的实数
function getRandom(useRandomOrg)
{
    var randReal = 0;
    if (useRandomOrg)
    {
        var randInteger = 0;
        var randMax = 999999999;
        $.ajax({
            type: "GET",
            url: "https://www.random.org/integers/?num=1&min=0&max=999999999&col=1&base=10&format=plain&rnd=new",
            dataType: "text",
            async: false,
            success: function(data, textStatus){
                randInteger = parseInt(data);
            }
        });
        randReal = randInteger / randMax;
    }
    else
    {
        randReal = Math.random();
    }
    return randReal;
}

function summonFromPool(upcards, nmcards, type, rank, rand)
{
    var card = new Object();
    card.type = type;
    card.rank = rank;
    card.id = null;

    if (rand < 0)
    {
        rand = getRandom(useRandomOrgApi);
    }

    var counter = 0;
    for (var i=0; i<upcards.length; i++)
    {
        var upcard_info = upcards[i];
        counter += upcard_info.rate;
        if (rand < counter)
        {
            card.id = upcard_info.id;
            break;
        }
    }

    if (card.id == null)
    {
        card.id = nmcards[Math.floor(getRandom(useRandomOrgApi)*nmcards.length)];
    }

    return card;
}

function summon(pool)
{
    var rand = getRandom(useRandomOrgApi);
    var card = new Object();
    if (rand >= 0.99)
    {
        // SSR servant 1%
        var r = (rand - 0.99) / 0.01;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
    else if (rand >= 0.95 && rand < 0.99)
    {
        // SSR Craft Essence 4%
        var r = (rand - 0.95) / 0.04;
        var upcards = pool.craft_essence_ssr_up;
        var nmcards = pool.craft_essence_ssr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 5, r);
    }
    else if (rand >= 0.92 && rand < 0.95)
    {
        // SR servant 3%
        var r = (rand - 0.95) / 0.03;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }
    else if (rand >= 0.8 && rand < 0.92)
    {
        // SR Craft Essence 12%
        var r = (rand - 0.8) / 0.12;
        var upcards = pool.craft_essence_sr_up;
        var nmcards = pool.craft_essence_sr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 4, r);
    }
    else if (rand >= 0.4 && rand < 0.8)
    {
        // R servant 40%
        var r = (rand - 0.4) / 0.4;
        var upcards = pool.servant_r_up;
        var nmcards = pool.servant_r;
        card = summonFromPool(upcards, nmcards, "servant", 3, r);
    }
    else
    {
        // R Craft Essence 40%
        var r = rand / 0.4;
        var upcards = pool.craft_essence_r_up;
        var nmcards = pool.craft_essence_r;
        card = summonFromPool(upcards, nmcards, "craft_essence", 3, r);
    }
    return card;
}

// 抽取保底金卡
function summmonGolden(pool)
{
    var rand = getRandom(useRandomOrgApi);
    var card = new Object();

    if (rand >= 0.95)
    {
        // SSR servant 1 (5%)
        var r = (rand - 0.95) / 0.05;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
    else if (rand >= 0.75 && rand < 0.95)
    {
        // SSR Craft Essence 4 (20%)
        var r = (rand - 0.75) / 0.2;
        var upcards = pool.craft_essence_ssr_up;
        var nmcards = pool.craft_essence_ssr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 5, r);
    }
    else if (rand >= 0.60 && rand < 0.75)
    {
        // SR servant 3 (15%)
        var r = (rand - 0.6) / 0.15;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }
    else
    {
        // SR Craft Essence 12 (60%)
        var r = rand / 0.6;
        var upcards = pool.craft_essence_sr_up;
        var nmcards = pool.craft_essence_sr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 4, r);
    }

    return card;
}

// 保底从者
function summmonServants(pool)
{
    var rand = getRandom(useRandomOrgApi);

    var card = new Object();

    // SSR 1
    var ssr_rate = 1.0 / 44;
    var ssr_threshold = 1 - ssr_rate;
    // SR 3
    var sr_rate = 3.0 / 44;
    var sr_threshold = ssr_threshold - sr_rate;
    // R 40
    var r_rate = 40.0 / 44;
    var r_threshold = sr_threshold - r_rate;

    if (rand >= ssr_threshold)
    {
        // SSR
        var r = (rand - ssr_threshold) / ssr_rate;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
    else if (rand >= sr_threshold && rand < ssr_threshold)
    {
        // SR 
        var r = (rand - sr_threshold) / sr_rate;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }
    else
    {
        // R 
        var r = rand / r_rate;
        var upcards = pool.servant_r_up;
        var nmcards = pool.servant_r;
        card = summonFromPool(upcards, nmcards, "servant", 3, r);
    }

    return card;
}

function statRankOfCards(cards, rank)
{
    var counter = 0;
    for (var i=0; i<cards.length; i++)
    {
        var card = cards[i];
        if (card.rank == rank)
        {
            counter++;
        }
    }
    return counter;
}

function statTypeOfCards(cards, type)
{
    var counter = 0;
    for (var i=0; i<cards.length; i++)
    {
        var card = cards[i];
        if (card.type == type)
        {
            counter++;
        }
    }
    return counter;
}

function shuffle(cards)
{
    var shuffled = new Array();
    while(cards.length > 0)
    {
        var index = parseInt(Math.random() * cards.length);
        shuffled.push(cards[index]);
        cards.splice(index, 1);
    }
    return shuffled;
}

function summon10combo(pool)
{
    var cards = new Array();

    for (var i=0; i<9; i++)
    {
        var card = summon(pool);
        cards.push(card);
    }

    if (statRankOfCards(cards, 3) == 9)
    {
        var card = summmonGolden(pool);
        cards.push(card);
    }
    else
    {
        var card = summon(pool);
        cards.push(card);
    }

    if (statTypeOfCards(cards, 'craft_essence') == 10)
    {
        var card = summmonServants(pool);
        cards.push(card);
    }
    else
    {
        var card = summon(pool);
        cards.push(card);
    }

    return shuffle(cards);
}

function summon2(pool)
{
    var cards = new Array();

    for (var i=0; i<2; i++)
    {
        var card = summon(pool);
        cards.push(card);
    }

    return shuffle(cards);
}

//获取鼠标坐标
function mousePosition(ev){ 
    ev = ev || window.event; 
    if(ev.pageX || ev.pageY){ 
        return {x:ev.pageX, y:ev.pageY}; 
    } 
    return { 
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
        y:ev.clientY + document.body.scrollTop - document.body.clientTop 
    }; 
}
