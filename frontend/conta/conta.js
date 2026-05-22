
/* LOGIN */
if(localStorage.getItem("logado") !== "true"){
window.location.href="../login/login.html";
}

let usuario =
JSON.parse(localStorage.getItem("usuario"));

let reportes =
JSON.parse(localStorage.getItem("reportes")) || [];

function nomePerfil(role){
if(role === "admin") return "Administrador";
if(role === "vice-lider") return "Vice-lider";
return "Usuario";
}

function escaparValor(valor){
return String(valor || "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;");
}

function pertenceAoUsuario(reporte){
return String(reporte.usuario_id || "") === String(usuario.id || "") ||
String(reporte.usuario_nome || reporte.usuario || "").toLowerCase() === String(usuario.nome || "").toLowerCase();
}

function statusConcluido(status){
return status === "Resolvido" || status === "Concluido";
}

/* LOAD */
function carregar(){

document.getElementById("nome").value =
usuario.nome || "";

document.getElementById("email").value =
usuario.email || "";

document.getElementById("telefone").value =
usuario.telefone || "";

document.getElementById("cidade").value =
usuario.cidade || "";

document.getElementById("topUser").innerHTML =
`Ola, ${escaparValor(usuario.nome)}<small>${nomePerfil(usuario.role)}</small>`;

document.getElementById("avatar").innerText =
usuario.nome.charAt(0).toUpperCase();

let meus =
reportes.filter(pertenceAoUsuario);

document.getElementById("total").innerText =
meus.length;

document.getElementById("resolvidos").innerText =
meus.filter(r=>statusConcluido(r.status)).length;

document.getElementById("pendentes").innerText =
meus.filter(r=>!statusConcluido(r.status)).length;

}

carregar();

/* SALVAR */
function salvar(){

let emailAntigo =
(usuario.email || "").toLowerCase();

let nome =
document.getElementById("nome").value.trim();

let email =
document.getElementById("email").value.trim().toLowerCase();

let telefone =
document.getElementById("telefone").value.trim();

let cidade =
document.getElementById("cidade").value.trim();

let senhaAtual =
document.getElementById("senhaAtual").value.trim();

let novaSenha =
document.getElementById("novaSenha").value.trim();

let confirmar =
document.getElementById("confirmarSenha").value.trim();

if(nome=="" || email==""){
alert("Preencha nome e email.");
return;
}

let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];

let outroUsuario =
usuarios.find(u =>
u.email &&
String(u.email).toLowerCase() === email &&
u.id !== usuario.id &&
String(u.email).toLowerCase() !== emailAntigo
);

if(outroUsuario){
alert("Este email ja esta cadastrado.");
return;
}

usuario.nome = nome;
usuario.email = email;
usuario.telefone = telefone;
usuario.cidade = cidade;

/* troca senha */
if(
senhaAtual!="" ||
novaSenha!="" ||
confirmar!=""
){

if(senhaAtual !== usuario.senha){
alert("Senha atual incorreta.");
return;
}

if(novaSenha.length < 4){
alert("Senha muito curta.");
return;
}

if(novaSenha !== confirmar){
alert("Senhas nao coincidem.");
return;
}

usuario.senha = novaSenha;

}

localStorage.setItem(
"usuario",
JSON.stringify(usuario)
);

usuarios =
usuarios.map(u => {
if(u.id === usuario.id || (u.email && String(u.email).toLowerCase() === emailAntigo)){
return usuario;
}

return u;
});

localStorage.setItem(
"usuarios",
JSON.stringify(usuarios)
);

document.getElementById("msg").innerText =
"Conta atualizada com sucesso!";

carregar();

}

/* DARK */
function aplicarTema(){

let temaEscuro =
localStorage.getItem("tema") === "dark";

document.getElementById("body")
.classList.toggle("darkmode", temaEscuro);

let botaoTema =
document.getElementById("themeBtn");

if(botaoTema){
botaoTema.innerText =
temaEscuro ? "Alternar light mode" : "Alternar dark mode";
}

}

function darkMode(){

let temaEscuro =
!document.getElementById("body")
.classList.contains("darkmode");

localStorage.setItem(
"tema",
temaEscuro ? "dark" : "light"
);

aplicarTema();

}

aplicarTema();

/* LOGOUT */
function logout(){

localStorage.removeItem("logado");
window.location.href="../pagina inicial/index.html";

}

/* EXCLUIR */
function excluirConta(){

if(!confirm("Deseja excluir sua conta?"))
return;

let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];

usuarios =
usuarios.filter(u =>
u.id !== usuario.id &&
(!u.email || String(u.email).toLowerCase() !== String(usuario.email).toLowerCase())
);

localStorage.setItem(
"usuarios",
JSON.stringify(usuarios)
);

localStorage.removeItem("usuario");
localStorage.removeItem("logado");

window.location.href="../login/login.html";

}
