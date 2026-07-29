import { useState, useRef, useCallback, useEffect } from "react";
import { analizarProductoConIA } from "../api/tienda";

const CAMERA_ID = "product-analysis-camera";

const POSICIONES = [
  { index: 0, label: "Parte frontal", instruccion: "Muestra la parte frontal del producto" },
  { index: 1, label: "Parte trasera", instruccion: "Voltea el producto y muestra la parte trasera" },
  { index: 2, label: "Lado izquierdo", instruccion: "Muestra el lado izquierdo del producto" },
  { index: 3, label: "Lado derecho", instruccion: "Muestra el lado derecho del producto" },
];

const MENSAJES_DINAMICOS = [
  "Coloca el producto frente a la cámara",
  "Asegúrate de que el producto esté bien iluminado",
  "Enfoca bien el producto",
  "Verifica que se vea completo en el marco",
];

export default function useProductAnalysis() {
  const [estado, setEstado] = useState("iniciando"); // iniciando | capturando | confirmando | procesando | completado | error
  const [fotos, setFotos] = useState([null, null, null, null]);
  const [posicionActual, setPosicionActual] = useState(0);
  const [fotoPendiente, setFotoPendiente] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [mensajeActual, setMensajeActual] = useState("");
  const [resultadoIA, setResultadoIA] = useState(null);
  const [error, setError] = useState(null);
  const [camaraActiva, setCamaraActiva] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fotosRef = useRef([null, null, null, null]);
  const posicionRef = useRef(0);
  const intervaloMsgRef = useRef(null);

  useEffect(() => {
    return () => {
      detenerTodo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detenerTodo = () => {
    if (intervaloMsgRef.current) { clearInterval(intervaloMsgRef.current); intervaloMsgRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.parentNode) {
      try { videoRef.current.parentNode.removeChild(videoRef.current); } catch (e) {}
    }
    videoRef.current = null;
    setCamaraActiva(false);
  };

  const iniciarCamara = useCallback(async () => {
    try {
      detenerTodo();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;

      const container = document.getElementById(CAMERA_ID);
      if (!container) {
        throw new Error("Contenedor de cámara no encontrado");
      }

      container.innerHTML = "";
      const video = document.createElement("video");
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.muted = true;
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      container.appendChild(video);

      await video.play();
      videoRef.current = video;

      setCamaraActiva(true);
      setEstado("capturando");

      // Mensajes dinámicos
      if (intervaloMsgRef.current) clearInterval(intervaloMsgRef.current);
      setMensajeActual(MENSAJES_DINAMICOS[0]);
      let idx = 0;
      intervaloMsgRef.current = setInterval(() => {
        idx = (idx + 1) % MENSAJES_DINAMICOS.length;
        setMensajeActual(MENSAJES_DINAMICOS[idx]);
      }, 3000);

      // NO auto-captura: el usuario presiona el botón manualmente
      setMensajeActual(`Posición ${posicionRef.current + 1}: ${POSICIONES[posicionRef.current].instruccion}`);
    } catch (err) {
      console.error("Error cámara:", err);
      setError(err.message || "No se pudo acceder a la cámara. Verifica los permisos.");
      setEstado("error");
    }
  }, []);

  const capturarFrame = (calidad = 0.6) => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    try {
      const canvas = document.createElement("canvas");
      // Reducir resolución para enviar menos datos a Gemini
      const MAX_W = 640;
      const MAX_H = 480;
      let w = video.videoWidth;
      let h = video.videoHeight;
      if (w > MAX_W || h > MAX_H) {
        const ratio = Math.min(MAX_W / w, MAX_H / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);
      // Usar JPEG con calidad 0.6 en vez de PNG (mucho más pequeño)
      return canvas.toDataURL("image/jpeg", calidad);
    } catch (e) {
      return null;
    }
  };

  /** El usuario presiona "Capturar" → toma la foto de la posición actual */
  const capturar = useCallback(() => {
    const foto = capturarFrame();
    if (!foto) return;
    setFotoPendiente(foto);
    setEstado("confirmando");
  }, []);

  /** El usuario confirmó la foto → se guarda y se avanza a la siguiente posición */
  const confirmarFoto = useCallback(() => {
    const foto = fotoPendiente;
    if (!foto) return;

    const pos = posicionRef.current;
    const nuevasFotos = [...fotosRef.current];
    nuevasFotos[pos] = foto;
    fotosRef.current = nuevasFotos;
    setFotos(nuevasFotos);
    setFotoPendiente(null);

    const siguientePos = pos + 1;

    if (siguientePos >= POSICIONES.length) {
      // Ya tenemos las 4 fotos → enviar a IA
      setEstado("procesando");
      setMensajeActual("Enviando imágenes a inteligencia artificial...");
      setProgreso(50);
      enviarAIAnalisis(nuevasFotos);
    } else {
      // Avanzar a la siguiente posición
      posicionRef.current = siguientePos;
      setPosicionActual(siguientePos);
      setProgreso((siguientePos / POSICIONES.length) * 50);
      setEstado("capturando");
      setMensajeActual(`Posición ${siguientePos + 1}: ${POSICIONES[siguientePos].instruccion}`);
    }
  }, [fotoPendiente]);

  /** El usuario quiere volver a tomar la foto actual */
  const recapturar = useCallback(() => {
    setFotoPendiente(null);
    setEstado("capturando");
  }, []);

  const enviarAIAnalisis = async (fotosArray) => {
    try {
      const validas = fotosArray.filter((f) => f !== null);
      if (validas.length === 0) throw new Error("No se capturaron imágenes");
      const resultado = await analizarProductoConIA(validas);
      setResultadoIA(resultado);
      setProgreso(100);
      setEstado("completado");
    } catch (err) {
      console.error("Error IA:", err);
      setError(err.message || "Error al analizar el producto con IA");
      setEstado("error");
    } finally {
      if (intervaloMsgRef.current) clearInterval(intervaloMsgRef.current);
    }
  };

  const iniciar = useCallback(async () => {
    setEstado("iniciando");
    setError(null);
    setFotos([null, null, null, null]);
    setPosicionActual(0);
    setProgreso(0);
    setResultadoIA(null);
    setFotoPendiente(null);
    fotosRef.current = [null, null, null, null];
    posicionRef.current = 0;
    await iniciarCamara();
  }, [iniciarCamara]);

  const reiniciar = useCallback(async () => {
    detenerTodo();
    await iniciar();
  }, [iniciar]);

  const limpiar = useCallback(async () => {
    detenerTodo();
  }, []);

  const detenerCamara = useCallback(async () => {
    detenerTodo();
  }, []);

  return {
    estado, fotos, posicionActual, fotoPendiente,
    progreso, mensajeActual, resultadoIA,
    error, camaraActiva,
    videoRef,
    iniciar, reiniciar, limpiar, detenerCamara,
    capturar, confirmarFoto, recapturar,
    POSICIONES,
    posicionInfo: POSICIONES[posicionActual] || POSICIONES[0],
  };
}
