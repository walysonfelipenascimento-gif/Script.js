// Variável de controle do cargo estilo Discord
let cargoAtivoDiscord = "CJSu";

// Bancos de dados carregados diretamente do LocalStorage para retenção de dados permanente
let bancoMural = JSON.parse(localStorage.getItem('cjs_db_mural')) || [
    { titulo: "[DIRETRIZ] Ativação do Sistema Operacional CJS", mensagem: "Implementação oficial concluída com sucesso. A partir deste momento, a plataforma passa a ser o canal centralizado para padronização.", importante: true }
];

let bancoJornal = JSON.parse(localStorage.getItem('cjs_db_jornal')) || [
    { titulo: "Abertura Oficial do Período de Notas", autor: "Comando Supremo", texto: "O Diário Oficial de Julgamentos (D.O.J.) passa a registrar de forma unificada e pública todas as atas civis de hoje em diante.", data: "28/05/2026" }
];

let bancoTickets = JSON.parse(localStorage.getItem('cjs_db_tickets')) || [
    { id: "4019", tribunal: "STM", autor: "Gabinete Militar", motivo: "Inquérito interno sob procedimentos operacionais de patrulha técnica.", data: "28/05/2026" },
    { id: "8821", tribunal: "STF", autor: "Ministro Relator", motivo: "Arguição de descumprimento de preceito fundamental sobre as divisões táticas.", data: "28/05/2026" }
];

let bancoDiretrizes = JSON.parse(localStorage.getItem('cjs_db_diretrizes')) || [
    { titulo: "Art. 1º - Dos Princípios Fundamentais", texto: "Fica instituída a obrigatoriedade da observância estrita da hierarquia de acessos aos canais judiciais do S.T.S." }
];

// Execução ao iniciar o carregamento da página
window.onload = function() {
    renderizarMural();
    renderizarJornal();
    renderizarTickets();
    renderizarDiretrizes();
};

// Alternância de Abas e Abordagem Modular
function alternarAbasDoSistema(idAba) {
    document.querySelectorAll('.pagina').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
    
    const containerAlvo = document.getElementById(`aba-${idAba}`);
    if (containerAlvo) containerAlvo.classList.add('active');
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Alteração Dinâmica de Cargos (Discord Roles)
function atualizarCargoSessao(cargo) {
    cargoAtivoDiscord = cargo;
    document.querySelectorAll('.role-pill').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    renderizarTickets();
}

// Emissões e Cadastros (Painel de Controle)
function enviarNovoMural() {
    const t = document.getElementById('mural-titulo').value;
    const m = document.getElementById('mural-conteudo-txt').value;
    const imp = document.getElementById('mural-importante').checked;

    if (!t || !m) return alert("Aviso: Preencha o título e o conteúdo do comunicado.");

    bancoMural.unshift({ titulo: t, mensagem: m, importante: imp });
    localStorage.setItem('cjs_db_mural', JSON.stringify(bancoMural));
    
    document.getElementById('mural-titulo').value = '';
    document.getElementById('mural-conteudo-txt').value = '';
    document.getElementById('mural-importante').checked = false;
    
    renderizarMural();
    alert("Comunicado fixado no mural com sucesso!");
}

function enviarNovoJornal() {
    const t = document.getElementById('jornal-titulo').value;
    const a = document.getElementById('jornal-autor').value;
    const tx = document.getElementById('jornal-texto').value;

    if (!t || !a || !tx) return alert("Aviso: Insira todos os dados exigidos pelo jornal.");

    bancoJornal.unshift({ titulo: t, autor: a, texto: tx, data: "28/05/2026" });
    localStorage.setItem('cjs_db_jornal', JSON.stringify(bancoJornal));
    
    document.getElementById('jornal-titulo').value = '';
    document.getElementById('jornal-autor').value = '';
    document.getElementById('jornal-texto').value = '';
    
    renderizarJornal();
    alert("Matéria expedida com sucesso no Diário Oficial!");
}

function enviarNovoTicket() {
    const trib = document.getElementById('ticket-tribunal').value;
    const aut = document.getElementById('ticket-autor').value;
    const mot = document.getElementById('ticket-motivo').value;

    if (!aut || !mot) return alert("Aviso: Declare o oficial solicitante e o resumo da causa.");

    const aleatorioId = Math.floor(1000 + Math.random() * 9000);
    bancoTickets.unshift({ id: aleatorioId.toString(), tribunal: trib, autor: aut, motivo: mot, data: "28/05/2026" });
    localStorage.setItem('cjs_db_tickets', JSON.stringify(bancoTickets));
    
    document.getElementById('ticket-autor').value = '';
    document.getElementById('ticket-motivo').value = '';
    
    renderizarTickets();
    alert(`Canal privado #${aleatorioId} gerado para o tribunal de destino!`);
}

function enviarNovaDiretriz() {
    const t = document.getElementById('diretriz-titulo-input').value;
    const tx = document.getElementById('diretriz-texto-input').value;

    if (!t || !tx) return alert("Aviso: O título e o texto normativo são necessários.");

    bancoDiretrizes.unshift({ titulo: t, texto: tx });
    localStorage.setItem('cjs_db_diretrizes', JSON.stringify(bancoDiretrizes));
    
    document.getElementById('diretriz-titulo-input').value = '';
    document.getElementById('diretriz-texto-input').value = '';
    
    renderizarDiretrizes();
    alert("Artigo regulamentar arquivado em Diretrizes!");
}

// Motores de Renderização
function renderizarMural() {
    const caixa = document.getElementById('blocoMuralCJS');
    if (!caixa) return;
    caixa.innerHTML = '';
    
    bancoMural.forEach(m => {
        caixa.innerHTML += `
            <div class="discord-embed ${m.importante ? 'embed-dourado-brillante' : ''}">
                <div class="embed-content">
                    <div class="embed-title">${m.titulo}</div>
                    <div class="embed-description">${m.mensagem}</div>
                </div>
            </div>`;
    });
}

function renderizarJornal() {
    const caixa = document.getElementById('jornal-conteudo');
    if (!caixa) return;
    caixa.innerHTML = '';
    
    bancoJornal.forEach(j => {
        caixa.innerHTML += `
            <div class="jornal-item">
                <div class="jornal-header">
                    <h3>${j.titulo}</h3>
                    <div class="jornal-meta"><span>Relator: ${j.autor}</span><span>Emissão: ${j.data}</span></div>
                </div>
                <div class="jornal-corpo">${j.texto}</div>
            </div>`;
    });
}

function renderizarTickets() {
    const caixa = document.getElementById('lista-tickets');
    if (!caixa) return;
    caixa.innerHTML = '';

    // Lógica cumulativa de visualização baseada na hierarquia fornecida
    const hierarquia = {
        "STM": ["STM"],
        "STJ": ["STM", "STJ"],
        "STF": ["STM", "STJ", "STF"],
        "CJSu": ["STM", "STJ", "STF", "CJSu"]
    };

    const tribunaisPermitidos = hierarquia[cargoAtivoDiscord] || ["STM"];
    let itensExibidos = 0;

    bancoTickets.forEach(t => {
        if (tribunaisPermitidos.includes(t.tribunal)) {
            itensExibidos++;
            caixa.innerHTML += `
                <div class="ticket-card t-${t.tribunal}">
                    <div class="ticket-top">
                        <span class="ticket-id">🔒 canal-privado-#${t.id}</span>
                        <span class="badge-discord">@${t.tribunal}</span>
                    </div>
                    <div class="ticket-motivo">${t.motivo}</div>
                    <div class="ticket-footer"><span>Aberto por: <b>${t.autor}</b></span><span>Data: ${t.data}</span></div>
                </div>`;
        }
    });

    if (itensExibidos === 0) {
        caixa.innerHTML = `<p style="text-align:center; color:#949ba4; font-size:0.9rem; padding:15px;">Sem processos ou tickets sob sua alçada no momento.</p>`;
    }
}

function renderizarDiretrizes() {
    const caixa = document.getElementById('diretriz-conteudo');
    if (!caixa) return;
    caixa.innerHTML = '';
    
    bancoDiretrizes.forEach(d => {
        caixa.innerHTML += `
            <div class="diretriz-card">
                <div class="diretriz-titulo">⚖️ ${d.titulo}</div>
                <div class="diretriz-texto">${d.texto}</div>
            </div>`;
    });
}
