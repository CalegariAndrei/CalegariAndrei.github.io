var tenthRoll=0;

function appendToHistory(card, imgsrc)
{
    if (card.rank >= 4)
    {
        var selector = "#" + (card.type=="servant" ? "servant" : "craft_essence")
                        + "_" + (card.rank==4 ? "sr" : "ssr") + "_list";
        var content = "<img src='" + imgsrc + "' />";
        $(selector).append(content);
    }
}

function drawOnce(card)
{
	tenthRoll++;
	if(tenthRoll==9){
		tenthRoll=0;
		const el = document.getElementsByClassName("btn-draw-once")[0];
		el.classList.remove("btn-draw-once");
		el.classList.add("btn-draw-twice");
	}
	
    var c = $("canvas#cards-canvas")[0];
    var ctx = c.getContext("2d");
    ctx.drawImage(imgBg, 0, 0);

    var img = new Image();
    var type = card.type=="servant" ? "servant" : "equip";
    img.src = (card.type=="servant") ? 
        "/img/icons/servant_" + parseInt(card.id) + ".png" :
        "/img/icons/equip_" + parseInt(card.id) + ".png";

    img.onload = function(){
        ctx.drawImage(img, 450, 220);
    };

    appendToHistory(card, img.src);
}

function drawCombo(card, x, y)
{
    var c = $("canvas#cards-canvas")[0];
    var ctx = c.getContext("2d");
    ctx.drawImage(imgBg, 0, 0);

    var img = new Image();
    img.src = (card.type=="servant") ? 
        "/img/icons/servant_" + parseInt(card.id) + ".png" :
        "/img/icons/equip_" + parseInt(card.id) + ".png";

    img.onload = function(){
        ctx.drawImage(img, 80 + x * 142, 140 + y * 172);
    };

    appendToHistory(card, img.src);
}


