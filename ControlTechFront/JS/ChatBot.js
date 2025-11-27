// --- Dicionário de traduções (MANTIDO) ---
const translations = {
    'pt': {
        'pageTitle': 'ChatBot - SENAI ControlTech',
        'sidebarTools': 'Ferramentas',
        'sidebarReturn': 'Devolver',
        'sidebarHelp': 'Ajuda',
        'sidebarChatBot': 'ChatBot', 
        'sidebarHistory': 'Histórico',
        'sidebarExit': 'Sair',
        'sidebarSettings': 'Configurações',
        'settingsPopupTitle': 'Configurações',
        'themeLabel': 'Alternar Tema:',
        'themeStatusLight': 'Tema Claro',
        'themeStatusDark': 'Tema Escuro',
        'langLabel': 'Alternar Idioma:',
        'langStatusPT': 'Português',
        'langStatusEN': 'Inglês',
        'welcomeMessage': 'Olá,',
    },
    'en': {
        'pageTitle': 'ChatBot - SENAI ControlTech',
        'sidebarTools': 'Tools',
        'sidebarReturn': 'Return',
        'sidebarHelp': 'Help',
        'sidebarChatBot': 'ChatBot', 
        'sidebarHistory': 'History',
        'sidebarExit': 'Exit',
        'sidebarSettings': 'Settings',
        'settingsPopupTitle': 'Settings',
        'themeLabel': 'Toggle Theme:',
        'themeStatusLight': 'Light Theme',
        'themeStatusDark': 'Dark Theme',
        'langLabel': 'Toggle Language:',
        'langStatusPT': 'Portuguese',
        'langStatusEN': 'English',
        'welcomeMessage': 'Hello,',
    }
};

// --- FUNÇÕES DE UTILIDADE PARA TRADUÇÃO (Novas definições globais) ---

/**
 * Define o texto de um elemento com base na chave de tradução.
 * @param {string} id ID do elemento HTML.
 * @param {string} key Chave do dicionário de tradução.
 * @param {object} trans Dicionário de tradução.
 */
function setText(id, key, trans) {
    const element = document.getElementById(id);
    if (element) element.textContent = trans[key] || '';
}

/**
 * Define o texto de um span dentro de um elemento com base na chave de tradução.
 * Usado primariamente para itens da barra lateral.
 * @param {string} id ID do elemento pai.
 * @param {string} key Chave do dicionário de tradução.
 * @param {object} trans Dicionário de tradução.
 */
function setSpanText(id, key, trans) {
    const element = document.getElementById(id)?.querySelector('span');
    if (element) element.textContent = trans[key] || '';
}


// --- FUNÇÕES GLOBAIS DE TEMA E IDIOMA (MANTIDAS/AJUSTADAS) ---

/**
 * Atualiza todas as traduções na página.
 * @param {string} lang Idioma atual ('pt' ou 'en').
 */
function updateTranslations(lang) {
    const currentLang = translations[lang] ? lang : 'pt';
    const trans = translations[currentLang];
    if (!trans) return console.error("Traduções não encontradas:", currentLang);

    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
    document.title = trans.pageTitle || 'ChatBot - SENAI';

    // Barra lateral
    setSpanText('nav-tools', 'sidebarTools', trans);
    setSpanText('nav-return', 'sidebarReturn', trans);
    setSpanText('nav-help', 'sidebarHelp', trans);
    setSpanText('nav-chatbot', 'sidebarChatBot', trans); 
    setSpanText('nav-history', 'sidebarHistory', trans);
    setSpanText('nav-exit', 'sidebarExit', trans);
    setSpanText('settings-btn', 'sidebarSettings', trans);

    // Popup Configurações
    setText('settings-popup-title', 'settingsPopupTitle', trans);
    setText('theme-label', 'themeLabel', trans);
    setText('lang-label', 'langLabel', trans);

    // Atualiza textos de status
    updateThemeStatusText(document.body.classList.contains('dark-theme') ? 'dark' : 'light', currentLang);
    updateLanguageStatusText(currentLang);
    displayUserName(currentLang); // Atualiza o nome do usuário na tela
};

/**
 * Salva o tema no localStorage e atualiza o UI.
 * @param {'light'|'dark'} theme 
 */
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
    const currentLang = localStorage.getItem('lang') || 'pt';
    updateThemeStatusText(theme, currentLang);
    updateThemeToggleButtonVisuals(theme);
};

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const currentLang = localStorage.getItem('lang') || 'pt';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeStatusText(savedTheme, currentLang);
    updateThemeToggleButtonVisuals(savedTheme);
};

/**
 * Atualiza o texto de status do tema.
 * @param {'light'|'dark'} activeTheme 
 * @param {string} lang 
 */
function updateThemeStatusText(activeTheme, lang) {
    const themeStatusEl = document.getElementById('theme-status');
    const trans = translations[lang];
    if (themeStatusEl && trans) {
        themeStatusEl.textContent = activeTheme === 'dark' ? (trans.themeStatusDark || 'Tema Escuro') : (trans.themeStatusLight || 'Tema Claro');
    }
};

/**
 * Atualiza a visualização do botão de alternar tema.
 * @param {'light'|'dark'} activeTheme 
 */
function updateThemeToggleButtonVisuals(activeTheme) {
    const sunIcon = document.querySelector('#theme-toggle-btn .fa-sun');
    const moonIcon = document.querySelector('#theme-toggle-btn .fa-moon');
    if (sunIcon && moonIcon) {
        sunIcon.style.opacity = activeTheme === 'dark' ? '0' : '1';
        sunIcon.style.transform = activeTheme === 'dark' ? 'translateY(-10px)' : 'translateY(0)';
        moonIcon.style.opacity = activeTheme === 'dark' ? '1' : '0';
        moonIcon.style.transform = activeTheme === 'dark' ? 'translateY(0)' : 'translateY(10px)';
    }
};

/**
 * Salva o idioma no localStorage e atualiza a UI.
 * @param {'pt'|'en'} lang 
 */
function saveLanguage(lang) {
    localStorage.setItem('lang', lang);
    updateTranslations(lang);
};

function loadLanguage() {
    const savedLang = localStorage.getItem('lang') || 'pt';
    updateTranslations(savedLang);
};

/**
 * Atualiza o texto de status do idioma.
 * @param {string} activeLang 
 */
function updateLanguageStatusText(activeLang) {
    const langToggleBtnSpan = document.getElementById('lang-toggle-btn')?.querySelector('span');
    const langStatusEl = document.getElementById('lang-status');
    if (langToggleBtnSpan) langToggleBtnSpan.textContent = activeLang.toUpperCase();
    if (langStatusEl) {
        const transPt = translations.pt;
        const transEn = translations.en;
        if (transPt && transEn) {
            langStatusEl.textContent = activeLang === 'pt' ? (transPt.langStatusPT || 'Português') : (transEn.langStatusEN || 'English');
        }
    }
};

/**
 * Exibe o nome do usuário logado na interface.
 * Esta função depende da correta execução do login para funcionar.
 * @param {string} lang 
 */
function displayUserName(lang) {
    const welcomeMessage = document.getElementById('welcome-message');
    const userNameElement = document.getElementById('user-name');
    const trans = translations[lang];
    let userInfo = null;
    try {
        const storedUser = localStorage.getItem('usuarioLogado');
        if (storedUser) userInfo = JSON.parse(storedUser);
    } catch (e) { console.error("Erro ao ler usuarioLogado:", e); }

    if (welcomeMessage && userNameElement && trans) {
        const defaultUserName = (lang === 'pt' ? 'Usuário' : 'User');
        welcomeMessage.textContent = trans.welcomeMessage || (lang === 'pt' ? 'Olá,' : 'Hello,');
        userNameElement.textContent = (userInfo && userInfo.nome) ? userInfo.nome : defaultUserName;
    }
}


// --- Lógica do ChatBot com Vocabulário Aprimorado ---

/**
 * Adiciona uma mensagem ao corpo do chat.
 * @param {string} text 
 * @param {'user'|'bot'} sender 
 */
function appendMessage(text, sender) {
    const chatBody = document.getElementById('chatbot-body');
    if (!chatBody) return; 

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(`${sender}-message`);
    
    // O innerHTML é usado para renderizar o negrito (<b>) e quebras de linha (<br>)
    const messageParagraph = document.createElement('p');
    messageParagraph.innerHTML = text; 
    
    messageContainer.appendChild(messageParagraph);
    chatBody.appendChild(messageContainer);

    // Rola para o final da conversa
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Função utilitária para formatar a resposta do bot.
 * @param {string} text O texto da resposta do bot.
 * @returns {string} O texto formatado em HTML.
 */
function formatBotResponse(text) {
    // 1. Substitui **texto** por <b>texto</b>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 2. Converte quebras de linha para HTML para exibição
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
}


/**
 * Fornece a resposta simulada do bot com base no contexto da ControlTech.
 * @param {string} input 
 * @returns {string}
 */
function getBotResponse(input) {
    // 1. Pré-processamento e formatação de entrada
    const lowerInput = input.toLowerCase().trim();

    // --- Definição das Respostas (Usando Regex com melhorias) ---
    
    // 0. Respostas para Agradecimentos/Confirmação
    if (/(^ok$|^tá$|obrigad[oa]|valeu|certo|sim|beleza|blz|fechado)/.test(lowerInput)) {
        return formatBotResponse("Fico feliz em ajudar com a sua gestão de ferramentas! Se precisar de mais detalhes ou tiver novas dúvidas sobre o ControlTech, estou à disposição.");
    }
    
    // 1. Respostas sobre Identificação/Login/Logout 🔑
    if (/(login|entrar|acessar|autenticar|começo|qr\s*code|crachá)/.test(lowerInput)) {
        return formatBotResponse("O processo de **autenticação** no ControlTech é totalmente seguro e simples. Para iniciar sua sessão e utilizar o sistema, por favor, utilize o **QR Code do seu crachá SENAI**. Este é o método padrão de **login** e garante a rastreabilidade do usuário.");
    }
    if (/(sair|logout|deslogar|encerrar\s*sessão|finalizar)/.test(lowerInput)) {
        return formatBotResponse("Para encerrar sua sessão com segurança e garantir o registro correto de todas as suas movimentações, é essencial que você escaneie novamente o **QR Code do seu crachá** na aba **Sair**. Este procedimento valida o seu **desligamento** do sistema e confirma que não há empréstimos pendentes.");
    }

    // --- REGRAS CRÍTICAS DE TRANSAÇÃO (PEGAR/DEVOLVER/HISTÓRICO) ---
    
    // 2A. Respostas sobre **Retirada/Pegar Ferramentas** 🛠️ (Prioridade)
    const retiradaRegex = /(ferramentas|itens|catálogo|item|preciso|empréstimo|pegar|retirar|capturar|usar|quero)\b.*(ferramentas|item|pegar|retirar|empréstimo)/;
    if (retiradaRegex.test(lowerInput)) {
        if (!/(devolver|devolução|entrega|devolvo)/.test(lowerInput)) {
              return formatBotResponse("A aba **'Ferramentas'** é o coração do sistema, onde você encontra o **catálogo completo** de itens disponíveis. Lá, você seleciona o item desejado e registra o empréstimo, finalizando a retirada com o seu QR Code pessoal.");
        }
    }
    
    // 2B. Respostas sobre **Devolução/Entrega** 📦
    if (/(devolver|devolução|entrego|entrega|devolvo)/.test(lowerInput)) {
        return formatBotResponse("O procedimento de devolução é direto:\n\n1. Acesse a seção **'Devolver'** no menu lateral.\n2. **Busque ou identifique a ferramenta pelo seu nome** ou código.\n3. O sistema fará o **registro automático** da devolução, incluindo a **data e horário**.\n\nLembre-se: A devolução imediata e a verificação do estado da ferramenta são cruciais para o controle de inventário.");
    }

    // 2C. Respostas sobre **Rastreabilidade/Histórico** 🔍
    if (/(registro|quem\s*pegou|rastrear|monitoramento|historico|ver\s*quem\s*pegou|quem\s*está\s*com)/.test(lowerInput)) {
        return formatBotResponse("Nosso sistema ControlTech é focado em **rastreabilidade total e transparência**. A cada empréstimo e devolução, as seguintes informações são registradas de forma indelével:\n\n* O **Nome do Aluno** (quem realizou a movimentação).\n* A **Identificação da Ferramenta** (Nome, ID e status).\n* A **Data e Horário** precisos da ação.\n\nVocê pode consultar seus registros e o status dos itens na seção **'Histórico'**.");
    }

    // 3. Respostas sobre Desenvolvimento e Acessibilidade 🧑‍💻
    if (/(quem\s*fez|desenvolvedores|criadores|equipe|idealizadores|cria|alunos|fundadores|arquitetos|criou|pessoas|criaram|fundou|desenvolveu|arquitetou|fizeram)/.test(lowerInput)) {
        return formatBotResponse("O ControlTech é um projeto de **desenvolvimento inovador** realizado por cinco alunos do SENAI: **Felipe Rossi, Victor Hugo, Eliezer, Eduardo e Guilherme**. Eles conceberam e implementaram toda a **arquitetura robusta e segura** do sistema para gestão de ferramentas.");
    }
    // Acessibilidade
    if (/(acessibilidade|vlibras|inclusão|surdo|como\s*foi\s*feito|Vlibras)/.test(lowerInput)) {
        return formatBotResponse("Acessibilidade é uma prioridade fundamental! O ControlTech integra o recurso de **Acessibilidade do Governo (VLibras)**, disponível em todas as páginas. Basta localizar o ícone específico para utilizar a tradução em Libras.");
    }
    // Navegação geral
    if (/(navegação|onde\s*está|menus|abas|mexer|navegar|funções)/.test(lowerInput)) {
        return formatBotResponse("A navegação principal do sistema é clara e acessível através da barra lateral, contendo as principais funções: **Ferramentas** (para retirada), **Devolver**, **Ajuda**, **ChatBot**, **Histórico** e **Sair**. A aba **ativa** é sempre destacada para sua orientação.");
    }

    // 4. Respostas Genéricas e Boas-vindas 👋
    if (/(olá|oi|tudo\s*bem|saudação|bom\s*dia|boa\s*tarde)/.test(lowerInput)) {
        return formatBotResponse("Saudações! Eu sou o Assistente Virtual da ControlTech. Fui desenvolvido para te auxiliar com qualquer questão sobre o **uso, regulamentos e funcionamento** do nosso sistema de gerenciamento de ferramentas. Em que área posso te dar suporte hoje?");
    }

    // 5. Resposta Padrão (Fallback) ❓
    return formatBotResponse("Não consegui encontrar uma correspondência exata para sua consulta. Por favor, tente reformular sua pergunta ou utilize termos mais específicos. Posso fornecer detalhes sobre:\n\n* **Devolução e Empréstimos**\n* **Login/Logout** (via QR Code)\n* **Rastreabilidade** (Histórico)\n* **A Equipe de Desenvolvimento** da ControlTech");
}


/**
 * Processa o envio da mensagem do usuário.
 */
function handleSendMessage() {
    const chatInput = document.getElementById('chatbot-input');
    
    if (!chatInput) {
        console.error("Erro: Elemento 'chatbot-input' não encontrado.");
        return;
    }

    // @ts-ignore
    const input = chatInput.value.trim();
    
    if (input === "") return;

    // A mensagem do usuário é exibida sem formatação
    appendMessage(input, 'user');
    // @ts-ignore
    chatInput.value = ''; // Limpa o campo após o envio

    setTimeout(() => {
        const botResponse = getBotResponse(input);
        // getBotResponse já retorna o HTML formatado
        appendMessage(botResponse, 'bot');
    }, 500);
}


// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    // Referências NavBar
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const settingsBtn = document.getElementById('settings-btn');
    const themePopup = document.getElementById('theme-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    
    // Referências ChatBot
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chatbot-input');
    
    let conversationInitialized = false;

    // Inicializa Tema e Idioma
    loadTheme();
    loadLanguage(); 
    
    // Mensagem inicial do bot
    if (!conversationInitialized) {
        const initialMessage = "Olá! Sou o Assistente Virtual do ControlTech. Sou especialista nas regras e no funcionamento do sistema. Em que posso te ajudar hoje?";
        appendMessage(initialMessage, 'bot');
        conversationInitialized = true;
    }

    // Evento Hamburger (NavBar)
    hamburgerBtn?.addEventListener('click', () => sidebar?.classList.toggle('active'));

    // Eventos Popup Configurações
    settingsBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        themePopup?.classList.toggle('visible');
        themePopup?.classList.toggle('hidden', !themePopup.classList.contains('visible'));
    });
    closePopupBtn?.addEventListener('click', () => {
        themePopup?.classList.remove('visible');
        themePopup?.classList.add('hidden');
    });
    themeToggleBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        document.body.classList.toggle('dark-theme', !isDark); // Garante que a classe é alternada corretamente
        saveTheme(newTheme);
    });
    langToggleBtn?.addEventListener('click', () => {
        const currentLang = localStorage.getItem('lang') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        saveLanguage(newLang);
    });
    
    // --- Lógica de Envio de Mensagem ---
    
    // 1. Enviar mensagem ao clicar no botão
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    } else {
        console.error("Erro: Botão de envio (send-btn) não encontrado.");
    }

    // 2. Enviar mensagem ao pressionar ENTER no input
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            // @ts-ignore
            if (e.key === 'Enter') {
                e.preventDefault(); 
                handleSendMessage();
            }
        });
    } else {
          console.error("Erro: Input de chat (chatbot-input) não encontrado.");
    }
});