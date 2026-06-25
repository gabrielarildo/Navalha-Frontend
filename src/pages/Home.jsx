import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiRazor } from "react-icons/gi";
import { FiCalendar, FiScissors, FiCheckCircle } from "react-icons/fi";
import { listarServicos } from "../services/servicoService";
import ServiceTicket from "../components/ServiceTicket";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { estaLogado, usuario } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarServicos()
      .then((dados) => setServicos(dados.filter((s) => s.ativo)))
      .finally(() => setCarregando(false));
  }, []);

  const painelHref = usuario?.role === "Cliente" ? "/cliente" : "/barbeiro";

  return (
    <>
      <section className="container hero">
        <div>
          <span className="eyebrow">Barbearia desde sempre, no seu horário</span>
          <h1>
            Tradição na navalha,
            <br />
            estilo no detalhe.
          </h1>
          <p style={{ fontSize: "1.05rem", maxWidth: 480 }}>
            Escolha o serviço, o barbeiro e o horário — a Navalha cuida do resto. Agendamento
            simples, histórico do seu corte e confirmação na hora.
          </p>
          <div className="barber-stripe animated" style={{ maxWidth: 220, marginBottom: 28 }} />
          <div className="hero__cta">
            {!estaLogado && (
              <>
                <Link to="/cadastro" className="btn btn-primary">
                  <FiCalendar /> Agendar meu horário
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Já tenho conta
                </Link>
              </>
            )}
            {estaLogado && (
              <Link to={painelHref} className="btn btn-primary">
                <FiCalendar /> Ir para o meu painel
              </Link>
            )}
          </div>
        </div>

        <div className="hero__panel">
          <div className="row" style={{ marginBottom: 16 }}>
            <GiRazor size={22} />
            <strong>Como funciona</strong>
          </div>
          <div className="hero__panel-row">
            <span className="text-muted">1. Escolha o serviço</span>
            <FiScissors />
          </div>
          <div className="hero__panel-row">
            <span className="text-muted">2. Escolha barbeiro e horário livre</span>
            <FiCalendar />
          </div>
          <div className="hero__panel-row">
            <span className="text-muted">3. Acompanhe a confirmação</span>
            <FiCheckCircle />
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="row-between" style={{ marginBottom: 28 }}>
          <div>
            <span className="eyebrow">Tabela de preços</span>
            <h2 style={{ margin: 0 }}>Nossos serviços</h2>
          </div>
        </div>

        {carregando ? (
          <Loading label="Carregando serviços..." />
        ) : (
          <div className="grid grid-3">
            {servicos.map((servico) => (
              <ServiceTicket key={servico.id} servico={servico} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
