if(localStorage.getItem("logado") !== "true"){
window.location.href = "../login/login.html";
}

const usuario =
JSON.parse(localStorage.getItem("usuario")) || {};

const reportes =
JSON.parse(localStorage.getItem("reportes")) || [];

document.getElementById("nomeUser").innerText =
`Ola, ${usuario.nome || "usuario"}`;

function logout(){
localStorage.removeItem("logado");
window.location.href = "../pagina inicial/index.html";
}

function aplicarTema(){
const temaEscuro =
localStorage.getItem("tema") === "dark";

document.body.classList.toggle("darkmode", temaEscuro);

document.getElementById("themeBtn").innerText =
temaEscuro ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function darkMode(){
const temaEscuro =
!document.body.classList.contains("darkmode");

localStorage.setItem("tema", temaEscuro ? "dark" : "light");
aplicarTema();
}

function normalizarStatus(status){
const valor = String(status || "");
if(valor.startsWith("Em an") || valor === "Em andamento") return "Em andamento";
if(valor === "Resolvido" || valor === "Concluido") return "Concluido";
return valor || "Aberto";
}

function pertenceAoUsuario(item){
return String(item.usuario_id || "") === String(usuario.id || "") ||
String(item.usuario_nome || item.usuario || "").toLowerCase() === String(usuario.nome || "").toLowerCase();
}

function classeStatus(status){
const valor = normalizarStatus(status);
if(valor === "Em andamento") return "status-andamento";
if(valor === "Concluido") return "status-concluido";
if(valor === "Cancelado") return "status-cancelado";
return "";
}

function textoStatus(status){
const valor = normalizarStatus(status);
return {
"Aberto":"Aberto",
"Em andamento":"Em andamento",
"Cancelado":"Cancelado",
"Concluido":"Concluido"
}[valor] || valor;
}

function escapar(valor){
return String(valor || "-")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;");
}

const meusChamados =
reportes
.map((item, indice) => ({...item, indice}))
.filter(pertenceAoUsuario)
.reverse();

function renderizarLista(){
const lista = document.getElementById("listaChamados");

if(meusChamados.length === 0){
lista.innerHTML = `
<div class="empty">
Voce ainda nao abriu nenhum chamado.<br>
Quando criar um novo reporte, ele vai aparecer aqui com cor, nome e numero do ticket.
</div>
`;
return;
}

lista.innerHTML =
meusChamados.map((item, posicao)=>`
<button class="chamado-item" type="button" onclick="abrirChamado(${posicao})">
<span class="status-dot ${classeStatus(item.status)}"></span>
<span>
<span class="chamado-nome">${escapar(item.titulo || item.categoria || "Chamado")}</span>
<span class="chamado-meta">${escapar(textoStatus(item.status))} - ${escapar(item.categoria)} - ${escapar(item.dataEnvio)}</span>
</span>
<span class="ticket">${escapar(item.protocolo || `EA-${String(item.indice + 1).padStart(4,"0")}`)}</span>
</button>
`).join("");
}

function abrirChamado(posicao){
const item = meusChamados[posicao];
const detalhe = document.getElementById("detalheChamado");

detalhe.classList.add("ativo");
detalhe.innerHTML = `
<div class="detalhe-topo">
<div>
<h2>${escapar(item.titulo || "Chamado")}</h2>
<p>${escapar(item.protocolo)} - ${escapar(textoStatus(item.status))}</p>
</div>
<span class="status-dot ${classeStatus(item.status)}"></span>
</div>

<div class="detalhe-grid">
<div class="campo"><span>Categoria</span>${escapar(item.categoria)}</div>
<div class="campo"><span>Gravidade</span>${escapar(item.gravidade)}</div>
<div class="campo"><span>Cidade</span>${escapar(item.cidade)}</div>
<div class="campo"><span>Bairro</span>${escapar(item.bairro)}</div>
<div class="campo"><span>Rua / Referencia</span>${escapar(item.rua)}</div>
<div class="campo"><span>CEP</span>${escapar(item.cep)}</div>
<div class="campo"><span>Data da ocorrencia</span>${escapar(item.dataOcorrencia)}</div>
<div class="campo"><span>Hora da ocorrencia</span>${escapar(item.horaOcorrencia)}</div>
<div class="campo full"><span>GPS</span>${escapar(item.gps)}</div>
<div class="campo full"><span>Descricao</span>${escapar(item.descricao)}</div>
</div>
`;

detalhe.scrollIntoView({behavior:"smooth", block:"start"});
}

aplicarTema();
renderizarLista();
