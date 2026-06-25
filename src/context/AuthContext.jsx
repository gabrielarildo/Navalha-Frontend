import { createContext, useContext, useState, useCallback } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "navalha_token";
const USER_KEY = "navalha_usuario";

function linkKey(tipo, usuarioId) {
  return `navalha_${tipo}_link_${usuarioId}`;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const persistirSessao = useCallback((token, usuarioLogado) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
  }, []);

  const entrar = useCallback(
    async (email, senha) => {
      const { token, usuario: usuarioLogado } = await authService.login({ email, senha });
      persistirSessao(token, usuarioLogado);
      return usuarioLogado;
    },
    [persistirSessao]
  );

  const cadastrar = useCallback(async ({ nome, email, senha, role }) => {
    return authService.registrarUsuario({ nome, email, senha, role });
  }, []);

  const sair = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }, []);

  // Como Usuario (login) e Cliente/Barbeiro (cadastro operacional) são entidades
  // separadas na API, guardamos localmente o vínculo entre o usuário logado e o
  // respectivo registro de Cliente ou Barbeiro escolhido/criado por ele.
  const getClienteId = useCallback(
    () => (usuario ? localStorage.getItem(linkKey("cliente", usuario.id)) : null),
    [usuario]
  );
  const setClienteId = useCallback(
    (clienteId) => usuario && localStorage.setItem(linkKey("cliente", usuario.id), clienteId),
    [usuario]
  );

  const getBarbeiroId = useCallback(
    () => (usuario ? localStorage.getItem(linkKey("barbeiro", usuario.id)) : null),
    [usuario]
  );
  const setBarbeiroId = useCallback(
    (barbeiroId) => usuario && localStorage.setItem(linkKey("barbeiro", usuario.id), barbeiroId),
    [usuario]
  );
  const limparBarbeiroId = useCallback(
    () => usuario && localStorage.removeItem(linkKey("barbeiro", usuario.id)),
    [usuario]
  );

  const value = {
    usuario,
    estaLogado: !!usuario,
    entrar,
    cadastrar,
    sair,
    getClienteId,
    setClienteId,
    getBarbeiroId,
    setBarbeiroId,
    limparBarbeiroId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
