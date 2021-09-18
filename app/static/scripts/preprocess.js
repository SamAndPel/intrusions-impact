// Preprocesses cards from cardmaster and renders them onto the page

function preprocess(masterdata) {
    const cardroot = document.getElementById("unstageddeck");
    const overlayroot = document.getElementById("overlays");
    const modalroot = document.getElementById("cardmodals");

    Object.values(masterdata).forEach(card => {
        // Preprocess card display
        const cardelement = document.createElement("div");
        cardelement.id = "card" + card.id;
        cardelement.classList.add("card");
        if (card.prerequisite != -1) {
            cardelement.classList.add("unplayable");
        }
        cardelement.setAttribute("onclick", "showmodal(" + card.id + ")");
        cardelement.draggable = "true";
        cardelement.setAttribute("ondragstart", "dragStart(event)");
        cardelement.setAttribute("ondragend", "dragStop(event)");

        const cardtitle = document.createElement("p");
        cardtitle.classList.add("card-title");
        const cardtitletext = document.createTextNode(card.name);
        cardtitle.appendChild(cardtitletext);
        cardelement.appendChild(cardtitle);

        const cardimg = document.createElement("img");
        cardimg.classList.add("card-image");
        cardimg.src = "static/images/cards/" + card.image;
        cardimg.alt = "Image of " + card.name;
        cardelement.appendChild(cardimg);

        const cardcost = document.createElement("p");
        cardcost.classList.add("card-cost");
        const cardcosttext = document.createTextNode(moneyformat(card.cost));
        cardcost.appendChild(cardcosttext);
        cardelement.appendChild(cardcost);
        
        cardroot.appendChild(cardelement);


        // Preprocess gameboard display
        const graphicelement = document.createElement("img");
        graphicelement.classList.add("overlayimage");
        graphicelement.src = "static/images/board/" + card.graphic;
        graphicelement.id = "card" + card.id + "graphic";
        graphicelement.alt = "Graphics overlay for " + card.name;

        overlayroot.appendChild(graphicelement);


        // Preprocess modal display
        const modalelement = document.createElement("div");
        modalelement.id = "card" + card.id + "modal";
        modalelement.classList.add("modal");
        modalelement.classList.add("cardmodal")
        const modalcontent = document.createElement("div");
        modalcontent.classList.add("cardmodalcontent");

        const modaltitle = document.createElement("p");
        modaltitle.classList.add("big-card-title");
        const modaltitletext = document.createTextNode(card.name);
        modaltitle.appendChild(modaltitletext);
        modalcontent.appendChild(modaltitle);

        const modalimg = document.createElement("img");
        modalimg.classList.add("big-card-image");
        modalimg.src = "static/images/cards/" + card.image;
        modalimg.alt = "Large image of " + card.name;
        modalcontent.appendChild(modalimg);

        const modalcost = document.createElement("p");
        modalcost.classList.add("big-card-cost");
        const modalcosttext = document.createTextNode(moneyformat(card.cost));
        modalcost.appendChild(modalcosttext);
        modalcontent.appendChild(modalcost);

        const modalshortdesc = document.createElement("p");
        modalshortdesc.classList.add("big-card-shortdesc");
        const modalshortdesctext = document.createTextNode(card.shortdesc);
        modalshortdesc.appendChild(modalshortdesctext);
        modalcontent.appendChild(modalshortdesc);

        const modallongdesc = document.createElement("p");
        modallongdesc.classList.add("big-card-longdesc");
        const modallongdesctext = document.createTextNode(card.longdesc);
        modallongdesc.appendChild(modallongdesctext);
        modalcontent.appendChild(modallongdesc);

        const linkspace = document.createElement("div");
        linkspace.classList.add("modallinkspace");

        const modaloutlink = document.createElement("a");
        modaloutlink.classList.add("modallink");
        modaloutlink.href = card.outlink;
        modaloutlink.target = "_blank";
        const modaloutlinktext = document.createTextNode("More info");
        modaloutlink.appendChild(modaloutlinktext);
        linkspace.appendChild(modaloutlink);

        const modaltogglestage = document.createElement("p");
        modaltogglestage.classList.add("modallink");
        modaltogglestage.classList.add("togglestage");
        modaltogglestage.setAttribute("onclick", "togglestage(" + card.id + ")");
        const modaltogglestagetext = document.createTextNode("Play card");
        modaltogglestage.appendChild(modaltogglestagetext);
        linkspace.appendChild(modaltogglestage);

        modalcontent.appendChild(linkspace);
        modalelement.appendChild(modalcontent);
        modalroot.appendChild(modalelement);
    });
}