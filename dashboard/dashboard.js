const API_URL = "http://localhost:8080";

let todosReportes = [];
let dados = [];
let dadosBase = [];

if(localStorage.getItem("logado") !== "true"){
    window.location.href = "../frontend/login/login.html";
}

const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};

const isAdmin =
    usuarioLogado.role === "ADMIN" ||
    usuarioLogado.role === "admin" ||
    usuarioLogado.role === "vice-lider" ||
    String(usuarioLogado.email || "").toLowerCase() === "admin@ecoalerta.com";

function normalizarStatus(status){
    const valor = String(status || "");

    if(valor === "EM_ANALISE") return "Em andamento";
    if(valor === "RESOLVIDO") return "Concluido";
    if(valor === "ABERTO") return "Aberto";
    if(valor === "CANCELADO") return "Cancelado";

    return valor || "Aberto";
}

function statusParaBackend(status){
    if(status === "Em andamento") return "EM_ANALISE";
    if(status === "Concluido") return "RESOLVIDO";
    if(status === "Aberto") return "ABERTO";
    if(status === "Cancelado") return "CANCELADO";
    return status;
}

function pertenceAoUsuario(item){
    return String(item.usuario_id || "") === String(usuarioLogado.id || "") ||
        String(item.usuario_nome || item.usuario || "").toLowerCase() ===
        String(usuarioLogado.nome || "").toLowerCase();
}

function aplicarVisibilidadeAdmin(){
    document.querySelectorAll(".admin-only").forEach(el=>{
        if(!isAdmin){
            el.style.display = "none";
            return;
        }

        if(el.tagName === "TH" || el.tagName === "TD"){
            el.style.display = "table-cell";
            return;
        }

        if(el.tagName === "A"){
            el.style.display = "flex";
            return;
        }

        if(el.tagName === "BUTTON"){
            el.style.display = "inline-block";
            return;
        }

        el.style.display = "block";
    });
}

aplicarVisibilidadeAdmin();

function aplicarTema(){
    let temaEscuro = localStorage.getItem("tema") === "dark";

    document.body.classList.toggle("darkmode", temaEscuro);

    let botaoTema = document.getElementById("themeBtn");

    if(botaoTema){
        botaoTema.innerText = temaEscuro ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

function darkMode(){
    let temaEscuro = !document.body.classList.contains("darkmode");

    localStorage.setItem("tema", temaEscuro ? "dark" : "light");

    aplicarTema();
}

function logout(){
    localStorage.removeItem("logado");
    localStorage.removeItem("usuario");
    window.location.href = "../pagina inicial/index.html";
}

aplicarTema();

function contar(campo){
    let obj = {};

    dados.forEach(x=>{
        let v = x[campo] || "Outro";
        obj[v] = (obj[v] || 0) + 1;
    });

    return obj;
}

function renderizarCards(){
    document.getElementById("total").innerText = dados.length;
    document.getElementById("abertos").innerText = dados.filter(x=>x.status === "Aberto").length;
    document.getElementById("analise").innerText = dados.filter(x=>x.status === "Em andamento").length;
    document.getElementById("concluidos").innerText = dados.filter(x=>x.status === "Concluido").length;
    document.getElementById("criticos").innerText = dados.filter(x=>x.gravidade === "ALTA" || x.gravidade === "Urgente").length;
}

function popular(id, campo){
    let s = document.getElementById(id);
    if(!s) return;

    s.innerHTML = `<option value="">${id === "bairro" ? "Bairro" : "Tipo"}</option>`;

    Object.keys(contar(campo)).forEach(v=>{
        s.innerHTML += `<option>${v}</option>`;
    });
}

["busca","status","bairro","tipo"].forEach(id=>{
    const el = document.getElementById(id);
    if(el){
        el.addEventListener("input", aplicarFiltros);
        el.addEventListener("change", aplicarFiltros);
    }
});

let graficoBar;
let graficoLine;
let graficoPie;
let graficoBairro;

function criarGraficos(){
    const bar = document.getElementById("bar");
    const line = document.getElementById("line");
    const pie = document.getElementById("pie");
    const bairroChart = document.getElementById("bairroChart");

    if(bar){
        graficoBar = new Chart(bar,{
            type:"bar",
            data:{
                labels:Object.keys(contar("categoria")),
                datasets:[{
                    data:Object.values(contar("categoria"))
                }]
            }
        });
    }

    if(line){
        graficoLine = new Chart(line,{
            type:"line",
            data:{
                labels:Object.keys(contar("dataEnvio")),
                datasets:[{
                    data:Object.values(contar("dataEnvio")),
                    fill:true,
                    tension:.4
                }]
            }
        });
    }

    if(pie){
        graficoPie = new Chart(pie,{
            type:"pie",
            data:{
                labels:Object.keys(contar("status")),
                datasets:[{
                    data:Object.values(contar("status"))
                }]
            }
        });
    }

    if(bairroChart){
        graficoBairro = new Chart(bairroChart,{
            type:"bar",
            data:{
                labels:Object.keys(contar("bairro")),
                datasets:[{
                    data:Object.values(contar("bairro"))
                }]
            },
            options:{indexAxis:'y'}
        });
    }
}

function atualizarGraficos(){
    if(graficoBar){
        graficoBar.data.labels = Object.keys(contar("categoria"));
        graficoBar.data.datasets[0].data = Object.values(contar("categoria"));
        graficoBar.update();
    }

    if(graficoLine){
        graficoLine.data.labels = Object.keys(contar("dataEnvio"));
        graficoLine.data.datasets[0].data = Object.values(contar("dataEnvio"));
        graficoLine.update();
    }

    if(graficoPie){
        graficoPie.data.labels = Object.keys(contar("status"));
        graficoPie.data.datasets[0].data = Object.values(contar("status"));
        graficoPie.update();
    }

    if(graficoBairro){
        graficoBairro.data.labels = Object.keys(contar("bairro"));
        graficoBairro.data.datasets[0].data = Object.values(contar("bairro"));
        graficoBairro.update();
    }
}

function classeStatus(status){
    const valor = normalizarStatus(status);
    if(valor === "Em andamento") return "status-andamento";
    if(valor === "Concluido") return "status-concluido";
    if(valor === "Cancelado") return "status-cancelado";
    return "";
}

function textoStatus(status){
    return {
        "Aberto":"Aberto",
        "Em andamento":"Em andamento",
        "Cancelado":"Cancelado",
        "Concluido":"Concluído"
    }[normalizarStatus(status)] || status || "-";
}

let tbody = document.getElementById("tbody");

function renderizarTabela(){
    if(!tbody) return;

    tbody.innerHTML = "";

    if(dados.length === 0){
        tbody.innerHTML = `
        <tr>
            <td colspan="8">Nenhum chamado encontrado para estes filtros.</td>
        </tr>
        `;
        aplicarVisibilidadeAdmin();
        return;
    }

    [...dados]
        .reverse()
        .slice(0,10)
        .forEach(x=>{

            let cor = "b1";

            if(x.status === "Em andamento") cor = "b2";
            if(x.status === "Cancelado") cor = "b1";
            if(x.status === "Concluido") cor = "b3";

            const statusTexto = textoStatus(x.status);

            const statusAdmin = isAdmin ? `
                <select class="status-select" onclick="event.stopPropagation()" onchange="alterarStatus(${x.id}, this.value)">
                    <option value="Aberto" ${x.status === "Aberto" ? "selected" : ""}>Aberto</option>
                    <option value="Em andamento" ${x.status === "Em andamento" ? "selected" : ""}>Em andamento</option>
                    <option value="Cancelado" ${x.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
                    <option value="Concluido" ${x.status === "Concluido" ? "selected" : ""}>Concluído</option>
                </select>
            ` : `<span class="badge ${cor}">${statusTexto}</span>`;

            tbody.innerHTML += `
            <tr class="linha-chamado" onclick="abrirChamado(${x.id})">
                <td><span class="ticket-pill"><span class="status-dot ${classeStatus(x.status)}"></span>${escaparValor(x.protocolo || "-")}</span></td>
                <td>${escaparValor(x.categoria || "-")}</td>
                <td>${escaparValor(x.usuario_nome || x.usuario || "-")}</td>
                <td>${escaparValor(x.bairro || "-")}</td>
                <td>${escaparValor(x.dataEnvio || "-")}</td>
                <td>${statusAdmin}</td>
                <td>${escaparValor(x.gravidade || "-")}</td>
                <td class="admin-only"><button class="btn" onclick="event.stopPropagation(); alterarStatus(${x.id}, 'Concluido')">Concluir</button></td>
            </tr>
            `;
        });

    aplicarVisibilidadeAdmin();
}

async function alterarStatus(id, status){
    if(!isAdmin) return;

    try{
        const resposta = await fetch(`${API_URL}/reportes/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: statusParaBackend(status)
            })
        });

        if(!resposta.ok){
            alert("Erro ao atualizar status.");
            return;
        }

        await carregarReportes();

    }catch(error){
        console.error(error);
        alert("Erro ao conectar com o servidor.");
    }
}

function abrirChamado(id){
    const item = todosReportes.find(x => String(x.id) === String(id));
    if(!item) return;
    if(!isAdmin && !pertenceAoUsuario(item)) return;

    const modal = document.getElementById("modalChamado");
    const conteudo = document.getElementById("conteudoChamado");

    if(!modal || !conteudo) return;

    conteudo.innerHTML = `
    <div class="modal-topo">
        <div>
            <h2>${escaparValor(item.titulo || "Chamado")}</h2>
            <p>${escaparValor(item.protocolo || "-")} - ${escaparValor(textoStatus(item.status))}</p>
        </div>
        <span class="status-dot ${classeStatus(item.status)}"></span>
    </div>

    <div class="modal-grid">
        <div class="modal-campo"><span>Usuario</span>${escaparValor(item.usuario_nome || item.usuario || "-")}</div>
        <div class="modal-campo"><span>Status</span>${escaparValor(textoStatus(item.status))}</div>
        <div class="modal-campo"><span>Categoria</span>${escaparValor(item.categoria || "-")}</div>
        <div class="modal-campo"><span>Gravidade</span>${escaparValor(item.gravidade || "-")}</div>
        <div class="modal-campo"><span>Cidade</span>${escaparValor(item.cidade || "-")}</div>
        <div class="modal-campo"><span>Bairro</span>${escaparValor(item.bairro || "-")}</div>
        <div class="modal-campo"><span>Rua / Referencia</span>${escaparValor(item.rua || "-")}</div>
        <div class="modal-campo"><span>CEP</span>${escaparValor(item.cep || "-")}</div>
        <div class="modal-campo"><span>Data da ocorrencia</span>${escaparValor(item.dataOcorrencia || "-")}</div>
        <div class="modal-campo"><span>Hora da ocorrencia</span>${escaparValor(item.horaOcorrencia || "-")}</div>
        <div class="modal-campo full"><span>GPS</span>${escaparValor(item.gps || "-")}</div>
        <div class="modal-campo full"><span>Descricao</span>${escaparValor(item.descricao || "-")}</div>
    </div>
    `;

    modal.classList.add("ativo");
}

function fecharChamado(event){
    if(event.target.id === "modalChamado"){
        event.target.classList.remove("ativo");
    }
}

function escaparValor(valor){
    return String(valor || "")
        .replaceAll("&","&amp;")
        .replaceAll('"',"&quot;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
}

function exportar(){
    let blob = new Blob(
        [JSON.stringify(dados,null,2)],
        {type:"application/json"}
    );

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ecoalerta.json";
    a.click();
}

function limpar(){
    document.getElementById("busca").value = "";
    document.getElementById("status").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("tipo").value = "";
    aplicarFiltros();
}

function aplicarFiltros(){
    const busca = document.getElementById("busca").value.trim().toLowerCase();
    const status = document.getElementById("status").value;
    const bairro = document.getElementById("bairro").value;
    const tipo = document.getElementById("tipo").value;

    dados = dadosBase.filter(item=>{
        const textoBusca = [
            item.protocolo,
            item.titulo,
            item.categoria,
            item.usuario_nome,
            item.usuario,
            item.bairro,
            item.cidade,
            item.rua,
            item.descricao
        ].join(" ").toLowerCase();

        return (!busca || textoBusca.includes(busca)) &&
            (!status || normalizarStatus(item.status) === status) &&
            (!bairro || item.bairro === bairro) &&
            (!tipo || item.categoria === tipo);
    });

    renderizarCards();
    renderizarTabela();
    atualizarGraficos();

    if(typeof localizarBairros === "function"){
        localizarBairros();
    }
}

/* MAPA INTELIGENTE */
let map = L.map('map').setView([-23.5505,-46.6333],11);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {maxZoom:19}
).addTo(map);

const camadaMarcadores = L.layerGroup().addTo(map);
const cacheCoordenadas = {};

function coordenadasGps(gps){
    const match = String(gps || "").match(/Lat:\s*(-?\d+(?:\.\d+)?)\s*\|\s*Lon:\s*(-?\d+(?:\.\d+)?)/i);
    if(!match) return null;
    return [Number(match[1]), Number(match[2])];
}

async function buscarCoordenadasPorBairro(item){
    const bairro = String(item.bairro || "").trim();
    if(!bairro) return null;

    const cidade = String(item.cidade || "Sao Paulo").trim() || "Sao Paulo";
    const chave = `${bairro}|${cidade}`.toLowerCase();

    if(cacheCoordenadas[chave]){
        return cacheCoordenadas[chave];
    }

    try{
        const busca = encodeURIComponent(`${bairro}, ${cidade}, Brasil`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${busca}&limit=1`);
        const geo = await res.json();

        if(geo.length > 0){
            cacheCoordenadas[chave] = [Number(geo[0].lat), Number(geo[0].lon)];
            return cacheCoordenadas[chave];
        }
    }catch(e){}

    return null;
}

async function localizarBairros(){
    camadaMarcadores.clearLayers();
    const pontos = [];

    for(let item of dados){
        const coordenadas = coordenadasGps(item.gps) || await buscarCoordenadasPorBairro(item);
        if(!coordenadas) continue;

        L.marker(coordenadas).addTo(camadaMarcadores)
            .bindPopup(`
                <b>${item.categoria || "Ocorrencia"}</b><br>
                ${item.bairro || "-"}<br>
                ${item.rua || ""}<br>
                ${textoStatus(item.status)}
            `);

        pontos.push(coordenadas);
    }

    if(pontos.length === 1){
        map.setView(pontos[0], 14);
    }

    if(pontos.length > 1){
        map.fitBounds(pontos, {padding:[30,30]});
    }
}

async function carregarReportes(){
    try{
        const resposta = await fetch(`${API_URL}/reportes`);

        if(!resposta.ok){
            alert("Erro ao carregar reportes.");
            return;
        }

        todosReportes = await resposta.json();

        todosReportes = todosReportes.map((item, indiceOriginal) => ({
            ...item,
            indiceOriginal,
            usuario_id: item.usuario?.id,
            usuario_nome: item.usuario?.nome,
            status: normalizarStatus(item.status)
        }));

        dados = isAdmin ? todosReportes : todosReportes.filter(pertenceAoUsuario);
        dadosBase = [...dados];

        popular("bairro","bairro");
        popular("tipo","categoria");

        renderizarCards();
        renderizarTabela();
        criarGraficos();
        localizarBairros();

    }catch(error){
        console.error(error);
        alert("Erro ao carregar reportes da API.");
    }
}

carregarReportes();