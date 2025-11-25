// leitorQrCode.js
import { API_BASE_URL } from './apiConfig.js';

export function lerQrViaUpload(file, callbackSucesso, callbackErro) {
  if (!file) return callbackErro("Nenhum arquivo selecionado");

  const formData = new FormData();
  formData.append("file", file); // O nome da chave 'file' é obrigatório no Java

  // CORRIGIDO: Usa API_BASE_URL
  fetch(`${API_BASE_URL}/api/qrcode/ler`, {
    method: "POST",
    body: formData
  })
  .then(res => res.ok ? res.json() : Promise.reject(`Erro ${res.status} ao ler QR Code`))
  .then(usuario => callbackSucesso(usuario))
  .catch(err => callbackErro(err));
}

export function lerQrViaCodigo(codigo, callbackSucesso, callbackErro) {
  if (!codigo) return callbackErro("Código vazio");

  // CORRIGIDO: Usa API_BASE_URL
  fetch(`${API_BASE_URL}/api/usuarios/por-codigo/${codigo}`)
    .then(res => res.ok ? res.json() : Promise.reject(`Erro ${res.status} ao buscar por código`))
    .then(usuario => callbackSucesso(usuario))
    .catch(err => callbackErro(err));
}


function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor ?? "-";
}

export function exibirUsuario(respostaJson) {
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