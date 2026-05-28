// ==========================================
// 🏛️ CJS - SISTEMA DE OPERAÇÕES GOVERNAMENTAIS
// BANCO DE DATOS LOCAL (Inicialização Automática)
// ==========================================

if (!localStorage.getItem('BD_CJS')) {
    const dadosIniciais = {
        configuracoes: {
            permissoesRecruta: {
                "p-mural": true,       // Mural Principal
                "p-divisoes": false,   // Hub de Divisões
                "p-logistica": false,  // Logística/Ações
                "p-doj": true,         // Diário Oficial
                "p-sts": false,        // Superior Tribunal Supremo
                "p-config": false      // Painel Administrativo
            }
        },
        cargos: [
            { id: 1, nome: "Ministro Supremo", ocupante: "Walyson", nivel: "Alto Comando" },
            { id: 2, nome: "Diretor de Inteligência", ocupante: "A definir", nivel: "Alto Comando" },
            { id: 3, nome: "Oficial de Justiça", ocupante: "A definir", nivel: "Corpo Jurídico" },
            { id: 4, nome: "Agente de Segurança", ocupante: "A definir", nivel: "Operacional" }
        ],
        divisoes: [
            { id: 1, nome: "Diretoria de Inteligência", link: "#", tipo: "Informativa", verificado: true },
            { id: 2, nome: "Corregedoria Geral", link: "#", tipo: "Divisional", verificado: true }
        ],
        muralCJS: [],
        muralMilitar: [],
        processosSTS: []
    };
    localStorage.setItem('BD_CJS', JSON.stringify(dadosIniciais));
}

// Carrega os dados na memória ativa do script
let BD = JSON.parse(localStorage.getItem('BD_CJS'));
function salvarNoBanco() {
    localStorage.setItem('BD_CJS', JSON.stringify(BD));
}

// ==========================================
// 🛡️ FUNCTIONALIDADE 1: CONTROLE DE ACESSO
// ==========================================

function carregarSistemaPorCargo(cargoUsuario) {
    // cargoUsuario pode ser: 'recruta' ou 'alto_comando'
    const permissoes = BD.configuracoes.permissoesRecruta;
    
    if (cargoUsuario === 'recruta') {
        // Passa por todas as páginas aplicando a trava de segurança
        Object.keys(permissoes).forEach(idPagina => {
            const elementoMenu = document.getElementById(`nav-${idPagina}`);
            if (elementoMenu) {
                elementoMenu.style.display = permissoes[idPagina] ? 'block' : 'none';
            }
        });
        // Esconde botões de criação "+" e edição para recrus
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        console.log("⚡ [CJS Security] Interface restrita para Usuários Iniciais aplicada.");
    } else {
        // Alto Comando vê tudo
        document.querySelectorAll('[id^="nav-"]').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        console.log("👑 [CJS Security] Acesso irrestrito concedido ao Alto Comando.");
    }
}

// Salvar alteração de permissão que o Admin fizer na Página 6
function alterarPermissaoRecruta(idPagina, valor) {
    BD.configuracoes.permissoesRecruta[idPagina] = valor;
    salvarNoBanco();
    console.log(`⚙️ [Config] Permissão da página ${idPagina} alterada para: ${valor}`);
}

// ==========================================
// 📰 FUNCTIONALIDADE 2: GERADOR DE EMBEDS (MURAL)
// ==========================================

function publicarEmbed(muralAlvo, titulo, conteudo, ehExtremamenteImportante) {
    // muralAlvo deve ser: 'muralCJS' ou 'muralMilitar'
    
    const novoPost = {
        id: Date.now(),
        titulo: titulo,
        conteudo: conteudo,
        importante: ehExtremamenteImportante,
        data: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Adiciona no início do array correspondente
    BD[muralAlvo].unshift(novoPost);
    salvarNoBanco();
    renderizarMurais();
}

function renderizarMurais() {
    ['muralCJS', 'muralMilitar'].forEach(muralKey => {
        const container = document.getElementById(muralKey);
        if (!container) return;
        
        container.innerHTML = ''; // Limpa a tela
        
        BD[muralKey].forEach(post => {
            const embed = document.createElement('div');
            embed.className = 'discord-embed';
            
            // Ativa o efeito Dourado Brilhante si for Marcado como Extremamente Importante
            if (post.importante) {
                embed.classList.add('embed-dourado-brilhante');
            } else {
                embed.style.borderLeft = '4px solid #c5a059'; // Dourado padrão CJS
            }
            
            embed.innerHTML = `
                <div class="embed-content">
                    <h3 class="embed-title">${post.titulo}</h3>
                    <p class="embed-description">${post.conteudo}</p>
                    <span class="embed-footer">⚡ Emitido pelo Alto Comando CJS | ${post.data}</span>
                </div>
            `;
            container.appendChild(embed);
        });
    });
}

// ==========================================
// 🌐 FUNCTIONALIDADE 3: SISTEMA "+" (CRIADOR DE DIVISÕES)
// ==========================================

function criarNovaDivisao(nome, link, tipo, ehVerificado) {
    const novaDivisao = {
        id: Date.now(),
        nome: nome,
        link: link,
        tipo: tipo, // "Informativa" ou "Divisional"
        verificado: ehVerificado // true ou false
    };

    BD.divisoes.push(novaDivisao);
    salvarNoBanco();
    renderizarDivisoes();
}

function renderizarDivisoes() {
    const container = document.getElementById('hub-divisoes');
    if (!container) return;
    
    container.innerHTML = '';
    
    BD.divisoes.forEach(div => {
        const card = document.createElement('div');
        card.className = 'card-divisao';
        
        let seloEspecial = '';
        // Aplica a animação visual se o órgão for homologado/verificado
        if (div.verificado) {
            card.classList.add('servidor-verificado');
            seloEspecial = '<span class="badge-verificado">✔ HOMOLOGADO CJS</span>';
        }

        card.innerHTML = `
            <div class="card-header">
                <h4>${div.nome}</h4>
                ${seloEspecial}
            </div>
            <p>Classificação: <strong>${div.tipo}</strong></p>
            <a href="${div.link}" target="_blank" class="btn-acesso">Acessar Jurisdição</a>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// ⚖️ FUNCTIONALIDADE 4: SUPREMO TRIBUNAL (STS)
// ==========================================

function protocolarProcesso(reu, infracao, relator) {
    const novoProcesso = {
        protocolo: `#${Math.floor(100000 + Math.random() * 900000)}`,
        reu: reu,
        infracao: infracao,
        relator: relator,
        status: "Em Análise Pelo Colegiado Supremo",
        data: new Date().toLocaleDateString('pt-BR')
    };

    BD.processosSTS.unshift(novoProcesso);
    salvarNoBanco();
    renderizarSTS();
}

function renderizarSTS() {
    const container = document.getElementById('painel-processos');
    if (!container) return;

    container.innerHTML = '';

    BD.processosSTS.forEach(proc => {
        const item = document.createElement('div');
        item.className = 'item-processo';
        item.innerHTML = `
            <div class="proc-header">
                <span class="proc-id">${proc.protocolo}</span>
                <span class="proc-status">${proc.status}</span>
            </div>
            <p><strong>Réu/Alvo:</strong> ${proc.reu}</p>
            <p><strong>Infração Constitucional:</strong> ${proc.infracao}</p>
            <p><strong>Ministro Relator:</strong> ${proc.relator}</p>
            <small>Data de Abertura: ${proc.data}</small>
        `;
        container.appendChild(item);
    });
}

// ==========================================
// 👥 FUNCTIONALIDADE 5: GESTÃO DE CARGOS
// ==========================================

function atualizarOcupanteCargo(idCargo, novoNome) {
    const cargo = BD.cargos.find(c => c.id === idCargo);
    if (cargo) {
        cargo.ocupante = novoNome;
        salvarNoBanco();
        renderizarCargos();
    }
}

function renderizarCargos() {
    const container = document.getElementById('tabela-cargos');
    if (!container) return;

    container.innerHTML = '';
    BD.cargos.forEach(cargo => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><strong>${cargo.nome}</strong></td>
            <td>${cargo.nivel}</td>
            <td><span class="nome-ocupante">${cargo.ocupante}</span></td>
            <td><button class="btn-editar admin-only" onclick="this.style.display='none'; promptDeEdicao(${cargo.id})">Alterar Oficial</button></td>
        `;
        container.appendChild(linha);
    });
}

function promptDeEdicao(id) {
    let novoNome = prompt("Digite o nome do novo Oficial/Membro para o cargo:");
    if (novoNome) {
        atualizarOcupanteCargo(id, novoNome);
    } else {
        renderizarCargos();
    }
}

// ==========================================
// INITIALIZADOR AUTOMÁTICO DA PÁGINA
// ==========================================
window.onload = function() {
    // Definição padrão ao carregar: Mude para 'recruta' para testar a segurança oculta
    carregarSistemaPorCargo('alto_comando'); 
    
    // Renderiza tudo o que já estiver salvo no banco
    renderizarMurais();
    renderizarDivisoes();
    renderizarSTS();
    renderizarCargos();
};
