
const formulaireLogin = document.querySelector(".form-login")
formulaireLogin.addEventListener("submit", function(event){
    event.preventDefault();

    const data = {
        email: document.getElementById("e-mail").value,
        password: document.getElementById("password").value,
    }
    
    console.log(data);
    // envoie des identifant et mot de passe au serveur 
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((response) => response.json()) // récuperation de la réponse serveur 
    .then((data) => {    // contenue de la réponse 
        console.log(data);
        const token = data.token
        
        if (data.userId === 1) {
            localStorage.setItem('token', token)
            document.location.href="http://127.0.0.1:5500/index.html"
            console.log(token);
        }
        else {
            const messagErreur = document.getElementById("errormessage")
            let p = '<p>Identifiant ou mot de passe incorrect</p>'
            messagErreur.innerHTML = p
            console.log("ERROR");
        }
    })
})
