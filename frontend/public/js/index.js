// Seleccion de elementos del dom
const generateBTN = document.querySelector("#btn-generate");
const avatarBox = document.querySelector("#avatar-box");
const loading = document.querySelector("#loading");
const form = document.querySelector("#form");
const contenedor = document.querySelector("#container");

loading.style.display= "none";

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const formValues = new FormData(e.currentTarget);
    const category = formValues.get("category");
    if (!category) {
        errores("ERROR NO ESCOGISTE NADA");
    }
    // Mostrar un efecto de carga
    loading.style.display= "block";

    //Peticion al backend
    try {
        const peticion = await fetch("http://localhost:3000/api/gen-img",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({category})
        });
        let data = await peticion.json();
        console.log(data)
        if(data && data.imgURL){
            const img = document.createElement("img")
            img.src = data.imgURL;
            img.alt = "Imagen generada con IA";
            avatarBox.appendChild(img);
        }else{
            throw new Error("Error al crear la imagen");
        }
    } catch (error) {
        errores("Error al crear la imagen");
    } finally{
        loading.style.display= "none";
    }
    
});
function errores(texto){
    const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.innerHTML = `<p>${texto}</p>`;
        contenedor.appendChild(errorDiv);
    
        setTimeout(() => {
            errorDiv.remove();
        }, 2000);
}