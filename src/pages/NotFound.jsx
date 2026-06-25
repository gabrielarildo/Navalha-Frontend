import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container section text-center">
      <span className="eyebrow">Erro 404</span>
      <h2>Essa página não existe na barbearia.</h2>
      <p>O endereço que você acessou não foi encontrado.</p>
      <Link to="/" className="btn btn-primary">
        Voltar ao início
      </Link>
    </div>
  );
}
