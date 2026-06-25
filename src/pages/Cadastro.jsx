import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiRazor } from "react-icons/gi";
import { FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { criarCliente } from "../services/clienteService";
import Alert from "../components/Alert";

export default function Cadastro() {
  const { cadastrar, entrar, setClienteId } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      // 1) Cria a conta de acesso (Usuario, role Cliente)
      await cadastrar({ nome: form.nome, email: form.email, senha: form.senha, role: "Cliente" });

      // 2) Cria o registro de Cliente (usado nos agendamentos)
      const cliente = await criarCliente({
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
      });

      // 3) Loga automaticamente e vincula o Cliente criado ao usuário
      const usuarioLogado = await entrar(form.email, form.senha);
      if (usuarioLogado.role === "Cliente") setClienteId(cliente.id);

      navigate("/cliente", { replace: true });
    } catch (err) {
      setErro(
        err.response?.data?.message ||
          Object.values(err.response?.data?.errors || {})[0]?.[0] ||
          "Não foi possível concluir o cadastro. Verifique os dados informados."
      );
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
          Crie sua conta de cliente para agendar cortes, acompanhar seu histórico e cancelar
          quando precisar.
        </p>
        <div className="barber-stripe" style={{ maxWidth: 200 }} />
      </div>

      <div className="auth-shell__form">
        <form className="auth-card stack" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Novo por aqui?</span>
            <h2 style={{ margin: 0 }}>Criar minha conta</h2>
          </div>

          <Alert type="error">{erro}</Alert>

          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              required
              minLength={3}
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => atualizar("email", e.target.value)}
              placeholder="voce@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              required
              value={form.telefone}
              onChange={(e) => atualizar("telefone", e.target.value)}
              placeholder="(14) 99999-0000"
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={form.senha}
              onChange={(e) => atualizar("senha", e.target.value)}
              placeholder="Mínimo de 8 caracteres"
            />
            <span className="field-hint">Entre 8 e 16 caracteres.</span>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={enviando}>
            <FiUserPlus /> {enviando ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="text-center" style={{ marginTop: 8 }}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
