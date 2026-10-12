

/*
 * auth.js — autenticação e Firebase
 * Baseado na versão V11.1 do Aprendendo Idiomas.
 *
 * IMPORTANTE:
 * Este arquivo deve ser carregado como módulo JavaScript.
 */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Configuração original do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCN04zRe8H8tKFxl5Iwo3fhx7XSgswMwyA",
  authDomain: "aprendendo-japones.firebaseapp.com",
  projectId: "aprendendo-japones",
  storageBucket: "aprendendo-japones.firebasestorage.app",
  messagingSenderId: "323134572955",
  appId: "1:323134572955:web:3078e4b4fbed6b2c09393e",
  measurementId: "G-NGG2L0LFEB"
};

// Inicialização do Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Estado remoto do usuário
window.firebaseRemoteState = null;
window.firebaseRemoteStateLoaded = false;

// Carrega o progresso salvo na nuvem
async function loadRemoteStateForCurrentUser() {
  const uid = window.firebaseSync?.uid;

  if (!uid) {
    return null;
  }

  try {
    const ref = doc(firebaseDb, "users", uid);
    const snapshot = await getDoc(ref);

    window.firebaseRemoteState = snapshot.exists()
      ? snapshot.data()
      : null;

    window.firebaseRemoteStateLoaded = true;

    return window.firebaseRemoteState;
  } catch (error) {
    console.warn(
      "Falha ao carregar o progresso do Firebase.",
      error
    );

    window.firebaseRemoteState = null;
    window.firebaseRemoteStateLoaded = true;

    return null;
  }
}

// Interface de comunicação com o restante do site
window.firebaseSync = {
  uid: null,
  ready: false,
  user: null,

  async save(state, vnStateOverride = null) {
    if (!this.uid) {
      return;
    }

    try {
      const payload = {
        japanese: {
          score: state.score,
          answered: state.answered,
          correct: state.correct,
          lessonDone: state.lessonDone,
          kanaStatus: state.kanaStatus || {},
          speechRate: state.speechRate || 0.7
        },

        vietnamese:
          vnStateOverride || window.vnState || null,

        updatedAt: Date.now()
      };

      await setDoc(
        doc(firebaseDb, "users", this.uid),
        payload
      );
    } catch (error) {
      console.warn(
        "Falha ao sincronizar com o Firebase.",
        error
      );
    }
  },

  async signInGoogle() {
    const currentUser = firebaseAuth.currentUser;

    // Caso ainda não exista usuário autenticado
    if (!currentUser) {
      const result = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );

      this.user = result.user;
      this.uid = result.user.uid;
      this.ready = true;

      return result.user;
    }

    // Já está conectado a uma conta Google
    if (!currentUser.isAnonymous) {
      return currentUser;
    }

    // Tenta vincular a conta Google ao usuário anônimo
    try {
      const result = await linkWithPopup(
        currentUser,
        googleProvider
      );

      this.user = result.user;
      this.uid = result.user.uid;

      return result.user;
    } catch (error) {
      // A conta Google já existe: entrar nela
      if (
        error.code === "auth/credential-already-in-use" ||
        error.code ===
          "auth/account-exists-with-different-credential"
      ) {
        const result = await signInWithPopup(
          firebaseAuth,
          googleProvider
        );

        this.user = result.user;
        this.uid = result.user.uid;

        return result.user;
      }

      throw error;
    }
  }
};

// Aguarda a autenticação inicial
window.firebaseReady = new Promise((resolve) => {
  let resolved = false;

  onAuthStateChanged(
    firebaseAuth,
    async (user) => {
      if (!user) {
        // Cria uma sessão anônima se necessário
        if (!firebaseAuth.currentUser) {
          signInAnonymously(firebaseAuth).catch(
            (error) => {
              console.warn(
                "Falha na autenticação anônima do Firebase.",
                error
              );

              if (!resolved) {
                resolved = true;
                resolve(null);
              }
            }
          );
        }

        return;
      }

      window.firebaseSync.user = user;
      window.firebaseSync.uid = user.uid;

      await loadRemoteStateForCurrentUser();

      window.firebaseSync.ready = true;

      if (!resolved) {
        resolved = true;
        resolve(user);
      }

      // Atualiza a interface se a função já estiver disponível
      if (typeof window.updateProfileUI === "function") {
        window.updateProfileUI(user);
      }
    }
  );
});
