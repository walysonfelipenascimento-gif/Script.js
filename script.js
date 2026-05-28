// Controle de Permissão Master Ativa
let cargoAtivoDiscord = "CJSu";
let nivelTribunalAtivo = "CJSu";

// 📦 CARGOS INICIAIS DA ORGANIZAÇÃO (Se deletar todos, esses voltam como padrão)
const cargosPadrao = [
    { nome: "STM", tribunal: "STM", cor: "#9b59b6" },
    { nome: "STJ", tribunal: "STJ", cor: "#3498db" },
    { nome: "STF", tribunal: "STF", cor: "#e67e22" },
    { nome: "CJSu", tribunal: "CJSu", cor: "#f1c40f" }
];
let dbCargos = JSON.parse(localStorage.getItem('cjs_sys_cargos')) || cargosPadrao;

// 📦 DATA STORES DINÂMICOS
let dbMural = JSON.parse(localStorage.getItem('cjs_sys_mural')) || [
    { id: 1, titulo: "Sistema S.O.G. Operacional", mensagem: "Use a Central de Administração para cadastrar suas leis, divisões e cargos personalizados.", importante: true }
];

let dbJornal = JSON.parse(localStorage.getItem('cjs_sys_jornal')) || [
    { id: 1, categoria: "decreto", titulo: "DECRETO OPERACIONAL Nº 01", autor: "Comando Supremo", texto: "Plataforma central de registros liberada para uso da corregedoria e alta corte.", data: "28/05/2026" }
];

let dbDivisoes = JSON.parse(localStorage.getItem('cjs_sys_divisoes')) || [
    { id: 1, nome: "Gabinete de Assuntos Estratégicos", lider: "Ministro Fundador", desc: "Responsável pelo alinhamento técnico e estruturação das divisões da comunidade." }
];

let dbLeis = JSON.parse(localStorage.getItem('cjs_sys_leis')) || [
    { id: 1, codigo: "Constituição Suprema", artigo: "Art. 1º", texto: "Fica estabelecido o controle irrestrito de acessos aos documentos por este painel." }
];

let dbTickets = JSON.parse(localStorage.getItem('cjs_sys_tickets')) || [
    { id: "4021", tribunal: "STM", autor: "Corregedor", motivo: "Análise processual tática padrão.", status: "Pendente", data: "28/05/2026" }
];

// Inicialização da Página
window.onload = function() {
    renderizarSeletorCargos();
    renderizarMural();
    renderizarJornal();
    renderizarDivisoes();
    renderizarLeis();
    renderizarTickets();
};

// Navegação
function navegarAba(idAba) {
    document.querySelectorAll('.pagina').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(`sec-${idAba}`);
    if(target) target.classList.add('active');
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Renderizar os botões do Discord baseados no banco dinâmico de cargos
function renderizarSeletorCargos() {
    const box = document.getElementById('box-roles-seletor');
    const selectTribunalForm = document.getElementById('in-tck-trib');
    if(!box) return;
    
    box.innerHTML = '';
    if(selectTribunalForm) selectTribunalForm.innerHTML = '';

    dbCargos.forEach(c => {
        const ativo = c.nome === cargoAtivoDiscord ? 'active' : '';
        box.innerHTML += `<button class="role-btn ${ativo}" style="color:${c.cor};" onclick="alterarCargoSessao('${c.nome}', '${c.tribunal}')">${c.nome}</button>`;
        
        if(selectTribunalForm) {
            selectTribunalForm.innerHTML += `<option value="${c.tribunal}">${c.nome} (Tribunal ${c.tribunal})</option>`;
        }
    });
}

function alterarCargoSessao(nomeCargo, nivelTribunal) {
    cargoAtivoDiscord = nomeCargo;
    nivelTribunalAtivo = nivelTribunal;
    renderizarSeletorCargos();
    renderizarTickets();
    atualizarBotoesModeracao();
}

// 👑 FUNÇÕES DE CRIAÇÃO (ADMIN)
function executarCriarCargo() {
    const nome = document.getElementById('in-cargo-nome').value.trim();
    const trib = document.getElementById('in-cargo-tribunal').value;
    const cor = document.getElementById('in-cargo-cor').value.trim() || "#ffffff";

    if(!nome) return alert("Insira o nome do cargo!");

    dbCargos.push({ nome: nome, tribunal: trib, cor: cor });
    localStorage.setItem('cjs_sys_cargos', JSON.stringify(dbCargos));
    
    document.getElementById('in-cargo-nome').value = '';
    document.getElementById('in-cargo-cor').value = '';
    
    renderizarSeletorCargos();
    alert(`Cargo @${nome} criado com sucesso!`);
}

function executarCriarDivisao() {
    const nome = document.getElementById('in-div-nome').value.trim();
    const lider = document.getElementById('in-div-lider').value.trim();
    const desc = document.getElementById('in-div-desc').value.trim();

    if(!nome || !lider || !desc) return alert("Preencha todos os dados da Divisão!");

    dbDivisoes.push({ id: Date.now(), nome: nome, lider: lider, desc: desc });
    localStorage.setItem('cjs_sys_divisoes', JSON.stringify(dbDivisoes));

    document.getElementById('in-div-nome').value = '';
    document.getElementById('in-div-lider').value = '';
    document.getElementById('in-div-desc').value = '';

    renderizarDivisoes();
    alert(`Divisão "${nome}" integrada ao organograma.`);
}

function executarCriarLei() {
    const cod = document.getElementById('in-lei-codigo').value.trim();
    const art = document.getElementById('in-lei-art').value.trim();
    const txt = document.getElementById('in-lei-txt').value.trim();

    if(!cod || !art || !txt) return alert("Complete os dados da Lei!");

    dbLeis.push({ id: Date.now(), codigo: cod, artigo: art, texto: txt });
    localStorage.setItem('cjs_sys_leis', JSON.stringify(dbLeis));

    document.getElementById('in-lei-codigo').value = '';
    document.getElementById('in-lei-art').value = '';
    document.getElementById('in-lei-txt').value = '';

    renderizarLeis();
    alert("Artigo inserido e ordenado com sucesso.");
}

function executarPostMural() {
    const t = document.getElementById('in-mural-tit').value;
    const m = document.getElementById('in-mural-msg').value;
    const imp = document.getElementById('in-mural-imp').checked;
    if(!t || !m) return alert("Preencha o mural.");
    dbMural.unshift({ id: Date.now(), titulo: t, mensagem: m, importante: imp });
    localStorage.setItem('cjs_sys_mural', JSON.stringify(dbMural));
    document.getElementById('in-mural-tit').value = '';
    document.getElementById('in-mural-msg').value = '';
    document.getElementById('in-mural-imp').checked = false;
    renderizarMural();
}

function executarPostJornal() {
    const cat = document.getElementById('in-jornal-cat').value;
    const t = document.getElementById('in-jornal-tit').value;
    const a = document.getElementById('in-jornal-aut').value;
    const txt = document.getElementById('in-jornal-txt').value;
    if(!t || !a || !txt) return alert("Preencha o D.O.J.");
    dbJornal.unshift({ id: Date.now(), categoria: cat, titulo: t, autor: a, texto: txt, data: "28/05/2026" });
    localStorage.setItem('cjs_sys_jornal', JSON.stringify(dbJornal));
    document.getElementById('in-jornal-tit').value = '';
    document.getElementById('in-jornal-aut').value = '';
    document.getElementById('in-jornal-txt').value = '';
    renderizarJornal();
}

function executarPostTicket() {
    const trib = document.getElementById('in-tck-trib').value;
    const aut = document.getElementById('in-tck-aut').value;
    const desc = document.getElementById('in-tck-desc').value;
    if(!aut || !desc) return alert("Preencha o processo.");
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    dbTickets.unshift({ id: id, tribunal: trib, autor: aut, motivo: desc, status: "Pendente", data: "28/05/2026" });
    localStorage.setItem('cjs_sys_tickets', JSON.stringify(dbTickets));
    document.getElementById('in-tck-aut').value = '';
    document.getElementById('in-tck-desc').value = '';
    renderizarTickets();
}

function atualizarStatusTicket(id, status) {
    dbTickets = dbTickets.map(t => t.id === id ? {...t, status: status} : t);
    localStorage.setItem('cjs_sys_tickets', JSON.stringify(dbTickets));
    renderizarTickets();
}

// 🛑 REMOÇÃO SUPREMA DE DADOS
function apagarItemSistema(banco, id) {
    if(cargoAtivoDiscord !== "CJSu") return alert("Negado: Apenas a patente master [CJSu] remove registros.");
    if(!confirm("Expurgar este registro permanentemente?")) return;

    if(banco==='mural') { dbMural = dbMural.filter(x=>x.id!==id); localStorage.setItem('cjs_sys_mural', JSON.stringify(dbMural)); renderizarMural(); }
    if(banco==='jornal') { dbJornal = dbJornal.filter(x=>x.id!==id); localStorage.setItem('cjs_sys_jornal', JSON.stringify(dbJornal)); renderizarJornal(); }
    if(banco==='divisao') { dbDivisoes = dbDivisoes.filter(x=>x.id!==id); localStorage.setItem('cjs_sys_divisoes', JSON.stringify(dbDivisoes)); renderizarDivisoes(); }
    if(banco==='lei') { dbLeis = dbLeis.filter(x=>x.id!==id); localStorage.setItem('cjs_sys_leis', JSON.stringify(dbLeis)); renderizarLeis(); }
    if(banco==='ticket') { dbTickets = dbTickets.filter(x=>x.id!==id); localStorage.setItem('cjs_sys_tickets', JSON.stringify(dbTickets)); renderizarTickets(); }
    if(banco==='cargo') { 
        dbCargos = dbCargos.filter(x=>x.nome!==id); 
        localStorage.setItem('cjs_sys_cargos', JSON.stringify(dbCargos)); 
        cargoAtivoDiscord = "CJSu"; nivelTribunalAtivo = "CJSu";
        renderizarSeletorCargos(); renderizarTickets(); 
    }
}

function atualizarBotoesModeracao() {
    const visual = (cargoAtivoDiscord === "CJSu") ? "block" : "none";
    document.querySelectorAll('.btn-delete-master').forEach(b => b.style.display = visual);
}

// 🖨️ MOTORES DE CONSTRUÇÃO VISUAL
function renderizarMural() {
    const el = document.getElementById('box-mural'); if(!el) return; el.innerHTML = '';
    document.getElementById('cnt-mural').innerText = dbMural.length;
    dbMural.forEach(m => {
        el.innerHTML += `<div class="discord-embed ${m.importante ? 'embed-dourado' : ''}">
            <div class="embed-title">${m.titulo}</div>
            <div class="embed-desc">${m.mensagem}</div>
            <button class="btn-delete-master" onclick="apagarItemSistema('mural', ${m.id})">🛑 Deletar Alerta</button>
        </div>`;
    });
    atualizarBotoesModeracao();
}

function renderizarJornal() {
    const el = document.getElementById('box-jornal'); if(!el) return; el.innerHTML = '';
    document.getElementById('cnt-doj').innerText = dbJornal.length;
    const cores = { decreto: "var(--tag-decreto)", ata: "var(--tag-ata)", noticia: "var(--tag-noticia)", juris: "var(--tag-juris)" };
    dbJornal.forEach(j => {
        el.innerHTML += `<div class="jornal-card">
            <span class="jornal-tag" style="background:${cores[j.categoria]}">${j.categoria}</span>
            <div class="jornal-topo"><h3>${j.titulo}</h3><div class="jornal-meta"><span>Por: ${j.autor}</span><span>Data: ${j.data}</span></div></div>
            <div class="jornal-corpo">${j.texto}</div>
            <button class="btn-delete-master" onclick="apagarItemSistema('jornal', ${j.id})">🛑 Apagar Matéria</button>
        </div>`;
    });
    atualizarBotoesModeracao();
}

function renderizarDivisoes() {
    const el = document.getElementById('box-divisoes'); if(!el) return; el.innerHTML = '';
    document.getElementById('cnt-divisoes').innerText = dbDivisoes.length;
    dbDivisoes.forEach(d => {
        el.innerHTML += `<div class="divisao-card">
            <div class="divisao-nome">🛡️ ${d.nome}</div>
            <div class="divisao-lider">Liderança: ${d.lider}</div>
            <div class="divisao-desc">${d.desc}</div>
            <button class="btn-delete-master" onclick="apagarItemSistema('divisao', ${d.id})">🛑 Extinguir Setor</button>
        </div>`;
    });
    atualizarBotoesModeracao();
}

function renderizarLeis() {
    const el = document.getElementById('box-diretrizes'); if(!el) return; el.innerHTML = '';
    
    // Agrupa leis por código de forma inteligente
    let codigosAgrupados = {};
    dbLeis.forEach(l => {
        if(!codigosAgrupados[l.codigo]) codigosAgrupados[l.codigo] = [];
        codigosAgrupados[l.codigo].push(l);
    });

    document.getElementById('cnt-diretrizes').innerText = dbLeis.length;
    
    for (let cod in codigosAgrupados) {
        let artigosHtml = '';
        codigosAgrupados[cod].forEach(a => {
            artigosHtml += `<div class="artigo-item">
                <div class="artigo-titulo">${a.artigo}</div>
                <div class="artigo-texto">${a.texto}</div>
                <button class="btn-delete-master" onclick="apagarItemSistema('lei', ${a.id})">🛑 Revogar Artigo</button>
            </div>`;
        });

        el.innerHTML += `<div class="lei-bloco">
            <div class="lei-header-titulo">📖 ${cod}</div>
            ${artigosHtml}
        </div>`;
    }
    atualizarBotoesModeracao();
}

function renderizarTickets() {
    const el = document.getElementById('box-tickets'); if(!el) return; el.innerHTML = '';
    const h = { "STM": ["STM"], "STJ": ["STM", "STJ"], "STF": ["STM", "STJ", "STF"], "CJSu": ["STM", "STJ", "STF", "CJSu"] };
    const permitidos = h[nivelTribunalAtivo] || ["STM"];
    let count = 0;

    dbTickets.forEach(t => {
        if(permitidos.includes(t.tribunal)) {
            count++;
            el.innerHTML += `<div class="ticket-card t-${t.tribunal}">
                <div class="ticket-head"><span class="ticket-id">🔒 canal-privado-#${t.id}</span><span class="ticket-badge">@${t.tribunal}</span></div>
                <div class="ticket-desc">${t.motivo}</div>
                <div class="ticket-foot">
                    <span>Requerente: <b>${t.autor}</b></span>
                    <select class="status-select" onchange="atualizarStatusTicket('${t.id}', this.value)">
                        <option value="Pendente" ${t.status==='Pendente'?'selected':''}>Pendente</option>
                        <option value="Em Andamento" ${t.status==='Em Andamento'?'selected':''}>Em Andamento</option>
                        <option value="Concluído" ${t.status==='Concluído'?'selected':''}>Concluído</option>
                    </select>
                </div>
                <button class="btn-delete-master" onclick="apagarItemSistema('ticket', '${t.id}')">🛑 Arquivar Processo</button>
            </div>`;
        }
    });

    // Se estiver em CJSu, adiciona a listagem dinâmica dos cargos criados para poder apagar os cargos criados errados
    if(cargoAtivoDiscord === "CJSu" && dbCargos.length > 4) {
        el.innerHTML += `<div style="margin-top:20px; border-top:1px solid var(--borda); padding-top:10px;">
            <p style="font-size:0.75rem; color:var(--tag-decreto); font-weight:bold; margin-bottom:5px;">REMOÇÃO DE CARGOS ADICIONAIS:</p>
            <div class="roles-flex" id="box-delete-cargos"></div>
        </div>`;
        const delBox = document.getElementById('box-delete-cargos');
        dbCargos.forEach(c => {
            if(!['STM','STJ','STF','CJSu'].includes(c.nome)) {
                delBox.innerHTML += `<button class="role-btn" style="border: 1px dashed red;" onclick="apagarItemSistema('cargo', '${c.nome}')">❌ Remover @${c.nome}</button>`;
            }
        });
    }

    document.getElementById('cnt-sts').innerText = count;
    if(count === 0) el.innerHTML = `<p style="text-align:center; color:var(--texto); font-size:0.8rem; padding:15px;">Nenhum canal ativo sob sua alçada institucional.</p>`;
    atualizarBotoesModeracao();
}
