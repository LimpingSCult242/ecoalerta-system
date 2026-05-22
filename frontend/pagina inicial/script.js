window.onload = ()=>{
setTimeout(()=>{
document.getElementById("loader").style.display="none";
},1200);
}

function aplicarTema(){
const temaEscuro = localStorage.getItem("tema") === "dark";
document.body.classList.toggle("darkmode", temaEscuro);
document.getElementById("themeBtn").innerText = temaEscuro ? "☀️" : "🌙";
}

function darkMode(){
const temaEscuro = !document.body.classList.contains("darkmode");
localStorage.setItem("tema", temaEscuro ? "dark" : "light");
aplicarTema();
}

aplicarTema();