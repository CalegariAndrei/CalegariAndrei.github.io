var servants = JSON.parse(servantList);
var contS;
var contA;
var contB;
var contC;
var contD;
var contE;
var contF;
var contInitial;

window.onload = init;

function init() {
    contS = document.getElementById('contS');
    contA = document.getElementById('contA');
    contB = document.getElementById('contB');
    contC = document.getElementById('contC');
    contD = document.getElementById('contD');
    contE = document.getElementById('contE');
    contF = document.getElementById('contF');
    contInitial = document.getElementById('contInitial');

    servants.forEach(servants => {
        contInitial.appendChild(createServantNode(servants));
    });

    document.querySelectorAll('.container').forEach(container => {
        container.ondragover = function(ev) {
            ev.preventDefault();
        }
        container.ondrop = function(ev) {
            ev.preventDefault();
            let servants = JSON.parse(ev.dataTransfer.getData('servants'));
            let prevParentId = ev.dataTransfer.getData('prevParentId');

            if (container.id != prevParentId) {
                container.appendChild(createServantNode(servants));
                removeServant(document.getElementById(prevParentId), servants.id);
            }
        }
    });
	
	rarity["0"] = document.getElementById('rarity0');
	rarity["1"] = document.getElementById('rarity1');
	rarity["2"] = document.getElementById('rarity2');
	rarity["3"] = document.getElementById('rarity3');
	rarity["4"] = document.getElementById('rarity4');
	rarity["5"] = document.getElementById('rarity5');
	
	classes["beast"] = document.getElementById('beast');
	classes["shielder"] = document.getElementById('shielder');
	classes["saber"] = document.getElementById('saber');
	classes["archer"] = document.getElementById('archer');
	classes["lancer"] = document.getElementById('lancer');
	classes["rider"] = document.getElementById('rider');
	classes["caster"] = document.getElementById('caster');
	classes["assassin"] = document.getElementById('assassin');
	classes["berserker"] = document.getElementById('berserker');
	classes["ruler"] = document.getElementById('ruler');
	classes["avenger"] = document.getElementById('avenger');
	classes["moonCancer"] = document.getElementById('mooncancer');
	classes["foreigner"] = document.getElementById('foreigner');
	classes["alterEgo"] = document.getElementById('alterego');
	classes["pretender"] = document.getElementById('pretender');
	
	
	filter();
}

var stop = true;

function createServantNode(servants) {
    let node = document.createElement('div');
    let img = document.createElement('div');
	node.id = servants.id;
	node.setAttribute("rarity", servants.rarity);
	node.setAttribute("servantClass", servants.class);
	node.setAttribute("attribute", servants.attribute);
	
	
    img.style.backgroundImage = `url('${servants.img}')`;

    node.classList.add('servants');
    node.appendChild(img);
    node.draggable = 'true';
    node.ondragstart = (e)=>{
        e.dataTransfer.setData('servants', JSON.stringify(servants));
        e.dataTransfer.setData('prevParentId', node.parentElement.id);
    }
	node.ondrag = (e)=> {
		stop = true;

		if (e.clientY < 150) {
			stop = false;
			scroll(-1)
		}

		if (e.clientY > (window.innerHeight - 150)) {
			stop = false;
			scroll(1)
		}
	}
	node.ondragend = (e)=> {
		stop = true;
	}

    return node;
}

function removeServant(container, servantsId) {
    let servantsNodes = container.childNodes;

    servantsNodes.forEach(node => {
        if (node.id == servantsId) {
            node.remove();
        }
    });
}

const rarity = {};
const classes = {};
function filter(){
	let servs = document.querySelectorAll('.servants');
	for (var i = 0; i < servs.length; i++) {
		servant = servs.item(i);
		switch(true) { 
			case (servant.getAttribute("servantClass")=="grandCaster"):
			case (servant.id=="152"):
			case (!rarity[servant.getAttribute("rarity")].checked):
			case (servant.getAttribute("attribute")=="beast" && !classes["beast"].checked):
			case (servant.getAttribute("attribute")!="beast" && !classes[servant.getAttribute("servantClass")].checked):
				servant.style.display = "none";
				break;
			default: 
				servant.style.display = "inline-block";
				break;
		}
	}
}