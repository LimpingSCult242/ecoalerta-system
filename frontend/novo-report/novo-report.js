function aplicarTema(){

let temaEscuro =
localStorage.getItem("tema") === "dark";

document.body.classList.toggle("darkmode", temaEscuro);

let botaoTema =
document.getElementById("themeBtn");

if(botaoTema){
botaoTema.innerText =
temaEscuro ? "☀️ Light Mode" : "🌙 Dark Mode";
}

}

function darkMode(){

let temaEscuro =
!document.body.classList.contains("darkmode");

localStorage.setItem(
"tema",
temaEscuro ? "dark" : "light"
);

aplicarTema();

}

aplicarTema();

/* LOGIN */
if(localStorage.getItem("logado") !== "true"){
window.location.href = "../login/login.html";
}

const usuario =
JSON.parse(localStorage.getItem("usuario"));

document.getElementById("nomeUser").innerText =
`Olá, ${usuario.nome}`;

/* SAIR */
function sair(){
localStorage.removeItem("logado");
window.location.href = "../pagina inicial/index.html";
}

function logout(){
sair();
}

/* LOCALIZACAO */
function pegarLocalizacao(){

navigator.geolocation.getCurrentPosition((pos)=>{

const lat = pos.coords.latitude.toFixed(5);
const lon = pos.coords.longitude.toFixed(5);

document.getElementById("coords").value =
`Lat: ${lat} | Lon: ${lon}`;

},()=>{
alert("Não foi possível obter localização.");
});

}

async function buscarLocalizacaoPorEndereco(){
const cidade = document.getElementById("cidade").value.trim();
const bairro = document.getElementById("bairro").value.trim();
const rua = document.getElementById("rua").value.trim();
const cep = document.getElementById("cep").value.trim();
const partesEndereco = [rua, bairro, cidade, cep, "Brasil"].filter(Boolean);

if(partesEndereco.length < 3){
alert("Preencha pelo menos cidade e bairro. Se tiver rua ou CEP, fica mais preciso.");
return;
}

try{
const busca = encodeURIComponent(partesEndereco.join(", "));
const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${busca}&limit=1`);
const resultado = await resposta.json();

if(resultado.length === 0){
alert("Não encontrei esse endereço. Confira cidade, bairro, rua ou CEP.");
return;
}

const lat = Number(resultado[0].lat).toFixed(5);
const lon = Number(resultado[0].lon).toFixed(5);

document.getElementById("coords").value =
`Lat: ${lat} | Lon: ${lon}`;
}catch(e){
alert("Não foi possível buscar a localização pelo endereço agora.");
}
}

/* FOTO PREVIEW */
document.getElementById("foto")
.addEventListener("change",(e)=>{

const file = e.target.files[0];
const preview =
document.getElementById("preview");

if(file){
preview.src =
URL.createObjectURL(file);

preview.style.display = "block";
}

});

/* ENVIAR */
document.getElementById("formReporte")
.addEventListener("submit",(e)=>{

e.preventDefault();

let reportes =
JSON.parse(localStorage.getItem("reportes")) || [];

/* protocolo */
const numero = reportes.length + 1;

const protocolo =
"EA-" + numero.toString().padStart(4,"0");

/* novo reporte */
const novo = {

protocolo: protocolo,
usuario: usuario.nome,
usuario_id: usuario.id,
usuario_nome: usuario.nome,
titulo: document.getElementById("titulo").value,
categoria: document.getElementById("categoria").value,
gravidade: document.getElementById("gravidade").value,
descricao: document.getElementById("descricao").value,
cidade: document.getElementById("cidade").value,
bairro: document.getElementById("bairro").value,
rua: document.getElementById("rua").value,
cep: document.getElementById("cep").value,
gps: document.getElementById("coords").value,
dataOcorrencia:
document.getElementById("dataOcorrencia").value,
horaOcorrencia:
document.getElementById("horaOcorrencia").value,
status:"Aberto",
dataEnvio:
new Date().toLocaleDateString("pt-BR")

};

reportes.push(novo);

localStorage.setItem(
"reportes",
JSON.stringify(reportes)
);

document.getElementById("msg").innerHTML =
`Reporte enviado com sucesso!<br>
Protocolo: <b>${protocolo}</b><br>
Status: Aberto`;

document.getElementById("formReporte").reset();

document.getElementById("preview").style.display =
"none";

setTimeout(()=>{
window.location.href="../../dashboard/dashboard.html";
},1200);

});

function toast(msg){
let t=document.getElementById("toast");
t.innerText=msg;
t.style.display="block";

setTimeout(()=>{
t.style.display="none";
},2500);
}
