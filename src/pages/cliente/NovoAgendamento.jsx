import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { listarServicos } from "../../services/servicoService";
import { listarBarbeiros, buscarHorariosDisponiveis } from "../../services/barbeiroService";
import { criarAgendamento } from "../../services/agendamentoService";
import ServiceTicket from "../../components/ServiceTicket";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import { formatarHorario, combinarDataHorario, hojeISO } from "../../utils/format";

export default function NovoAgendamento() {
  const { getClienteId } = useAuth();
  const navigate = useNavigate();
  const clienteId = getClienteId();

  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [carregandoBase, setCarregandoBase] = useState(true);

  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [data, setData] = useState(hojeISO());
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [observacoes, setObservacoes] = useState("");

  const [horarios, setHorarios] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    Promise.all([listarServicos(), listarBarbeiros()])
      .then(([s, b]) => {
        setServicos(s.filter((x) => x.ativo));
        setBarbeiros(b.filter((x) => x.ativo));
      })
      .finally(() => setCarregandoBase(false));
  }, []);

  const carregarHorarios = useCallback(() => {
    if (!barbeiroSelecionado || !data) return;
    setCarregandoHorarios(true);
    setHorarioSelecionado(null);
    buscarHorariosDisponiveis(barbeiroSelecionado.id, data)
      .then(setHorarios)
      .catch(() => setErro("Não foi possível consultar os horários disponíveis."))
      .finally(() => setCarregandoHorarios(false));
  }, [barbeiroSelecionado, data]);

  useEffect(() => {
    carregarHorarios();
  }, [carregarHorarios]);

  if (!clienteId) {
    return (
      <div className="container section-tight text-center">
        <p>Precisamos confirmar seu cadastro de cliente antes de agendar.</p>
        <Link to="/cliente" className="btn btn-primary">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  const podeConfirmar = servicoSelecionado && barbeiroSelecionado && data && horarioSelecionado;

  async function handleConfirmar() {
    setErro("");
    setEnviando(true);
    try {
      await criarAgendamento({
        clienteId,
        barbeiroId: barbeiroSelecionado.id,
        servicoId: servicoSelecionado.id,
        dataHora: combinarDataHorario(data, formatarHorario(horarioSelecionado.horario)),
        observacoes,
      });
      navigate("/cliente", { replace: true });
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível criar o agendamento.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container section-tight">
      <span className="eyebrow">Registrar agendamento</span>
      <h2>Marque seu horário</h2>

      <Alert type="error">{erro}</Alert>

      {carregandoBase ? (
        <Loading />
      ) : (
        <div className="stack" style={{ gap: 36 }}>
          <div>
            <h4>1. Escolha o serviço</h4>
            <div className="grid grid-3">
              {servicos.map((s) => (
                <ServiceTicket
                  key={s.id}
                  servico={s}
                  selected={servicoSelecionado?.id === s.id}
                  onSelect={setServicoSelecionado}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              opacity: servicoSelecionado ? 1 : 0.4,
              pointerEvents: servicoSelecionado ? "auto" : "none",
            }}
          >
            <h4>2. Escolha o barbeiro</h4>
            <div className="grid grid-3">
              {barbeiros.map((b) => (
                <div
                  key={b.id}
                  className={`pick-card ${barbeiroSelecionado?.id === b.id ? "selected" : ""}`}
                  onClick={() => setBarbeiroSelecionado(b)}
                >
                  <strong>{b.nome}</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
                    {b.especialidade || "Barbeiro Navalha"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              opacity: barbeiroSelecionado ? 1 : 0.4,
              pointerEvents: barbeiroSelecionado ? "auto" : "none",
            }}
          >
            <h4>3. Escolha a data e o horário</h4>
            <div className="field" style={{ maxWidth: 220 }}>
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="date"
                min={hojeISO()}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {carregandoHorarios ? (
              <Loading label="Consultando horários disponíveis..." />
            ) : (
              <div className="slot-grid">
                {horarios.map((h) => (
                  <button
                    key={h.horario}
                    type="button"
                    disabled={!h.disponivel}
                    className={`slot-btn ${horarioSelecionado?.horario === h.horario ? "selected" : ""}`}
                    onClick={() => setHorarioSelecionado(h)}
                  >
                    {formatarHorario(h.horario)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              opacity: horarioSelecionado ? 1 : 0.4,
              pointerEvents: horarioSelecionado ? "auto" : "none",
            }}
          >
            <h4>4. Observações (opcional)</h4>
            <div className="field">
              <textarea
                maxLength={300}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma preferência para o seu corte?"
              />
            </div>

            <button
              className="btn btn-primary"
              disabled={!podeConfirmar || enviando}
              onClick={handleConfirmar}
            >
              <FiCheck /> {enviando ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
