import { useEffect, useState, useCallback } from "react";
import { FiCheckCircle, FiCheck, FiXCircle, FiRefreshCw } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  listarAgendamentos,
  listarAgendamentosPorBarbeiro,
  atualizarStatus,
  cancelarAgendamento,
  normalizarStatus,
  STATUS,
} from "../../services/agendamentoService";
import AppointmentCard from "../../components/AppointmentCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import Alert from "../../components/Alert";
import SelecionarPerfil from "./SelecionarPerfil";

export default function BarbeiroDashboard() {
  const { usuario, getBarbeiroId, setBarbeiroId, limparBarbeiroId } = useAuth();
  const ehAdmin = usuario.role === "Admin";

  const [barbeiroId, setBarbeiroIdState] = useState(ehAdmin ? null : getBarbeiroId());
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [atualizandoId, setAtualizandoId] = useState(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    setErro("");
    const requisicao = ehAdmin ? listarAgendamentos() : listarAgendamentosPorBarbeiro(barbeiroId);

    requisicao
      .then(setAgendamentos)
      .catch(() => setErro("Não foi possível carregar os agendamentos."))
      .finally(() => setCarregando(false));
  }, [ehAdmin, barbeiroId]);

  useEffect(() => {
    if (ehAdmin || barbeiroId) carregar();
  }, [ehAdmin, barbeiroId, carregar]);

  function handleSelecionarPerfil(id) {
    setBarbeiroId(id);
    setBarbeiroIdState(id);
  }

  function handleTrocarPerfil() {
    limparBarbeiroId();
    setBarbeiroIdState(null);
    setAgendamentos([]);
  }

  async function handleAtualizarStatus(id, novoStatus) {
    setAtualizandoId(id);
    setErro("");
    setSucesso("");
    try {
      await atualizarStatus(id, novoStatus);
      setSucesso("Agendamento atualizado com sucesso.");
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível atualizar este agendamento.");
    } finally {
      setAtualizandoId(null);
    }
  }

  async function handleCancelar(id) {
    setAtualizandoId(id);
    setErro("");
    setSucesso("");
    try {
      await cancelarAgendamento(id);
      setSucesso("Agendamento cancelado.");
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível cancelar este agendamento.");
    } finally {
      setAtualizandoId(null);
    }
  }

  if (!ehAdmin && !barbeiroId) {
    return <SelecionarPerfil onSelecionar={handleSelecionarPerfil} />;
  }

  function renderAcoes(agendamento) {
    const status = normalizarStatus(agendamento.status);
    const carregandoEsse = atualizandoId === agendamento.id;

    if (status === STATUS.AGENDADO) {
      return (
        <>
          <button
            className="btn btn-green btn-sm"
            disabled={carregandoEsse}
            onClick={() => handleAtualizarStatus(agendamento.id, STATUS.CONFIRMADO)}
          >
            <FiCheckCircle size={14} /> Confirmar
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={carregandoEsse}
            onClick={() => handleCancelar(agendamento.id)}
          >
            <FiXCircle size={14} /> Cancelar
          </button>
        </>
      );
    }

    if (status === STATUS.CONFIRMADO) {
      return (
        <>
          <button
            className="btn btn-green btn-sm"
            disabled={carregandoEsse}
            onClick={() => handleAtualizarStatus(agendamento.id, STATUS.CONCLUIDO)}
          >
            <FiCheck size={14} /> Concluir
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={carregandoEsse}
            onClick={() => handleCancelar(agendamento.id)}
          >
            <FiXCircle size={14} /> Cancelar
          </button>
        </>
      );
    }

    return null;
  }

  return (
    <div className="container section-tight">
      <div className="row-between" style={{ marginBottom: 24 }}>
        <div>
          <span className="eyebrow">{ehAdmin ? "Painel administrativo" : "Painel do barbeiro"}</span>
          <h2 style={{ margin: 0 }}>Validar agendamentos</h2>
        </div>
        <div className="row">
          <button className="btn btn-secondary btn-sm" onClick={carregar}>
            <FiRefreshCw size={14} /> Atualizar
          </button>
          {!ehAdmin && (
            <button className="btn btn-ghost btn-sm" onClick={handleTrocarPerfil}>
              Trocar perfil
            </button>
          )}
        </div>
      </div>

      <Alert type="error">{erro}</Alert>
      <Alert type="success">{sucesso}</Alert>

      {carregando ? (
        <Loading />
      ) : agendamentos.length === 0 ? (
        <EmptyState
          title="Nenhum agendamento por aqui"
          description="Quando um cliente agendar, ele aparecerá nesta lista."
        />
      ) : (
        <div className="grid grid-3">
          {agendamentos.map((a) => (
            <AppointmentCard key={a.id} agendamento={a} perspectiva="barbeiro" actions={renderAcoes(a)} />
          ))}
        </div>
      )}
    </div>
  );
}
