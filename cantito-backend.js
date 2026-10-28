(function () {
  const cfg = window.CANTITO_CONFIG || {};
  const hasFB = !!(cfg.firebase && cfg.firebase.apiKey);
  const V = 'https://www.gstatic.com/firebasejs/10.12.2/';
  let fbP = null;
  const fb = () => fbP || (fbP = Promise.all([import(V + 'firebase-app.js'), import(V + 'firebase-auth.js'), import(V + 'firebase-firestore.js')])
    .then(([app, A, F]) => { const a = app.initializeApp(cfg.firebase); return { app: a, auth: A.getAuth(a), db: F.getFirestore(a), A, F }; }));
  let stP = null;
  const st = () => stP || (stP = Promise.all([fb(), import(V + 'firebase-storage.js')]).then(([f, S]) => ({ storage: S.getStorage(f.app), S })));
  const LS = { fams: 'cantito.w.families', auth: 'cantito.w.auth', session: 'cantito.w.session', events: 'cantito.w.events', songs: 'cantito.w.songs' };
  const rd = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const clean = o => JSON.parse(JSON.stringify(o));
  const ERR = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Entra con «Ya tengo cuenta».',
    'auth/invalid-email': 'Revisa el correo.', 'auth/weak-password': 'La contraseña es muy débil.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/wrong-password': 'Correo o contraseña incorrectos.', 'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.', 'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
    'auth/requires-recent-login': 'Por seguridad, cierra sesión, vuelve a entrar e inténtalo de nuevo.', 'local/not-admin': 'Ese correo no tiene acceso al panel.',
    'storage/unauthorized': 'Sin permiso para subir audios. Revisa las reglas de Storage y tu correo de administrador.',
    'storage/quota-exceeded': 'Se superó la cuota de almacenamiento.', 'storage/unknown': 'Storage no está activado. Revisa el paso 4 de la guía.',
    'permission-denied': 'Sin permiso. Revisa las reglas de Firestore.', 'local/quota': 'No hay espacio en este navegador para más audios de prueba.',
  };
  const fail = code => { const e = new Error(code); e.code = code; return e; };
  const msg = e => ERR[e && e.code] || ERR[e && e.code && e.code.replace('firestore/', '')] || 'Algo salió mal. Inténtalo de nuevo.';
  async function hash(s) {
    try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
    catch (e) { return btoa(unescape(encodeURIComponent(s))); }
  }
  const authUser = ({ auth, A }) => new Promise(res => { const un = A.onAuthStateChanged(auth, u => { un(); res(u); }); });
  const isAdmin = email => !!email && (cfg.admins || []).map(x => x.toLowerCase()).includes(email.toLowerCase());

  // Audios en modo de prueba: IndexedDB del navegador
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open('cantito-audio', 1); r.onupgradeneeded = () => r.result.createObjectStore('a'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbDo = (mode, fn) => idb().then(db => new Promise((res, rej) => { const tx = db.transaction('a', mode); const r = fn(tx.objectStore('a')); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(fail('local/quota')); }));
  const urlCache = {};

  const api = {
    mode: hasFB ? 'firebase' : 'local', msg, isAdmin,
    async currentFamily() {
      if (!hasFB) { const id = rd(LS.session, null); return id ? (rd(LS.fams, {})[id] || null) : null; }
      const f = await fb(); const u = await authUser(f); if (!u) return null;
      const s = await f.F.getDoc(f.F.doc(f.db, 'families', u.uid)); return s.exists() ? s.data() : null;
    },
    async signUp(email, pass, data) {
      email = email.trim().toLowerCase();
      if (!hasFB) {
        const au = rd(LS.auth, {}); if (au[email]) throw fail('auth/email-already-in-use');
        const id = 'loc-' + Date.now().toString(36); au[email] = { id, h: await hash(pass) }; wr(LS.auth, au);
        const fam = { ...data, id, email, reg: Date.now() }; const fs = rd(LS.fams, {}); fs[id] = fam; wr(LS.fams, fs); wr(LS.session, id); return fam;
      }
      const f = await fb(); const c = await f.A.createUserWithEmailAndPassword(f.auth, email, pass);
      const fam = clean({ ...data, id: c.user.uid, email, reg: Date.now() });
      await f.F.setDoc(f.F.doc(f.db, 'families', c.user.uid), fam); return fam;
    },
    async signIn(email, pass) {
      email = email.trim().toLowerCase();
      if (!hasFB) {
        const a = rd(LS.auth, {})[email]; if (!a || a.h !== await hash(pass)) throw fail('auth/invalid-credential');
        wr(LS.session, a.id); return rd(LS.fams, {})[a.id];
      }
      const f = await fb(); const c = await f.A.signInWithEmailAndPassword(f.auth, email, pass);
      const s = await f.F.getDoc(f.F.doc(f.db, 'families', c.user.uid)); return s.exists() ? s.data() : null;
    },
    async signOut() { if (!hasFB) return wr(LS.session, null); const f = await fb(); await f.A.signOut(f.auth); },
    async resetPassword(email) { if (!hasFB) throw fail('local/offline'); const f = await fb(); f.auth.languageCode = 'es'; await f.A.sendPasswordResetEmail(f.auth, email.trim()); },
    async saveFamily(fam) {
      if (!hasFB) { const fs = rd(LS.fams, {}); fs[fam.id] = fam; wr(LS.fams, fs); return; }
      const f = await fb(); await f.F.setDoc(f.F.doc(f.db, 'families', fam.id), clean(fam));
    },
    logEvent(fam, ev) {
      if (!fam || (fam.usage === false && !['register', 'survey'].includes(ev.type))) return;
      const e = clean({ ...ev, t: Date.now(), fam: fam.id, uid: fam.id });
      if (!hasFB) { const a = rd(LS.events, []); a.push(e); wr(LS.events, a.slice(-5000)); return; }
      fb().then(f => f.F.addDoc(f.F.collection(f.db, 'events'), e)).catch(() => {});
    },
    async deleteAccount(fam) {
      if (!hasFB) { const fs = rd(LS.fams, {}); delete fs[fam.id]; wr(LS.fams, fs); const au = rd(LS.auth, {}); delete au[fam.email]; wr(LS.auth, au); wr(LS.session, null); return; }
      const f = await fb(); await f.F.deleteDoc(f.F.doc(f.db, 'families', fam.id)); await f.A.deleteUser(f.auth.currentUser);
    },

    // Canciones
    async listSongs(all) {
      const seed = (window.CANTITO_SEED || []).map(s => ({ ...s }));
      let out;
      if (!hasFB) { const o = rd(LS.songs, null); out = o ? Object.values(o) : seed; }
      else {
        const f = await fb(); const col = f.F.collection(f.db, 'songs');
        const snap = await f.F.getDocs(all ? col : f.F.query(col, f.F.where('published', '==', true)));
        out = []; snap.forEach(d => out.push(d.data()));
        if (!out.length && !(await api.songsInitialized())) out = seed;
      }
      return all ? out : out.filter(x => x.published && x.audioUrl);
    },
    async songsInitialized() {
      if (!hasFB) return !!rd(LS.songs, null);
      try { const f = await fb(); return (await f.F.getDoc(f.F.doc(f.db, 'meta', 'songs'))).exists(); } catch (e) { return false; }
    },
    async ensureSeeded() {
      if (await api.songsInitialized()) return;
      const seed = window.CANTITO_SEED || [];
      if (!hasFB) { const o = {}; seed.forEach(s => o[s.id] = s); wr(LS.songs, o); return; }
      const f = await fb();
      for (const s of seed) await f.F.setDoc(f.F.doc(f.db, 'songs', s.id), clean(s));
      await f.F.setDoc(f.F.doc(f.db, 'meta', 'songs'), { t: Date.now() });
    },
    async saveSong(song) {
      await api.ensureSeeded();
      if (!hasFB) { const o = rd(LS.songs, {}); o[song.id] = song; wr(LS.songs, o); return; }
      const f = await fb(); await f.F.setDoc(f.F.doc(f.db, 'songs', song.id), clean(song));
    },
    async deleteSong(song) {
      await api.ensureSeeded();
      if (song.audioPath) await api.deleteAudio(song.audioPath).catch(() => {});
      if (!hasFB) { const o = rd(LS.songs, {}); delete o[song.id]; wr(LS.songs, o); return; }
      const f = await fb(); await f.F.deleteDoc(f.F.doc(f.db, 'songs', song.id));
    },
    async uploadAudio(id, file, onProgress) {
      if (!hasFB) {
        const key = 'a-' + id + '-' + Date.now(); await idbDo('readwrite', s => s.put(file, key)); onProgress && onProgress(100);
        return { url: 'idb:' + key, path: 'idb:' + key };
      }
      const { storage, S } = await st(); const path = 'audio/' + id + '-' + Date.now() + '.mp3'; const r = S.ref(storage, path);
      await new Promise((res, rej) => {
        const task = S.uploadBytesResumable(r, file, { contentType: file.type || 'audio/mpeg', cacheControl: 'public, max-age=31536000' });
        task.on('state_changed', s => onProgress && onProgress(Math.round(s.bytesTransferred / s.totalBytes * 100)), rej, res);
      });
      return { url: await S.getDownloadURL(r), path };
    },
    async deleteAudio(path) {
      if (!path) return;
      if (path.startsWith('idb:')) return idbDo('readwrite', s => s.delete(path.slice(4)));
      const { storage, S } = await st(); await S.deleteObject(S.ref(storage, path));
    },
    async resolveAudio(url) {
      if (!url || !url.startsWith('idb:')) return url;
      if (urlCache[url]) return urlCache[url];
      const blob = await idbDo('readonly', s => s.get(url.slice(4)));
      return blob ? (urlCache[url] = URL.createObjectURL(blob)) : '';
    },

    async adminCurrent() { if (!hasFB) return 'local'; const f = await fb(); const u = await authUser(f); return u && isAdmin(u.email) ? u.email : null; },
    async adminSignIn(email, pass) {
      if (!isAdmin(email)) throw fail('local/not-admin');
      const f = await fb(); await f.A.signInWithEmailAndPassword(f.auth, email.trim(), pass);
    },
    async adminLoad() {
      if (!hasFB) return { families: Object.values(rd(LS.fams, {})), events: rd(LS.events, []) };
      const f = await fb();
      const [fs, es] = await Promise.all([f.F.getDocs(f.F.collection(f.db, 'families')), f.F.getDocs(f.F.collection(f.db, 'events'))]);
      const families = [], events = []; fs.forEach(d => families.push(d.data())); es.forEach(d => events.push(d.data()));
      return { families, events };
    },
  };
  window.CantitoBackend = api;
})();
