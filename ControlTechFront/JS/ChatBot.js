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

// --- FUNÇÕES DE UTILIDADE PARA TRADUÇÃO ---

function setText(id, key, trans) {
    const element = document.getElementById(id);
    if (element) element.textContent = trans[key] || '';
}

function setSpanText(id, key, trans) {
    const element = document.getElementById(id)?.querySelector('span');
    if (element) element.textContent = trans[key] || '';
}

// --- FUNÇÕES GLOBAIS DE TEMA E IDIOMA ---

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

    updateThemeStatusText(document.body.classList.contains('dark-theme') ? 'dark' : 'light', currentLang);
    updateLanguageStatusText(currentLang);
    displayUserName(currentLang);
};

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
    const currentLang = localStorage.getItem('lang') || 'pt';
    
    // CORREÇÃO: Garante que a classe 'dark-theme' é aplicada centralmente.
    document.body.classList.toggle('dark-theme', theme === 'dark'); 

    updateThemeStatusText(theme, currentLang);
    updateThemeToggleButtonVisuals(theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const currentLang = localStorage.getItem('lang') || 'pt';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeStatusText(savedTheme, currentLang);
    updateThemeToggleButtonVisuals(savedTheme);
};

function updateThemeStatusText(activeTheme, lang) {
    const themeStatusEl = document.getElementById('theme-status');
    const trans = translations[lang];
    if (themeStatusEl && trans) {
        themeStatusEl.textContent = activeTheme === 'dark' ? (trans.themeStatusDark || 'Tema Escuro') : (trans.themeStatusLight || 'Tema Claro');
    }
};

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

function saveLanguage(lang) {
    localStorage.setItem('lang', lang);
    updateTranslations(lang);
};

function loadLanguage() {
    const savedLang = localStorage.getItem('lang') || 'pt';
    updateTranslations(savedLang);
};

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


// --- FUNÇÕES DE PERSISTÊNCIA E CHAT ---

const CHAT_STORAGE_KEY = 'chatbotHistory';

/**
 * Salva o histórico de mensagens no localStorage.
 */
function saveChatHistory() {
    const chatBody = document.getElementById('chatbot-body');
    if (!chatBody) return;

    const messages = Array.from(chatBody.children).map(child => {
        const sender = child.classList.contains('user-message') ? 'user' : 'bot';
        const text = child.querySelector('p')?.innerHTML || ''; 
        return { text, sender };
    });

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

/**
 * Carrega e exibe o histórico de mensagens do localStorage.
 */
function loadChatHistory() {
    const chatBody = document.getElementById('chatbot-body');
    if (!chatBody) return false;

    const historyJson = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!historyJson) return false;

    try {
        const history = JSON.parse(historyJson);
        if (Array.isArray(history) && history.length > 0) {
            chatBody.innerHTML = ''; 
            history.forEach(msg => {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message');
                messageContainer.classList.add(`${msg.sender}-message`);
                
                const messageParagraph = document.createElement('p');
                messageParagraph.innerHTML = msg.text; 
                
                messageContainer.appendChild(messageParagraph);
                chatBody.appendChild(messageContainer);
            });
            chatBody.scrollTop = chatBody.scrollHeight;
            return true;
        }
    } catch (e) {
        console.error("Erro ao carregar histórico do chat:", e);
        localStorage.removeItem(CHAT_STORAGE_KEY); 
    }
    return false;
}

/**
 * Adiciona uma mensagem ao corpo do chat e salva o histórico.
 */
function appendMessage(text, sender) {
    const chatBody = document.getElementById('chatbot-body');
    if (!chatBody) return; 

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(`${sender}-message`);
    
    const messageParagraph = document.createElement('p');
    messageParagraph.innerHTML = text; 
    
    messageContainer.appendChild(messageParagraph);
    chatBody.appendChild(messageContainer);

    chatBody.scrollTop = chatBody.scrollHeight;
    saveChatHistory(); 
}

/**
 * Função utilitária para formatar a resposta do bot.
 */
function formatBotResponse(text) {
    // 1. Substitui **texto** por <b>texto</b>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 2. Converte quebras de linha para HTML para exibição
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
}


// --- LÓGICA DO BOT ---

function getBotResponse(input) {
    const lowerInput = input.toLowerCase().trim();
    
    // 0. Respostas para Agradecimentos/Confirmação
    if (/(^ok$|^tá$|obrigad[oa]|valeu|certo|sim|beleza|blz|fechado)/.test(lowerInput)) {
        return formatBotResponse("Fico feliz em ajudar com a sua gestão de ferramentas! Se precisar de mais detalhes ou tiver novas dúvidas sobre o ControlTech, estou à disposição.");
    }
    
    // 1. Respostas sobre Identificação/Login/Logout 🔑
    if (/(login|entrar|acessar|autenticar|começo|qr\s*code|crachá)/.test(lowerInput)) {
        return formatBotResponse("O processo de **autenticação** no ControlTech é totalmente seguro e simples. Para iniciar sua sessão e utilizar o sistema, por favor, utilize o **QR Code do seu crachá SENAI** na página de Login. Este é o método padrão de **login** e garante a rastreabilidade do usuário.");
    }
    
    // Resposta de Logout
    if (/(sair|logout|deslogar|encerrar\s*sessão|finalizar)/.test(lowerInput)) {
        return formatBotResponse("Para encerrar sua sessão, vá para a aba **'Saída'** no menu lateral.\n\nLá, basta pressionar o botão de **'Sair'** (ou **'Encerrar Sessão'**) para confirmar o seu desligamento do sistema. Não é necessário escanear o crachá novamente. Este processo garante a finalização segura de sua sessão.");
    }

    // Resposta sobre Landing Page (Início)
    if (/(início|inicio|pagina\s*inicial|home|bem\s*vindo|landing\s*page)/.test(lowerInput)) {
        return formatBotResponse("A página **'Início'** (ou Landing Page) serve como o painel de boas-vindas do sistema. Ela confirma seu login, exibe o seu nome e é o ponto central para acessar todas as funções, como Ferramentas, Devolver e Histórico, através da barra lateral.");
    }

    // Resposta sobre Ajuda
    if (/(ajuda|faq|suporte|contato|problema|problemas|perguntas\s*frequentes)/.test(lowerInput)) {
        return formatBotResponse("A **Central de Ajuda** é o seu recurso para resolver dúvidas rápidas.\n\nEla contém:\n\n1. Uma seção de **Perguntas Frequentes (FAQ)**, cobrindo os processos de devolução e saída do sistema.\n2. Um **Formulário de Contato** ('Relate seu problema') para enviar solicitações específicas diretamente para o e-mail de suporte.");
    }

    // --- REGRAS CRÍTICAS DE TRANSAÇÃO ---
    
    // 2A. Respostas sobre **Retirada/Pegar Ferramentas** 🛠️ 
    const retiradaRegex = /(ferramenta[s]?|item|catálogo|preciso|emprestimo|pegar|retirar|capturar|usar|quero)/;
    if (retiradaRegex.test(lowerInput)) {
        if (!/(devolver|devolução|entrega|devolvo)/.test(lowerInput)) {
              return formatBotResponse("A aba **'Ferramentas'** é o coração do sistema, onde você encontra o **catálogo completo** de itens disponíveis. Para **retirar** uma ferramenta:\n\n1. Selecione o item desejado no catálogo.\n2. Registre o empréstimo, e ela ficará associada ao seu nome.\n\nO processo é rápido e garante o rastreamento.");
        }
    }
    
    // 2B. Respostas sobre **Devolução/Entrega** 📦
    if (/(devolver|devolução|entrego|entrega|devolvo)/.test(lowerInput)) {
        return formatBotResponse("O procedimento de devolução é direto:\n\n1. Acesse a seção **'Devolver'** no menu lateral.\n2. **Busque ou identifique a ferramenta pelo seu nome** ou código.\n3. O sistema fará o **registro automático** da devolução, incluindo a **data e horário**.\n\nLembre-se: A devolução imediata e a verificação do estado da ferramenta são cruciais para o controle de inventário.");
    }

    // 2C. Respostas sobre **Rastreabilidade/Histórico** 🔍
    if (/(registro|quem\s*pegou|rastrear|monitoramento|historico|histórico|ver\s*quem\s*pegou|quem\s*está\s*com)/.test(lowerInput)) {
        return formatBotResponse("A aba **'Histórico'** oferece **rastreabilidade total e transparência**.\n\nVocê pode consultar seus **registros de movimentação** (empréstimos e devoluções) e o **status atual** de qualquer ferramenta. O sistema armazena o nome do aluno, a identificação da ferramenta e a data/horário exato de cada ação.");
    }

    // 3. Respostas sobre Desenvolvimento e Acessibilidade 🧑‍💻
    if (/(quem\s*fez|desenvolvedores|criadores|equipe|idealizadores|cria|alunos|fundadores|arquitetos|criou|pessoas|criaram|fundou|desenvolveu|arquitetou|fizeram)/.test(lowerInput)) {
        return formatBotResponse("O ControlTech é um projeto de **desenvolvimento inovador** realizado por cinco alunos do SENAI: **Eduardo Rodriges, Eliezer Beltrame, Felipe Rossi, Guilherme Augusto e Victor Hugo.**. Eles conceberam e implementaram toda a **arquitetura robusta e segura** do sistema para gestão de ferramentas.");
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
    return formatBotResponse("Não consegui encontrar uma correspondência exata para sua consulta. Por favor, tente reformular sua pergunta ou utilize termos mais específicos. Posso fornecer detalhes sobre:\n\n* **Devolução e Empréstimos**\n* **Login/Logout** (via QR Code)\n* **Rastreabilidade** (Histórico)\n\n* **A Equipe de Desenvolvimento** da ControlTech");
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
    
    // Inicializa Tema e Idioma
    loadTheme();
    loadLanguage(); 
    
    // Carrega o histórico de mensagens
    const historyLoaded = loadChatHistory();
    
    // Mensagem inicial do bot (só se o histórico estiver vazio)
    if (!historyLoaded) {
        const initialMessage = "Olá! Sou o Assistente Virtual do ControlTech. Sou especialista nas regras e no funcionamento do sistema. Em que posso te ajudar hoje?";
        appendMessage(initialMessage, 'bot');
    }

    // Evento Hamburger (NavBar)
    hamburgerBtn?.addEventListener('click', () => sidebar?.classList.toggle('active'));

    // Eventos Popup Configurações (CORRIGIDOS)
    settingsBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 1. Remove a classe 'hidden' explicitamente (do HTML) para não conflitar com a transição.
        themePopup?.classList.remove('hidden'); 
        
        // 2. Alterna a classe principal de visibilidade para iniciar/terminar a transição.
        themePopup?.classList.toggle('visible');
    });
    
    closePopupBtn?.addEventListener('click', () => {
        // 3. Apenas remove a classe 'visible' para iniciar o fade-out suave.
        themePopup?.classList.remove('visible');
    });
    
    themeToggleBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        
        // 4. Chama saveTheme, que agora aplica a classe no body.
        saveTheme(newTheme);
    });
    
    langToggleBtn?.addEventListener('click', () => {
        const currentLang = localStorage.getItem('lang') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        saveLanguage(newLang);
    });
    
    // --- Lógica de Envio de Mensagem ---
    
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    } 

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            // @ts-ignore
            if (e.key === 'Enter') {
                e.preventDefault(); 
                handleSendMessage();
            }
        });
    } 
});