import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiXCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { listarClientes, criarCliente, buscarHistoricoCliente } from "../../services/clienteService";
import { cancelarAgendamento, normalizarStatus, STATUS } from "../../services/agendamentoService";
import AppointmentCard from "../../components/AppointmentCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import Alert from "../../components/Alert";

export default function ClienteDashboard() {
  const { usuario, getClienteId, setClienteId } = useAuth();

  const [clienteId, setClienteIdState] = useState(getClienteId());
  const [resolvendoPerfil, setResolvendoPerfil] = useState(!clienteId);
  const [telefone, setTelefone] = useState("");
  const [erroPerfil, setErroPerfil] = useState("");

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);

  // Resolve o vínculo Usuario -> Cliente: primeiro tenta achar um Cliente já
  // cadastrado com o mesmo e-mail; se não existir, pede o telefone para criar um.
  const resolverPerfilCliente = useCallback(async () => {
    setResolvendoPerfil(true);
    try {
      const clientes = await listarClientes();
      const encontrado = clientes.find((c) => c.email?.toLowerCase() === usuario.email.toLowerCase());
      if (encontrado) {
        setClienteId(encontrado.id);
        setClienteIdState(encontrado.id);
      }
    } finally {
      setResolvendoPerfil(false);
    }
  }, [usuario, setClienteId]);

  useEffect(() => {
    if (!clienteId) resolverPerfilCliente();
  }, [clienteId, resolverPerfilCliente]);

  const carregarHistorico = useCallback(() => {
    if (!clienteId) return;
    setCarregando(true);
    setErro("");
    buscarHistoricoCliente(clienteId)
      .then(setAgendamentos)
      .catch(() => setErro("Não foi possível carregar seus agendamentos."))
      .finally(() => setCarregando(false));
  }, [clienteId]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  async function handleCriarPerfilCliente(e) {
    e.preventDefault();
    setErroPerfil("");
    try {
      const cliente = await criarCliente({ nome: usuario.nome, telefone, email: usuario.email });
      setClienteId(cliente.id);
      setClienteIdState(cliente.id);
    } catch (err) {
      setErroPerfil(err.response?.data?.message || "Não foi possível concluir seu cadastro de cliente.");
    }
  }

  async function handleCancelar(id) {
    setCancelandoId(id);
    setErro("");
    setSucesso("");
    try {
      await cancelarAgendamento(id);
      setSucesso("Agendamento cancelado com sucesso.");
      carregarHistorico();
    } catch (err) {
      setErro(err.response?.data?.message || "Não foi possível cancelar este agendamento.");
    } finally {
      setCancelandoId(null);
    }
  }

  // Perfil de cliente ainda não vinculado: precisa completar telefone para criar o registro
  if (!clienteId) {
    if (resolvendoPerfil) return <Loading label="Carregando seu perfil..." />;

    return (
      <div className="container section-tight" style={{ maxWidth: 480 }}>
        <span className="eyebrow">Quase lá</span>
        <h2>Complete seu cadastro de cliente</h2>
        <p>Encontramos sua conta, mas precisamos do seu telefone para liberar os agendamentos.</p>
        <Alert type="error">{erroPerfil}</Alert>
        <form className="card stack" onSubmit={handleCriarPerfilCliente}>
          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(14) 99999-0000"
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Concluir cadastro
          </button>
        </form>
      </div>
    );
  }

  const podeCancelar = (a) =>
    [STATUS.AGENDADO, STATUS.CONFIRMADO].includes(normalizarStatus(a.status)) &&
    new Date(a.dataHora) > new Date();

  return (
    <div className="container section-tight">
      <div className="row-between" style={{ marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Painel do cliente</span>
          <h2 style={{ margin: 0 }}>Meus agendamentos</h2>
        </div>
        <Link to="/cliente/novo-agendamento" className="btn btn-primary">
          <FiPlus /> Novo agendamento
        </Link>
      </div>

      <Alert type="error">{erro}</Alert>
      <Alert type="success">{sucesso}</Alert>

      {carregando ? (
        <Loading />
      ) : agendamentos.length === 0 ? (
        <EmptyState
          title="Você ainda não tem agendamentos"
          description="Que tal marcar seu próximo corte agora?"
          action={
            <Link to="/cliente/novo-agendamento" className="btn btn-primary">
              <FiPlus /> Agendar horário
            </Link>
          }
        />
      ) : (
        <div className="grid grid-3">
          {agendamentos.map((a) => (
            <AppointmentCard
              key={a.id}
              agendamento={a}
              perspectiva="cliente"
              actions={
                podeCancelar(a) && (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={cancelandoId === a.id}
                    onClick={() => handleCancelar(a.id)}
                  >
                    <FiXCircle size={14} /> {cancelandoId === a.id ? "Cancelando..." : "Cancelar"}
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
