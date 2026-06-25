import { Link, NavLink, useNavigate } from "react-router-dom";
import { GiRazor } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, estaLogado, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate("/login");
  }

  const painelHref = usuario?.role === "Cliente" ? "/cliente" : "/barbeiro";

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <GiRazor size={22} />
          Nav<span>alha</span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" className="navbar__link" end>
            Início
          </NavLink>

          {!estaLogado && (
            <>
              <NavLink to="/login" className="navbar__link">
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className="btn btn-primary btn-sm">
                Criar conta
              </NavLink>
            </>
          )}

          {estaLogado && (
            <>
              <NavLink to={painelHref} className="navbar__link">
                Meu painel
              </NavLink>
              <span className="navbar__link text-muted">Olá, {usuario.nome?.split(" ")[0]}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleSair}>
                <FiLogOut size={15} /> Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
