import { API_BASE_URL } from './apiConfig.js';

export function lerQrViaUpload(file, callbackSucesso, callbackErro) {
  if (!file) return callbackErro("Nenhum arquivo selecionado");

  const formData = new FormData();
  formData.append("file", file);

  fetch(`${API_BASE_URL}/api/usuarios/ler`, { // Ajustado para rota correta se necessário, ou /qrcode/ler
    method: "POST",
    body: formData
  })
  .then(res => {
      if (res.ok) return res.json();
      // Se der erro 405, tenta a rota alternativa antiga só por garantia
      return fetch(`${API_BASE_URL}/api/qrcode/ler`, { method: "POST", body: formData })
             .then(r => r.ok ? r.json() : Promise.reject(`Erro ${r.status}`));
  })
  .then(usuario => callbackSucesso(usuario))
  .catch(err => callbackErro(err));
}

export function lerQrViaCodigo(codigo, callbackSucesso, callbackErro) {
  if (!codigo) return callbackErro("Código vazio");

  fetch(`${API_BASE_URL}/api/usuarios/por-codigo/${codigo}`)
    .then(res => res.ok ? res.json() : Promise.reject(`Erro ${res.status}`))
    .then(usuario => callbackSucesso(usuario))
    .catch(err => callbackErro(err));
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor ?? "-";
}

export function exibirUsuario(respostaJson) {
  // Suporta tanto retorno direto quanto { usuario: ... }
  const usuario = respostaJson.usuario || respostaJson;
  const agora = new Date();

  setText('idAluno', usuario.id);
  setText('nomeAluno', usuario.nome);
  setText('perfilAluno', usuario.perfil);
  setText('qrCodeAluno', usuario.qrCode);
  
  const dataEl = document.getElementById('dataAtual');
  const horaEl = document.getElementById('horaAtual');
  if(dataEl) dataEl.textContent = agora.toLocaleDateString('pt-BR');
  if(horaEl) horaEl.textContent = agora.toLocaleTimeString('pt-BR');

  const statusMsg = document.getElementById('statusMsgLogin'); 
  if (statusMsg) statusMsg.textContent = "Login realizado com sucesso!";

  const infoAluno = document.getElementById('infoAluno');
  if (infoAluno) infoAluno.style.display = 'block';
}