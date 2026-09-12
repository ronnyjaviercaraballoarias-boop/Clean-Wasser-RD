// ============================================================
// CONFIGURACIÓN DEL NEGOCIO — edita estos valores
// ============================================================
const BUSINESS_WHATSAPP = "18492038524"; // Número de WhatsApp del negocio
const BUSINESS_WHATSAPP_MESSAGE = "Hola, quisiera más información sobre los productos de CleanWasserRD";

// Clave de acceso de Web3Forms (servicio gratuito que envía el formulario a tu correo,
// sin necesidad de programar un backend). Regístrate gratis en https://web3forms.com,
// confirma tu correo y pega aquí la "Access Key" que te den.
const WEB3FORMS_ACCESS_KEY = "1600cefc-2691-4014-baa3-bc0321bc78d1";

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

// --- Carrito de compras ---
const CART_STORAGE_KEY = "cleanwasserrd_cart";

function parsePrice(str) {
  const digits = String(str).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatPrice(num) {
  return "RD$ " + Number(num).toLocaleString("es-DO");
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* localStorage no disponible: el carrito solo dura mientras la página siga abierta */
  }
}

let cart = loadCart(); // [{ name, unitPrice, qty }]

function addToCart(name, priceStr, qty) {
  const unitPrice = parsePrice(priceStr);
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, unitPrice, qty });
  }
  saveCart();
  updateCartBadge();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  saveCart();
  renderCart();
  updateCartBadge();
}

function setCartItemQty(name, newQty) {
  const item = cart.find((i) => i.name === name);
  if (!item) return;
  if (newQty < 1) {
    removeFromCart(name);
    return;
  }
  item.qty = newQty;
  saveCart();
  renderCart();
  updateCartBadge();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

function cartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = cartItemCount();
  if (count > 0) {
    badge.textContent = count;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmptyMsg");
  const totalRow = document.getElementById("cartTotalRow");
  const totalValue = document.getElementById("cartTotalValue");
  const checkoutBtn = document.getElementById("goToCheckout");

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.hidden = false;
    totalRow.hidden = true;
    checkoutBtn.hidden = true;
    return;
  }

  emptyMsg.hidden = true;
  totalRow.hidden = false;
  checkoutBtn.hidden = false;

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatPrice(item.unitPrice)} c/u</span>
      </div>
      <div class="cart-item-qty">
        <button type="button" class="qty-btn" data-dir="-1" aria-label="Disminuir cantidad">−</button>
        <span class="qty-value">${item.qty}</span>
        <button type="button" class="qty-btn" data-dir="1" aria-label="Aumentar cantidad">+</button>
      </div>
      <span class="cart-item-subtotal">${formatPrice(item.unitPrice * item.qty)}</span>
      <button type="button" class="cart-item-remove" aria-label="Quitar producto">&times;</button>
    `;

    row.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = parseInt(btn.dataset.dir, 10);
        setCartItemQty(item.name, item.qty + dir);
      });
    });
    row.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.name));

    cartItemsEl.appendChild(row);
  });

  totalValue.textContent = formatPrice(cartTotal());
}

function getOrderSummaryText() {
  const lines = cart.map(
    (item) => `${item.qty}x ${item.name} (${formatPrice(item.unitPrice)} c/u) = ${formatPrice(item.unitPrice * item.qty)}`
  );
  lines.push("", `Total estimado: ${formatPrice(cartTotal())}`);
  return lines.join("\n");
}

// --- Selector de cantidad en cada tarjeta de producto (antes de agregar al carrito) ---
document.querySelectorAll(".product-card .qty-stepper").forEach((stepper) => {
  const valueEl = stepper.querySelector(".qty-value");
  stepper.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      let qty = parseInt(stepper.dataset.qty, 10) || 1;
      qty += parseInt(btn.dataset.dir, 10);
      if (qty < 1) qty = 1;
      if (qty > 99) qty = 99;
      stepper.dataset.qty = qty;
      valueEl.textContent = qty;
    });
  });
});

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const stepper = card.querySelector(".qty-stepper");
    const qty = parseInt(stepper.dataset.qty, 10) || 1;

    addToCart(btn.dataset.product, btn.dataset.price, qty);

    // Reset del selector de cantidad de la tarjeta
    stepper.dataset.qty = 1;
    stepper.querySelector(".qty-value").textContent = "1";

    // Feedback visual breve en el botón
    const originalText = btn.textContent;
    btn.textContent = "¡Agregado! ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
});

updateCartBadge();

// --- Modal (carrito → formulario → éxito/error) ---
const modal = document.getElementById("orderModal");
const modalClose = document.getElementById("modalClose");
const modalProductLine = document.getElementById("modalProductLine");

const cartView = document.getElementById("cartView");
const formView = document.getElementById("formView");
const successView = document.getElementById("successView");
const errorView = document.getElementById("errorView");
const orderForm = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");

function showView(view) {
  [cartView, formView, successView, errorView].forEach((v) => {
    v.hidden = v !== view;
  });
}

function openCartModal() {
  renderCart();
  showView(cartView);
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("cartFloatBtn").addEventListener("click", openCartModal);

document.getElementById("goToCheckout").addEventListener("click", () => {
  const count = cartItemCount();
  modalProductLine.textContent = `${count} producto${count !== 1 ? "s" : ""} en tu pedido — Total estimado: ${formatPrice(cartTotal())}`;
  orderForm.reset();
  showView(formView);
});

document.getElementById("backToCart").addEventListener("click", () => {
  renderCart();
  showView(cartView);
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
  showView(formView);
});

// --- Envío del pedido (carrito completo) a Web3Forms ---
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showView(cartView);
    return;
  }

  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "PON_AQUI_TU_ACCESS_KEY") {
    console.warn(
      "Falta configurar WEB3FORMS_ACCESS_KEY en script.js. Ve a https://web3forms.com, crea una clave gratis y pégala en script.js."
    );
    errorView.querySelector("p").textContent =
      "El formulario aún no está conectado a un correo. Escríbenos directo por WhatsApp mientras tanto.";
    showView(errorView);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  const formData = new FormData(orderForm);
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("pedido_detalle", getOrderSummaryText());
  formData.append("total_estimado", formatPrice(cartTotal()));
  formData.append("cantidad_productos", String(cartItemCount()));

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      cart = [];
      saveCart();
      updateCartBadge();
      showView(successView);
    } else {
      throw new Error(data.message || "Error desconocido");
    }
  } catch (err) {
    console.error("Error enviando el formulario:", err);
    errorView.querySelector("p").textContent =
      "No pudimos enviar tu pedido en este momento. Por favor intenta de nuevo o escríbenos directo por WhatsApp.";
    showView(errorView);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirmar pedido";
  }
});

// --- Asesor de producto ("¿Qué producto necesito?") ---
const ADVISOR_PRODUCTS = {
  antisarro: {
    name: "Antisarro Premium",
    price: "RD$ 100",
    anchor: "producto-antisarro",
    reason:
      "Tu problema principal es el sarro: este producto lo inhibe, remueve las incrustaciones ya existentes y reduce la corrosión en tuberías y equipos.",
  },
  desinfectante: {
    name: "Desinfectante Premium",
    price: "RD$ 100",
    anchor: "producto-desinfectante",
    reason:
      "Tu problema principal son bacterias, mal olor o mosquitos: este producto desinfecta y oxigena el agua, eliminando bacterias, hongos, parásitos y virus, e inhibe las larvas de mosquito.",
  },
  dobleAccion: {
    name: "Doble Acción Premium",
    price: "RD$ 100",
    anchor: "producto-doble-accion",
    reason:
      "Antisarro + desinfectante en un solo producto: la protección completa para tinacos y cisternas de hasta 550 galones.",
  },
  dobleAccionCisternas: {
    name: "Doble Acción Premium Cisternas",
    price: "RD$ 100",
    anchor: "producto-doble-accion-cisternas",
    reason:
      "Antisarro + desinfectante en un solo producto, formulado especialmente para cisternas de gran tamaño (1,500 a 2,800 galones).",
  },
};

function getAdvisorRecommendation(state) {
  if (state.capacidad > 550) {
    return ADVISOR_PRODUCTS.dobleAccionCisternas;
  }
  if (state.problema === "sarro") return ADVISOR_PRODUCTS.antisarro;
  if (state.problema === "bacterias") return ADVISOR_PRODUCTS.desinfectante;
  return ADVISOR_PRODUCTS.dobleAccion;
}

const advisorModal = document.getElementById("advisorModal");
const advisorClose = document.getElementById("advisorClose");
const advisorSteps = ["advisorStep1", "advisorStep2", "advisorStep3", "advisorResult"].map((id) =>
  document.getElementById(id)
);
const advisorCapacidad = document.getElementById("advisorCapacidad");
const advisorStep2Next = document.getElementById("advisorStep2Next");

const advisorState = { tipo: null, capacidad: null, problema: null };

function advisorShowStep(id) {
  advisorSteps.forEach((el) => {
    el.hidden = el.id !== id;
  });
}

function openAdvisorModal() {
  advisorState.tipo = null;
  advisorState.capacidad = null;
  advisorState.problema = null;
  advisorCapacidad.value = "";
  advisorStep2Next.disabled = true;
  advisorShowStep("advisorStep1");
  advisorModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAdvisorModal() {
  advisorModal.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".open-advisor-btn").forEach((btn) => {
  btn.addEventListener("click", openAdvisorModal);
});

advisorClose.addEventListener("click", closeAdvisorModal);
advisorModal.addEventListener("click", (e) => {
  if (e.target === advisorModal) closeAdvisorModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && advisorModal.classList.contains("open")) closeAdvisorModal();
});

document.querySelectorAll(".back-link[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => advisorShowStep(btn.dataset.back));
});

document.querySelectorAll('.advisor-option[data-field="tipo"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    advisorState.tipo = btn.dataset.value;
    advisorShowStep("advisorStep2");
    advisorCapacidad.focus();
  });
});

advisorCapacidad.addEventListener("input", () => {
  advisorStep2Next.disabled = !(parseFloat(advisorCapacidad.value) > 0);
});
advisorCapacidad.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !advisorStep2Next.disabled) {
    e.preventDefault();
    advisorStep2Next.click();
  }
});
advisorStep2Next.addEventListener("click", () => {
  advisorState.capacidad = parseFloat(advisorCapacidad.value);
  advisorShowStep("advisorStep3");
});

document.querySelectorAll('.advisor-option[data-field="problema"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    advisorState.problema = btn.dataset.value;
    showAdvisorResult();
  });
});

function showAdvisorResult() {
  const rec = getAdvisorRecommendation(advisorState);
  let reason = rec.reason;
  if (advisorState.capacidad > 2800) {
    reason +=
      " Tu capacidad supera nuestro rango estándar (hasta 2,800 galones) — escríbenos por WhatsApp para asesorarte sobre la dosificación adecuada.";
  }

  document.getElementById("advisorResultName").textContent = rec.name;
  document.getElementById("advisorResultReason").textContent = reason;
  document.getElementById("advisorResultPrice").textContent = rec.price;
  advisorShowStep("advisorResult");

  document.getElementById("advisorAddToCart").onclick = () => {
    addToCart(rec.name, rec.price, 1);
    closeAdvisorModal();
    openCartModal();
  };

  document.getElementById("advisorViewProduct").onclick = () => {
    closeAdvisorModal();
    const el = document.getElementById(rec.anchor);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight");
        setTimeout(() => el.classList.remove("highlight"), 1800);
      }, 50);
    }
  };
}

document.getElementById("advisorRestart").addEventListener("click", openAdvisorModal);
