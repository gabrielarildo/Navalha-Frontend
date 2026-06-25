export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor ?? 0);
}

// dataHora vem da API como string ISO (ex: "2026-06-25T14:00:00")
export function formatarDataHora(dataHoraIso) {
  if (!dataHoraIso) return "";
  const data = new Date(dataHoraIso);
  const dataFmt = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const horaFmt = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dataFmt} às ${horaFmt}`;
}

export function formatarData(dataHoraIso) {
  if (!dataHoraIso) return "";
  return new Date(dataHoraIso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatarHora(dataHoraIso) {
  if (!dataHoraIso) return "";
  return new Date(dataHoraIso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Converte um TimeSpan da API (ex: "09:00:00") para "09:00"
export function formatarHorario(timeSpan) {
  if (!timeSpan) return "";
  const partes = timeSpan.split(":");
  return `${partes[0]}:${partes[1]}`;
}

// Junta um valor de <input type="date"> com um horário "HH:mm" no formato
// esperado pela API (sem timezone): "AAAA-MM-DDTHH:mm:00"
export function combinarDataHorario(dataYYYYMMDD, horarioHHmm) {
  return `${dataYYYYMMDD}T${horarioHHmm}:00`;
}

export function hojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
