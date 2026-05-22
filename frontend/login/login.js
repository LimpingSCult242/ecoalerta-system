const login = document.getElementById("loginForm");
const cadastro = document.getElementById("cadastroForm");
const msg = document.getElementById("msg");
const tabLogin = document.getElementById("tabLogin");
const tabCadastro = document.getElementById("tabCadastro");

const API_URL = "http://localhost:8080";

function mostrarLogin(){
    login.classList.add("active");
    cadastro.classList.remove("active");
    tabLogin.classList.add("active");
    tabCadastro.classList.remove("active");
    msg.innerText = "";
}

function mostrarCadastro(){
    cadastro.classList.add("active");
    login.classList.remove("active");
    tabCadastro.classList.add("active");
    tabLogin.classList.remove("active");
    msg.innerText = "";
}

/* CADASTRO */
cadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if(senha.length < 4){
        msg.innerText = "A senha precisa ter pelo menos 4 caracteres.";
        return;
    }

    const novoUsuario = {
        nome,
        email,
        senha,
        telefone,
        cidade: "",
        role: "CLIENTE"
    };

    try {
        const resposta = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoUsuario)
        });

        if(!resposta.ok){
            msg.innerText = "Erro ao cadastrar. Verifique se o email já existe.";
            return;
        }

        cadastro.reset();
        mostrarLogin();
        msg.innerText = "Conta criada com sucesso! Agora faça login.";

    } catch (erro) {
        console.error(erro);
        msg.innerText = "Erro ao conectar com o servidor.";
    }
});

/* LOGIN */
login.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const senha = document.getElementById("loginSenha").value.trim();

    try {
        const resposta = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if(!resposta.ok){
            msg.innerText = "Email ou senha incorretos.";
            document.getElementById("loginSenha").value = "";
            return;
        }

        const usuarioEncontrado = await resposta.json();

        if(!usuarioEncontrado || !usuarioEncontrado.id){
            msg.innerText = "Email ou senha incorretos.";
            document.getElementById("loginSenha").value = "";
            return;
        }

        localStorage.setItem("logado", "true");
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));

        window.location.href = "../../dashboard/dashboard.html";

    } catch (erro) {
        console.error(erro);
        msg.innerText = "Erro ao conectar com o servidor.";
    }
});