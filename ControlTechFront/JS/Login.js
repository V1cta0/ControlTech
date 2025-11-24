// Login.js
import { lerQrViaUpload, exibirUsuario } from './leitorQrCode.js';
import { API_BASE_URL } from './apiConfig.js'; 

// Variáveis globais para o leitor de QR Code
window.html5QrCodeCadastro = null;
let html5QrCodeLogin = null;

// ----- Fundo hexagonal -----
const container = document.getElementById('container');
if (container) {
    let innerHTML = '';
    for (let i = 0; i < 15; i++) {
        innerHTML += '<div class="row">';
        for (let j = 0; j < 20; j++) {
            innerHTML += '<div class="hexagon"></div>';
        }
        innerHTML += '</div>';
    }
    container.innerHTML = innerHTML;
}

// ----- Referências -----
const statusMsgLogin = document.getElementById('statusMsgLogin');
const infoAluno = document.getElementById('infoAluno');

// ----- Abrir/Fechar cadastro -----
const abrirCadastro = document.getElementById('abrirCadastro');
const cadastroBox = document.getElementById('cadastroBox');
const loginContainer = document.getElementById('loginContainer');
const voltarLogin = document.getElementById('voltarLogin');

abrirCadastro?.addEventListener('click', () => {
    loginContainer?.classList.add('slide-out');
    cadastroBox?.classList.add('active');
    stopCamera('login');
});

voltarLogin?.addEventListener('click', () => {
    loginContainer?.classList.remove('slide-out');
    cadastroBox?.classList.remove('active');
    stopCamera('cadastro');
});

// ----- Função de Alerta Personalizado -----
function showAlert(titulo, mensagem) {
    const modal = document.getElementById('alertModal');
    const titleEl = document.getElementById('alertTitle');
    const msgEl = document.getElementById('alertMessage');
    const btnOk = document.getElementById('btnAlertOk');

    if (modal && titleEl && msgEl) {
        titleEl.textContent = titulo;
        msgEl.textContent = mensagem;
        modal.classList.remove('hidden');
        
        const fechar = () => modal.classList.add('hidden');
        btnOk.onclick = fechar;
        modal.onclick = (e) => {
            if (e.target === modal) fechar();
        };
    } else {
        alert(`${titulo}\n\n${mensagem}`);
    }
}

// ----- Funções Auxiliares de Câmera -----

export function stopCamera(mode) {
    const readerId = mode === 'login' ? 'reader-login' : 'reader-cadastro';
    const readerContainer = document.getElementById(readerId);
    const btn = mode === 'login' ? document.getElementById('btnToggleCameraLogin') : document.getElementById('btnToggleCameraCadastro');
    const uploadControls = document.getElementById(mode === 'login' ? 'loginUploadControls' : 'cadastroUploadControls');

    let reader = mode === 'login' ? html5QrCodeLogin : window.html5QrCodeCadastro;

    if (reader && reader.isScanning) {
        reader.stop().then(ignore => {
            if (readerContainer) readerContainer.style.display = 'none';
            
            if (btn) {
                if (mode === 'login') btn.innerHTML = '<i class="fas fa-video"></i> Usar Câmera';
                else btn.innerHTML = '<i class="fas fa-video"></i> Ler Crachá com Câmera';
            }

            if(uploadControls) uploadControls.style.display = 'block'; 

            if (mode === 'login') html5QrCodeLogin = null;
            else window.html5QrCodeCadastro = null;
        }).catch(err => console.error("Erro ao parar câmera:", err));
    } else {
        if(uploadControls) uploadControls.style.display = 'block';
    }
}

// ----- Função startCamera (MODO CAÇA À CÂMERA TRASEIRA) -----
export function startCamera(mode, onScanSuccess) {
    const readerId = mode === 'login' ? 'reader-login' : 'reader-cadastro';
    const readerContainer = document.getElementById(readerId);
    const btn = document.getElementById(mode === 'login' ? 'btnToggleCameraLogin' : 'btnToggleCameraCadastro');
    const uploadControls = document.getElementById(mode === 'login' ? 'loginUploadControls' : 'cadastroUploadControls');

    // Se já estiver aberta, fecha antes de abrir de novo
    if (readerContainer && readerContainer.style.display === 'block') {
        stopCamera(mode);
        return;
    }

    // Atualiza UI
    if (readerContainer) readerContainer.style.display = 'block';
    if (btn) btn.innerHTML = '<i class="fas fa-stop-circle"></i> Parar Câmera';
    if (uploadControls) uploadControls.style.display = 'none';

    // Cria a instância se não existir
    if (mode === 'login' && !html5QrCodeLogin) {
        // @ts-ignore
        html5QrCodeLogin = new Html5Qrcode(readerId);
    } else if (mode === 'cadastro' && !window.html5QrCodeCadastro) {
        // @ts-ignore
        window.html5QrCodeCadastro = new Html5Qrcode(readerId);
    }

    let reader = mode === 'login' ? html5QrCodeLogin : window.html5QrCodeCadastro;

    const config = {
        fps: 25,
        qrbox: { width: 250, height: 250 },
        // disableFlip: false deixa a lib decidir o espelhamento (melhor para compatibilidade)
    };

    if (reader) {
        // 1. Pede permissão e lista as câmeras
        // @ts-ignore
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                
                let backCameraId = null;

                // 2. Procura explicitamente por uma câmera "Traseira" ou "Back" ou "Environment"
                const backCamera = devices.find(device => {
                    const label = device.label.toLowerCase();
                    return label.includes('back') || label.includes('traseira') || label.includes('environment');
                });

                if (backCamera) {
                    backCameraId = backCamera.id;
                    console.log("Câmera traseira encontrada pelo nome:", backCamera.label);
                }

                // 3. Define a estratégia: ID Específico (se achou) OU 'environment' genérico
                const startConfig = backCameraId ? backCameraId : { facingMode: "environment" };

                // 4. Inicia a câmera
                reader.start(
                    startConfig, 
                    config,
                    onScanSuccess,
                    (errorMessage) => { 
                        // Ignora erros de frame vazio 
                    }
                ).catch((err) => {
                    console.warn("Falha ao abrir câmera traseira/environment. Tentando câmera padrão...", err);
                    
                    // 5. Fallback Final: Se a traseira falhar (ou PC não tiver), abre a primeira que achar (Frontal/Webcam)
                    reader.start(
                        devices[0].id, 
                        config, 
                        onScanSuccess, 
                        () => {}
                    ).catch(finalErr => {
                        showAlert("Erro Fatal", "Não foi possível iniciar nenhuma câmera.");
                        stopCamera(mode);
                    });
                });

            } else {
                showAlert("Atenção", "Nenhuma câmera detectada no dispositivo.");
                stopCamera(mode);
            }
        }).catch(err => {
            console.error("Erro ao listar câmeras:", err);
            showAlert("Erro", "Permissão de câmera negada ou erro desconhecido.");
            stopCamera(mode);
        });
    }
}


// ----- Login via Câmera -----
document.getElementById('btnToggleCameraLogin')?.addEventListener('click', () => {
    stopCamera('cadastro'); 
    startCamera('login', (decodedText, decodedResult) => {
        stopCamera('login');
        handleLoginSuccess(decodedText);
    });
});

function handleLoginSuccess(qrCodeContent) {
    if (statusMsgLogin) statusMsgLogin.textContent = "Processando QR Code...";
    
    const loginControls = document.getElementById('loginControls');

    fetch(`${API_BASE_URL}/api/usuarios/por-codigo/${qrCodeContent}`)
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text || "Código não encontrado"); });
            }
            return res.json();
        })
        .then(usuario => {
            salvarUsuarioLogado({ usuario: usuario });

            if (loginControls) loginControls.style.display = 'none';
            exibirUsuario({ usuario: usuario }); 

            if (statusMsgLogin) statusMsgLogin.textContent = "Login bem-sucedido! Redirecionando...";
            if (infoAluno) infoAluno.style.display = "block";

            setTimeout(() => {
                window.location.href = '/HTML/Ferramentas.html';
            }, 500); 

        })
        .catch(err => {
            console.error("Erro login:", err);
            let msgErro = (err.message.includes("404")) ? "Usuário não encontrado." : `QR Code inválido. (${err.message})`;
            if (statusMsgLogin) statusMsgLogin.textContent = msgErro;
            if (infoAluno) infoAluno.style.display = "none";
            if (loginControls) loginControls.style.display = 'block'; 
        });
}

// ----- Login via Upload -----
const btnLerQrUpload = document.getElementById('btnLerQr');
const loginQrInput = document.getElementById('loginQrInput');

btnLerQrUpload?.addEventListener('click', () => {
    // @ts-ignore
    const file = loginQrInput.files[0];
    if (!file) {
        showAlert("Atenção", "Por favor, selecione um arquivo de QR Code primeiro.");
        return;
    }

    stopCamera('login');

    btnLerQrUpload.classList.add('loading');
    btnLerQrUpload.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    
    const loginControls = document.getElementById('loginControls');

    lerQrViaUpload(file, (usuario) => {
        btnLerQrUpload.classList.remove('loading');
        btnLerQrUpload.innerHTML = '<i class="fas fa-qrcode"></i> Ler QR Code por Arquivo';

        if (loginControls) loginControls.style.display = 'none';

        exibirUsuario(usuario);
        salvarUsuarioLogado(usuario);

        if (statusMsgLogin) statusMsgLogin.textContent = "Login bem-sucedido!";
        if (infoAluno) infoAluno.style.display = "block";

        setTimeout(() => {
            window.location.href = '/HTML/Ferramentas.html';
        }, 500);

    }, (err) => {
        btnLerQrUpload.classList.remove('loading');
        btnLerQrUpload.innerHTML = '<i class="fas fa-qrcode"></i> Ler QR Code por Arquivo';

        console.error(err);
        showAlert("Erro de Leitura", "QR Code inválido ou não reconhecido.");
        if (infoAluno) infoAluno.style.display = "none";
    });
});


function salvarUsuarioLogado(usuario) {
    const dadosReais = usuario.usuario || usuario; 

    // Garante que o ID existe
    const idUsuario = dadosReais.id || dadosReais.usuarioId;

    if (!idUsuario) {
        showAlert("Erro no Sistema", "Não foi possível identificar o usuário retornado pelo servidor.");
        console.error("Dados recebidos inválidos:", usuario);
        return;
    }

    // Cria o objeto limpo para salvar
    const usuarioFormatado = {
        id: idUsuario,
        nome: dadosReais.nome || "Usuário Sem Nome", // Fallback para não quebrar
        perfil: dadosReais.perfil,
        qrCode: dadosReais.qrCode
    };

    console.log("Salvando usuário no localStorage:", usuarioFormatado); // Log para depuração
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFormatado));
}

const fileNameDisplay = document.getElementById('fileNameDisplay');
loginQrInput?.addEventListener('change', () => {
    // @ts-ignore
    if (loginQrInput.files.length > 0) {
        if (fileNameDisplay) fileNameDisplay.textContent = loginQrInput.files[0].name;
    } else {
        if (fileNameDisplay) fileNameDisplay.textContent = 'Nenhum arquivo escolhido';
    }
});