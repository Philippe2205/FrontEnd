import {fetchJson} from "./utils.js";

let token = localStorage.getItem("token")

//////////////////////////////////////////////////////
// Vérification Token

if (token !== null) { // 
    document.body.classList.add('loguer')
    const bandeau = document.getElementById('jsBandeau')
    bandeau.classList.add('show')
}

//////////////////////////////////////////////////////
// Logout - sortie du mode édition

const logout = document.getElementById('logout')
logout.addEventListener("click", function () {
    localStorage.removeItem("token")
    location.reload(true)
})

const logout2 = document.getElementById('logout2')
logout2.addEventListener("click", function () {
    localStorage.removeItem("token")
    location.reload(true)
})

//////////////////////////////////////////////////////
// Affichage dynamique des filtres

const elFiltres = document.getElementById("filtres")
async function refreshCategories() {
    const categories = await fetchJson("http://localhost:5678/api/categories")
    let s = `<div class="filtre" data-id="0">Tous</div>`
    categories.forEach(element => {
        s += `<div class="filtre" data-id="${element.id}">${element.name}</div>`
    });
    elFiltres.innerHTML = s
}
await refreshCategories()


async function updateModalCategory() {
    const inputFiltre = document.getElementById('Categ')
    const categories = await fetchJson("http://localhost:5678/api/categories")
    let s = `<option value="0"></option>`
    categories.forEach(element => {
        s += `<option value="${element.id}">${element.name}</option>`
    });
    inputFiltre.innerHTML = s
}

// Activation des filtres

elFiltres.addEventListener("click", async function (e){
    const idCat = parseInt (e.target.dataset.id) 
    await refreshElements(idCat)
})

//////////////////////////////////////////////////////
// Récuperation works API

let works = []
let getWorks_used = false
async function getWorks() {
    if (getWorks_used === false) {
        getWorks_used = true
        works = await fetchJson("http://localhost:5678/api/works")
    }
    return works
}

//////////////////////////////////////////////////////
// Affichage dynamique des projets

async function refreshElements(idCat = 0) {
    let works2 = await getWorks()
    let workFiltre = works2
    if (idCat !== 0){
        workFiltre = works2.filter(function (work) {
            return work.categoryId === idCat;
        })
        
    }
    const elGalleri = document.getElementById("galleri")
    let s = ``
    workFiltre.forEach(element => {
        s += `<figure>
        <img src="${element.imageUrl}" alt="${element.title}">
        <figcaption>${element.title}</figcaption>
        </figure>`
    });
    elGalleri.innerHTML = s 
}
await refreshElements()


async function projetModalRefresh() {
    
    const grille = document.getElementById('addProjet')
    
    let works2 = await getWorks()
    let workFiltre = works2 
    let s = ``
    workFiltre.forEach(element => {
        s += `<figure>
        <img src="${element.imageUrl}" alt="${element.title}">
        <figcaption>éditer</figcaption>
        <i class="fa-solid fa-trash-can" id="${element.id}"></i>
        </figure>`
    });
    grille.innerHTML = s 
}
await projetModalRefresh()

//////////////////////////////////////////////////////
// Suppression de projet présent sur l'API

const gridBeen = document.getElementById('addProjet')
gridBeen.addEventListener('mouseover', function () {

    const been = document.querySelectorAll('.fa-trash-can').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();

            fetch(`http://localhost:5678/api/works/${item.id}`,{
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(async function () {
                getWorks_used = false
                await projetModalRefresh();
                await refreshElements();
            })

        })
    })


})
    
//////////////////////////////////////////////////////
// Activation des differents bouton

const boutonMod = document.getElementById('jsBoutonMod')
boutonMod.addEventListener("click", async function () {
    const modal = document.getElementById('modal1')
    modal.classList.add('modal')
    const overlay = document.getElementById('jsoverlay')
    overlay.classList.add('show')
    await projetModalRefresh()
})


const fermer = document.getElementById('fermer1')
fermer.addEventListener('click', async function () {
    const modal = document.getElementById('modal1')
    modal.classList.remove('modal')
    const modal2 = document.getElementById('modal2')
    modal2.classList.remove('modal')
    const overlay = document.getElementById('jsoverlay')
    overlay.classList.remove('show')
    await refreshElements()
})


const ajoutPhoto = document.getElementById('jsAjoutPhoto')
ajoutPhoto.addEventListener('click', async function () {
    const modal = document.getElementById('modal1')
    modal.classList.remove('modal')
    const modal2 = document.getElementById('modal2')
    modal2.classList.add('modal')
    await updateModalCategory()
})


const fermer2 = document.getElementById('fermer2')
fermer2.addEventListener('click', async function () {
    const modal2 = document.getElementById('modal2')
    modal2.classList.remove('modal')
    const overlay = document.getElementById('jsoverlay')
    overlay.classList.remove('show')
})


const retour = document.getElementById('retour')
retour.addEventListener('click', function () {
    const modal2 = document.getElementById('modal2')
    modal2.classList.remove('modal')
    const modal = document.getElementById('modal1')
    modal.classList.add('modal')
})


const boutonOk = document.getElementById('jsButMiniModal')
boutonOk.addEventListener('click', function () {
    const miniModal = document.getElementById('miniModal')
    miniModal.classList.remove('modalMini')
    const overlay = document.getElementById('jsoverlay')
    overlay.classList.remove('show')
})


const overlay = document.getElementById('jsoverlay')
overlay.addEventListener('click', function () {
    const modal = document.getElementById('modal1')
    modal.classList.remove('modal')
    const modal2 = document.getElementById('modal2')
    modal2.classList.remove('modal')
    const overlay = document.getElementById('jsoverlay')
    overlay.classList.remove('show')
    const miniModal = document.getElementById('miniModal')
    miniModal.classList.remove('modalMini')

})

//////////////////////////////////////////////////////
// Envoie d'un nouveau projet a l'API

const valider = document.getElementById('jsFormModif')
valider.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(valider)
    const image = formData.get("image")
    const title = formData.get("title")
    const category = formData.get("category")

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { 
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
    .then(async function (response) {
        // GetWorks puis GenererWorks pour mettre à jour les données sur la modale et la gallery
        getWorks_used = false
        await refreshElements()

        const modal2 = document.getElementById('modal2')
        modal2.classList.remove('modal')
        const miniModal = document.getElementById('miniModal')
        miniModal.classList.add('modalMini')
        
        
    })
    if ((image.size == 0) || (title.length == 0) || (category == 0)) {
        const erreur = document.getElementById('erreur')
        const succes = document.getElementById('succes')
        erreur.classList.add('show')
        succes.classList.remove('show')
    }
    else {
        erreur.classList.remove('show')
        succes.classList.add('show')
    }
    

})

//////////////////////////////////////////////////////
// Prévisualisation de l'image input file 

const inputFile = document.getElementById('jsPngProjet')
inputFile.addEventListener('change', function () {
    console.log(inputFile.files[0]);

    const photo = inputFile.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add("uploaded-photo");
      const cadrePhoto = document.querySelector('.cadrePhoto')
      cadrePhoto.appendChild(img);
    };
    reader.readAsDataURL(photo);
    const icons = document.querySelector('.fa-images')
    icons.classList.add('d-none')
    const ajPhoto = document.querySelector('.boutonPlus')
    ajPhoto.classList.add('d-none')
    const textCadre = document.querySelector('.textCadre')
    textCadre.classList.add('d-none')
})
