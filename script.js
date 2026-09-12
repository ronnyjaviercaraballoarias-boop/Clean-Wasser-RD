// ============================================================
// CONFIGURACIÓN DEL NEGOCIO — edita estos valores
// ============================================================
const BUSINESS_WHATSAPP = "18492038524"; // Número de WhatsApp del negocio
const BUSINESS_WHATSAPP_MESSAGE = "Hola, quisiera más información sobre los productos de CleanWasserRD";

// Clave de acceso de Web3Forms (servicio gratuito que envía el formulario a tu correo,
// sin necesidad de programar un backend). Regístrate gratis en https://web3forms.com,
// confirma tu correo y pega aquí la "Access Key" que te den.
const WEB3FORMS_ACCESS_KEY = "PON_AQUI_TU_ACCESS_KEY";

// ============================================================
// No es necesario tocar nada debajo de esta línea
// ============================================================

document.getElementById("year").textContent = new Date().getFullYear();

// --- Enlaces de WhatsApp (header, sección contacto y botón flotante) ---
const whatsappConfigured = BUSINESS_WHATSAPP.trim().length > 0;
const waLink = whatsappConfigured
  ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(BUSINESS_WHATSAPP_MESSAGE)}`
  : "#";

["headerWhatsapp", "contactWhatsapp", "floatWhatsapp"].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = waLink;
  if (!whatsappConfigured) {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      console.warn("Falta configurar BUSINESS_WHATSAPP en script.js con el número real del negocio.");
      alert("Falta configurar el número de WhatsApp del negocio en script.js (BUSINESS_WHATSAPP).");
    });
  }
});

const footerPhoneEl = document.getElementById("footerPhone");
if (footerPhoneEl && whatsappConfigured) {
  footerPhoneEl.textContent = "+" + BUSINESS_WHATSAPP;
}

// --- Menú móvil ---
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
mainNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// --- Modal de pedido ---
const modal = document.getElementById("orderModal");
const modalClose = document.getElementById("modalClose");
const modalProductName = document.getElementById("modalProductName");
const fieldProducto = document.getElementById("fieldProducto");
const fieldPrecio = document.getElementById("fieldPrecio");

const formView = document.getElementById("formView");
const successView = document.getElementById("successView");
const errorView = document.getElementById("errorView");
const orderForm = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");

function openModal(productName, productPrice) {
  modalProductName.textContent = `${productName} — ${productPrice}`;
  fieldProducto.value = productName;
  fieldPrecio.value = productPrice;

  formView.hidden = false;
  successView.hidden = true;
  errorView.hidden = true;
  orderForm.reset();
  fieldProducto.value = productName;
  fieldPrecio.value = productPrice;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".btn-buy").forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal(btn.dataset.product, btn.dataset.price);
  });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

document.getElementById("successClose").addEventListener("click", closeModal);
document.getElementById("errorRetry").addEventListener("click", () => {
  errorView.hidden = true;
  formView.hidden = false;
});

// --- Envío del formulario a Web3Forms ---
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "PON_AQUI_TU_ACCESS_KEY") {
    console.warn(
      "Falta configurar WEB3FORMS_ACCESS_KEY en script.js. Ve a https://web3forms.com, crea una clave gratis y pégala en script.js."
    );
    errorView.querySelector("p").textContent =
      "El formulario aún no está conectado a un correo. Escríbenos directo por WhatsApp mientras tanto.";
    formView.hidden = true;
    errorView.hidden = false;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  const formData = new FormData(orderForm);
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      formView.hidden = true;
      successView.hidden = false;
    } else {
      throw new Error(data.message || "Error desconocido");
    }
  } catch (err) {
    console.error("Error enviando el formulario:", err);
    errorView.querySelector("p").textContent =
      "No pudimos enviar tu pedido en este momento. Por favor intenta de nuevo o escríbenos directo por WhatsApp.";
    formView.hidden = true;
    errorView.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirmar pedido";
  }
});
