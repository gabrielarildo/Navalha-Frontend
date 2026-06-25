import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiRazor } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const usuarioLogado = await entrar(email, senha);
      const destinoPadrao = usuarioLogado.role === "Cliente" ? "/cliente" : "/barbeiro";
      navigate(location.state?.from?.pathname || destinoPadrao, { replace: true });
    } catch (err) {
      // Validar Credencial -> Exibir Erro
      setErro(err.response?.data?.message || "E-mail ou senha inválidos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__brand">
        <div className="row">
          <GiRazor size={32} />
          <h2 style={{ margin: 0 }}>Navalha</h2>
        </div>
        <p style={{ maxWidth: 360 }}>
          Faça login para acompanhar seus agendamentos ou para gerenciar a agenda da barbearia.
        </p>
        <div className="barber-stripe" style={{ maxWidth: 200 }} />
      </div>

      <div className="auth-shell__form">
        <form className="auth-card stack" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Acesso</span>
            <h2 style={{ margin: 0 }}>Entrar na sua conta</h2>
          </div>

          <Alert type="error">{erro}</Alert>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={enviando}>
            <FiLogIn /> {enviando ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center" style={{ marginTop: 8 }}>
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
