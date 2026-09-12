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
