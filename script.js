/* =========================================================
   FIREBASE
========================================================= */
const firebaseConfig = {
    apiKey: "AIzaSyC_XZ7BvaYVsDQNIvxaXdYRA-2mF7SvRL0",
    authDomain: "destination-connect-fd7dd.firebaseapp.com",
    projectId: "destination-connect-fd7dd",
    storageBucket: "destination-connect-fd7dd.firebasestorage.app",
    messagingSenderId: "448736960200",
    appId: "1:448736960200:web:0c8fcb15e9a09ba6628ffd",
    measurementId: "G-3HZYGGR4TC"
};

let db = null;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase conectado correctamente.");
} catch (error) {
    console.error("Error inicializando Firebase:", error);
}


/* =========================================================
   ELEMENTOS
========================================================= */
const header = document.getElementById("header");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const floatingTop = document.getElementById("floatingTop");
const travelForm = document.getElementById("travelForm");
const formContainer = document.getElementById("formContainer");
const successScreen = document.getElementById("successScreen");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const submitButton = document.getElementById("submitButton");
const submitText = document.getElementById("submitText");
const submitIcon = document.getElementById("submitIcon");


/* =========================================================
   MENÚ MOBILE
========================================================= */
menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const active = navMenu.classList.contains("active");
    menuToggle.innerHTML = active
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});


/* =========================================================
   SCROLL HEADER
========================================================= */
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
        floatingTop.classList.add("show");
    } else {
        floatingTop.classList.remove("show");
    }
}

window.addEventListener("scroll", handleScroll);
handleScroll();


/* =========================================================
   BOTÓN ARRIBA
========================================================= */
floatingTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================================
   REVEAL
========================================================= */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.10 }
);

revealElements.forEach(el => revealObserver.observe(el));


/* =========================================================
   FAQ ACORDEÓN
========================================================= */
document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const item = button.parentElement;
        const isActive = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach(i => {
            i.classList.remove("active");
        });

        if (!isActive) {
            item.classList.add("active");
        }
    });
});


/* =========================================================
   CARRUSELES DE DESTINOS
========================================================= */
document.querySelectorAll("[data-carousel]").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = track.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    let currentIndex = 0;

    function getVisibleCount() {
        const width = window.innerWidth;
        if (width <= 650) return 1;
        if (width <= 850) return 2;
        if (width <= 1100) return 3;
        return 4;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getVisibleCount());
    }

    function buildDots() {
        dotsContainer.innerHTML = "";
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("span");
            if (i === currentIndex) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const gap = 15;
        const slideWidth = slides[0].offsetWidth + gap;
        const maxIndex = getMaxIndex();

        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        const dots = dotsContainer.querySelectorAll("span");
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    function nextSlide() {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            isDragging = false;
        }
    }, { passive: true });

    track.addEventListener("touchend", () => {
        isDragging = false;
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            buildDots();
            updateCarousel();
        }, 150);
    });

    buildDots();
    updateCarousel();

    window.addEventListener("load", () => {
        buildDots();
        updateCarousel();
    });
});


/* =========================================================
   ERROR / TELÉFONO
========================================================= */
function mostrarError(mensaje) {
    errorText.textContent = mensaje;
    errorMessage.classList.add("show");
    errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function ocultarError() {
    errorMessage.classList.remove("show");
}

function validarTelefono(telefono) {
    const limpio = telefono.replace(/\D/g, "");
    return limpio.length >= 10 && limpio.length <= 15;
}

document.getElementById("telefono").addEventListener("input", function() {
    let valor = this.value.replace(/\D/g, "");

    if (valor.length > 10) {
        valor = valor.substring(0, 10);
    }

    if (valor.length > 6) {
        valor = valor.substring(0,3) + " " + valor.substring(3,6) + " " + valor.substring(6);
    } else if (valor.length > 3) {
        valor = valor.substring(0,3) + " " + valor.substring(3);
    }

    this.value = valor;
});


/* =========================================================
   SUBMIT (con cumplimiento LFPDPPP)
========================================================= */
travelForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    ocultarError();

    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const estadoCivil = document.getElementById("estadoCivil").value;
    const telefono = document.getElementById("telefono").value.trim();
    const preferencia = document.querySelector('input[name="preferenciaViaje"]:checked');
    const disponibilidad = document.querySelector('input[name="disponibilidad"]:checked');
    const datosSensibles = document.getElementById("datosSensibles").value.trim();
    const consentSensible = document.getElementById("consentimientoSensible").checked;
    const noPromos = document.getElementById("noPromociones").checked;

    if (nombre.length < 3) {
        mostrarError("Por favor escribe tu nombre completo.");
        return;
    }

    if (isNaN(edad) || edad < 18 || edad > 100) {
        mostrarError("La edad debe estar entre 18 y 100 años.");
        return;
    }

    if (!estadoCivil) {
        mostrarError("Selecciona tu estado civil.");
        return;
    }

    if (!validarTelefono(telefono)) {
        mostrarError("Ingresa un número de teléfono válido.");
        return;
    }

    if (!preferencia) {
        mostrarError("Selecciona qué tipo de viaje estás buscando.");
        return;
    }

    if (!disponibilidad) {
        mostrarError("Selecciona cuándo prefieres viajar.");
        return;
    }

    // Si hay datos sensibles, exigir consentimiento expreso (Art. 8)
    if (datosSensibles.length > 0 && !consentSensible) {
        mostrarError("Para tratar tus datos de salud o alimentación necesitamos tu consentimiento expreso. Marca la casilla correspondiente.");
        return;
    }

    if (!db) {
        mostrarError("No fue posible conectar con el sistema. Intenta nuevamente.");
        return;
    }

    submitButton.classList.add("loading");
    submitText.textContent = "Guardando registro...";
    submitIcon.className = "fa-solid fa-spinner fa-spin";

    try {
        const origen = document.getElementById('origenRegistro') ? document.getElementById('origenRegistro').value : 'Directo';

        const cliente = {
            nombre: nombre,
            edad: edad,
            estadoCivil: estadoCivil,
            telefono: telefono,
            preferenciaViaje: preferencia.value,
            disponibilidad: disponibilidad.value,
            datosSensibles: datosSensibles || null,
            consentimientoDatosSensibles: consentSensible,
            noDeseaPromociones: noPromos,
            origen: origen,
            avisoVersion: '1.0',
            fechaRegistro: new Date().toLocaleString("es-MX"),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            estado: "pendiente",
            operador: null,
            comentario: null
        };

        const documento = await db.collection("clientes").add(cliente);

        console.log("Cliente registrado:", documento.id);

        // Registrar evidencia de consentimientos (Art. 8 y Art. 7)
        if (consentSensible) {
            await registrarEvidencia('datos_sensibles', 'aceptado', {
                clienteId: documento.id,
                avisoVersion: '1.0'
            });
        }
        if (noPromos) {
            await registrarEvidencia('promociones', 'negado', {
                clienteId: documento.id,
                avisoVersion: '1.0'
            });
        }

        document.getElementById("summaryNombre").textContent = nombre;
        document.getElementById("summaryTelefono").textContent = telefono;
        document.getElementById("summaryPreferencia").textContent = preferencia.value;
        document.getElementById("summaryDisponibilidad").textContent = disponibilidad.value;

        formContainer.style.display = "none";
        successScreen.classList.add("show");

        document.getElementById("registro").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        console.error("Error guardando:", error);
        mostrarError("No pudimos guardar tu registro. Verifica tu conexión e intenta nuevamente.");
        submitButton.classList.remove("loading");
        submitText.textContent = "Confirmar mi registro";
        submitIcon.className = "fa-solid fa-arrow-right";
    }
});


/* =========================================================
   REINICIAR
========================================================= */
function reiniciarFormulario() {
    travelForm.reset();
    successScreen.classList.remove("show");
    formContainer.style.display = "block";
    ocultarError();

    submitButton.classList.remove("loading");
    submitText.textContent = "Confirmar mi registro";
    submitIcon.className = "fa-solid fa-arrow-right";

    document.getElementById("registro").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   VERIFICAR CONEXIÓN
========================================================= */
async function verificarConexion() {
    if (!db) {
        console.warn("Firebase no está disponible.");
        return;
    }

    try {
        await db.collection("clientes").limit(1).get();
        console.log("Firestore funcionando correctamente.");
    } catch (error) {
        console.error("No se pudo verificar Firestore:", error);
    }
}

verificarConexion();


/* =========================================================
   IMÁGENES CON ERROR
========================================================= */
document.querySelectorAll("img").forEach(image => {
    image.addEventListener("error", function() {
        this.style.background = "#d9d2c4";
    });
});


/* =========================================================
   DATOS DE DESTINOS PARA MODALES
========================================================= */
 const destinosData = {
        "Cancún": {
            desc: "Cancún es una ciudad de México ubicada en la península de Yucatán que limita con el mar Caribe y que es conocida por sus playas, los numerosos centros turísticos y la vida nocturna. Se compone de 2 áreas distintas: el área del centro más tradicional y la Zona Hotelera, la franja costera con hoteles altos, clubes nocturnos, tiendas y restaurantes. Cancún también es un destino popular entre estudiantes durante el período de vacaciones universitarias en la primavera.",
            imgs: [
                "Imagenes/cancun-things-to-do-guide.jpg",
                "Imagenes/cancun.2.webp",
                "Imagenes/cancun-3.jpg",
                "Imagenes/cancun-4.avif"
            ]
        },

        "Riviera Maya": {
            desc: "La Riviera Maya​ es una zona turística de México, situada en la costa del mar Caribe, en el estado de Quintana Roo. Geográficamente se extiende a lo largo del litoral, desde la localidad de Puerto Morelos al norte, hasta la localidad de Tulum al sur, con unos 210 km de longitud.",
            imgs: [
                "Imagenes/Riviera Maya.webp",
                "Imagenes/riviera-2.webp",
                "Imagenes/riviera-3.webp",
                "Imagenes/riviera-4.webp"
            ]
        },

         "Los Cabos": {
            desc: "Cabo San Lucas es un balneario en el extremo sur de la península de Baja California en México, conocido por sus playas, actividades acuáticas y vida nocturna. La Playa El Médano es la principal del Cabo, con restaurantes al aire libre y numerosos bares. Después de la marina, se encuentra el promontorio del Fin de la Tierra, donde está la Playa del Amor y El Arco, una arcada natural en los riscos marinos.",
            imgs: [
                "Imagenes/Los Cabos.jpg",
                "Imagenes/loscabos-2.png",
                "Imagenes/loscabos-3.avif",
                "Imagenes/loscabos-4.webp"
            ]
        },

         "Puerto Vallarta": {
            desc: "Cabo San Lucas es un balneario en el extremo sur de la península de Baja California en México, conocido por sus playas, actividades acuáticas y vida nocturna. La Playa El Médano es la principal del Cabo, con restaurantes al aire libre y numerosos bares. Después de la marina, se encuentra el promontorio del Fin de la Tierra, donde está la Playa del Amor y El Arco, una arcada natural en los riscos marinos.",
            imgs: [
                "Imagenes/PUERTOVALLARTA.jpg",
                "Imagenes/puertovallarta-2.jpg",
                "Imagenes/puertovallarta-3.jpg",
                "Imagenes/puertovallarta-4.jpeg"
            ]
        },

       "Punta Cana": {
            desc: "Punta Cana, el extremo más oriental de República Dominicana, limita con el mar Caribe y con el océano Atlántico. Es una región conocida por sus 32 km de extensión de playas y aguas claras. El área del Bávaro y Punta Cana se combinan para formar lo que se conoce como La Costa del Coco, un área con exclusivos centros turísticos con todo incluido. Es popular por sus tirolesas, el windsurf, el kayak y la navegación.Cabo San Lucas es un balneario en el extremo sur de la península de Baja California en México, conocido por sus playas, actividades acuáticas y vida nocturna. La Playa El Médano es la principal del Cabo, con restaurantes al aire libre y numerosos bares. Después de la marina, se encuentra el promontorio del Fin de la Tierra, donde está la Playa del Amor y El Arco, una arcada natural en los riscos marinos.",
                imgs: [
                "Imagenes/puntacana.webp",
                "Imagenes/puntacana-2.webp",
                "Imagenes/puntacana-3.jpg",
                "Imagenes/puntacana-4.webp"
            ]
        },

        "Maldivas": {
            desc: "Maldivas es un país tropical en el océano Índico que abarca 26 atolones con forma de anillos que se componen de más de 1,000 islas de coral. Es conocido por las playas, las lagunas azules y los extensos arrecifes. La capital, Malé, tiene un mercado de pescado ajetreado, restaurantes y tiendas en la avenida principal, Majeedhee Magu, y la mezquita del siglo XVII Hukuru Miskiy (también conocida como la Mezquita del Viernes), hecha de coral blanco tallado.",
            imgs: [
                "Imagenes/maldivas.jfif",
                "Imagenes/maldivas-2.avif",
                "Imagenes/maldivas-4.jpg",
                "Imagenes/maldivas-4.jpg"
            ]
        },

        "Isla Mujeres": {
            desc: "Isla Mujeres es un pueblo mágico e isla en el Mar Caribe, situada a 13 kilómetros de la costa de Cancún en el estado de Quintana Roo, México ",
            imgs: [
                "Imagenes/islamujeres.jpg",
                "Imagenes/islamujeres-2.avif",
                "Imagenes/islamujeres-3.jpg",
                "Imagenes/islamujeres-4.jpg"
            ]
        },

        "Huatulco": {
            desc: "Huatulco es una población del estado mexicano de Oaxaca, siendo la cabecera del Municipio de Santa María Huatulco, localizado en la Costa Oaxaqueña. Fue fundada el 8 de enero de 1539 por Pedro de Alvarado, aunque indicios señalan que fue años antes.",
            imgs: [
                "Imagenes/huatulco.jpg",
                "Imagenes/huatulco-2.jpg",
                "Imagenes/huatulco-3.jpg",
                "Imagenes/huatulco-4.webp"
            ]
        },


        "Sayulita": {
            desc: "Sayulita es una aldea de México en la costa del Pacífico que tiene a sus espaldas las montañas de la Sierra Madre Occidental. Es conocida por sus playas con fuerte oleaje, como la playa Sayulita central. Al oeste, la Playa de los Muertos está más resguardada entre rocas que la protegen. Las galerías de Sayulita venden obras de arte del pueblo indígena huichol. Al suroeste, las Islas Marietas tienen una fauna diversa que incluye ballenas jorobadas y delfines.",
            imgs: [
                "Imagenes/sayulita",
                "Imagenes/sayulita-2.jpg",
                "Imagenes/sayulita-3.jpg",
                "Imagenes/sayulita-4.jpg"
            ]
        },

        "Mazatlán": {
            desc: "Mazatlán es un balneario mexicano de la costa del Pacífico en el estado de Sinaloa. Las playas de arena bordean su malecón de 21 km de largo y el lugar es famoso por la pesca de altura. En su Centro Histórico, o Viejo Mazatlán, los sitios icónicos del siglo XIX incluyen el Teatro Ángela Peralta y la altísima basílica de la Inmaculada Concepción. El distrito moderno Zona Dorada es conocido por su vida nocturna y hoteles.",
            imgs: [
                "Imagenes/mazatlan.webp",
                "Imagenes/mazatlan-2.jpg",
                "Imagenes/mazatlan-3.jpg",
                "Imagenes/mazatlan-4.jpg"
            ]
        },

        "Mazatlan": {
            desc: "Mazatlán es un balneario mexicano de la costa del Pacífico en el estado de Sinaloa. Las playas de arena bordean su malecón de 21 km de largo y el lugar es famoso por la pesca de altura. En su Centro Histórico, o Viejo Mazatlán, los sitios icónicos del siglo XIX incluyen el Teatro Ángela Peralta y la altísima basílica de la Inmaculada Concepción. El distrito moderno Zona Dorada es conocido por su vida nocturna y hoteles.",
            imgs: [
                "Imagenes/mazatlan.webp",
                "Imagenes/mazatlan-2.jpg",
                "Imagenes/mazatlan-3.jpg",
                "Imagenes/mazatlan-4.jpg"
            ]
        },

        "San Blas": {
            desc: "Descubre San Blas, Nayarit: un destino mágico entre arquitectura colonial, manglares y playas vírgenes. San Blas es famoso principalmente por su historia como puerto colonial estratégico en Nayarit, México, por su riqueza natural y por la popular canción de la banda Maná",
             imgs: [
                "Imagenes/SANBLAS.jpg",
                "Imagenes/sanblas-2.jpg",
                "Imagenes/sanblas-3.jpg",
                "Imagenes/sanblas-4.avif"
            ]
        },

        "París": {
            desc: "La ciudad de la luz te espera con su icónica Torre Eiffel, el Museo del Louvre, paseos por el Sena y la mejor gastronomía y moda del mundo.",
            imgs: [
                "Imagenes/PARIS.jfif",
                "Imagenes/paris-2.jpg",
                "Imagenes/paris-3.avif",
                "Imagenes/paris-4.webp"
            ]
        },
        
           "Roma": {
            desc: "Roma, la capital de Italia, es una extensa ciudad cosmopolita que tiene a la vista casi 3,000 años de arte, arquitectura y cultura de influencia mundial. Las ruinas antiguas como las del Foro y el Coliseo evocan el poder del antiguo Imperio Romano. La ciudad del Vaticano, sede central de la Iglesia católica romana, cuenta con la Basílica de San Pedro y los Museos del Vaticano, que albergan obras maestras como los frescos de la Capilla Sixtina de Miguel Ángel.",
            imgs: [
                "Imagenes/ROMA.jpg",
                "Imagenes/roma-2.jpg",
                "Imagenes/roma-3.jpg",
                "Imagenes/roma-4.jpg"
            ]
        },


        "Londres": {
            desc: "Londres, la capital de Inglaterra y del Reino Unido, es una ciudad del siglo XXI con una historia que se remonta a la época romana. En su centro se alzan el imponente Palacio del Parlamento, la torre del icónico reloj Big Ben y la Abadía de Westminster, lugar de las coronaciones monárquicas británicas. Al otro lado del río Támesis, la rueda de observación London Eye ofrece vistas panorámicas del complejo cultural South Bank y de toda la ciudad.",
            imgs: [
                "Imagenes/LONDRES.jpg",
                "Imagenes/londres-2.jpg",
                "Imagenes/londres-3.jpg",
                "Imagenes/londres-4.webp"
            ]
        },



        "Nueva York": {
            desc: "Nueva York incluye 5 distritos que se ubican donde el río Hudson desemboca en el océano Atlántico. En su centro se encuentra Manhattan, un distrito densamente poblado que se encuentra entre los principales centros comerciales, financieros y culturales del mundo. Sus sitios icónicos incluyen rascacielos, como el Empire State Building, y el amplio Central Park. El teatro Broadway se ubica en la zona del Times Square iluminada con neones.",
            imgs: [
                "Imagenes/NUEVA YORK.jfif",
                "Imagenes/nuevayork-2.jpg",
                "Imagenes/nuevayork-3.webp",
                "Imagenes/nuevayork-4.jpg"
            ]
        },


        "Roma": {
            desc: "Roma, la capital de Italia, es una extensa ciudad cosmopolita que tiene a la vista casi 3,000 años de arte, arquitectura y cultura de influencia mundial. Las ruinas antiguas como las del Foro y el Coliseo evocan el poder del antiguo Imperio Romano. La ciudad del Vaticano, sede central de la Iglesia católica romana, cuenta con la Basílica de San Pedro y los Museos del Vaticano, que albergan obras maestras como los frescos de la Capilla Sixtina de Miguel Ángel.",
            imgs: [
                "Imagenes/ROMA.jpg",
                "Imagenes/roma-2.jpg",
                "Imagenes/roma-3.jpg",
                "Imagenes/roma-4.jpg"
            ]
        },


        "Venecia": {
            desc: "Venecia, la capital de la región de Véneto en el norte de Italia, abarca más de 100 islas pequeñas en una laguna del mar Adriático. No tiene caminos, sino solo canales, incluida la vía pública del Gran Canal, bordeada de palacios renacentistas y góticos. En la plaza central de San Marcos, se encuentra la basílica de San Marcos, que tiene un suelo de mosaicos bizantinos, y el campanario Campanile con vista a los techos rojos de la ciudad.",
            imgs: [
                "Imagenes/Venecia.jfif",
                "Imagenes/venecia-2.webp",
                "Imagenes/venecia-3.jpg",
                "Imagenes/venecia-4.webp"
            ]
        },

        "Barcelona": {
            desc: "Barcelona, la capital cosmopolita de la región de Cataluña en España, es conocida por su arte y arquitectura. La fantástica iglesia de la Sagrada Familia y otros hitos modernistas diseñados por Antoni Gaudí adornan la ciudad. El Museo Picasso y la Fundación Joan Miró muestran el arte moderno de los artistas que dan origen a sus nombres. El Museo de Historia de Barcelona (MUHBA) incluye varios sitios arqueológicos romanos.",
            imgs: [
                "Imagenes/barcelona.jfif",
                "Imagenes/barcelona-2.jpg",
                "Imagenes/barcelona-3.jpg",
                "Imagenes/barcelona-4.jpg"
            ]
        },

        "Roma": {
            desc: "Roma, la capital de Italia, es una extensa ciudad cosmopolita que tiene a la vista casi 3,000 años de arte, arquitectura y cultura de influencia mundial. Las ruinas antiguas como las del Foro y el Coliseo evocan el poder del antiguo Imperio Romano. La ciudad del Vaticano, sede central de la Iglesia católica romana, cuenta con la Basílica de San Pedro y los Museos del Vaticano, que albergan obras maestras como los frescos de la Capilla Sixtina de Miguel Ángel.",
            imgs: [
                "Imagenes/ROMA.jpg",
                "Imagenes/roma-2.jpg",
                "Imagenes/roma-3.jpg",
                "Imagenes/roma-4.jpg"
            ]
        },

        "Ámsterdam": {
            desc: "Amsterdam es la capital de los Países Bajos, conocida por su patrimonio artístico, su elaborado sistema de canales y sus casas angostas con fachadas de dos aguas, herencias de la Edad de Oro de la ciudad durante el siglo XVII. El Distrito de Museos alberga el Museo van Gogh, obras de Rembrandt y Vermeer en el Rijksmuseum, y arte moderno en el Museo Stedelijk. El ciclismo es clave en la identidad de la ciudad y existen varios senderos para practicarlo. ",
             imgs: [
                "Imagenes/amsterdam.webp",
                "Imagenes/amsterdam-2.jpg",
                "Imagenes/amsterdam-3.jpg",
                "Imagenes/amsterdam-4.webp"
            ]
        },


        "Praga": {
            desc: "Praga, capital de la República Checa, está dividida por el río Moldava. Conocida como «la ciudad de las cien torres», es famosa por su Plaza de la Ciudad Vieja, el corazón de su centro histórico, con coloridos edificios barrocos, iglesias góticas y el reloj astronómico medieval, que ofrece un espectáculo animado cada hora. El puente peatonal de Carlos, terminado en 1402, está flanqueado por estatuas de santos católicos.",
            imgs: [
                "Imagenes/praga.webp",
                "Imagenes/praga-2.jpg",
                "Imagenes/praga-3.jpg",
                "Imagenes/praga-4.jpg"
            ]
        },

        "Estambul": {
            desc: "",
            imgs: [
                "Imagenes/estambul.jpg",
                "Imagenes/estambul-2.webp",
                "Imagenes/estambul-3.webp",
                "Imagenes/estambul-4.jpg"
            ]
        },

        "Bali": {
            desc: "Bali es una paradisíaca isla y provincia de Indonesia, famosa a nivel mundial por sus frondosas montañas volcánicas, sus icónicos arrozales en terrazas, sus playas tropicales y una profunda riqueza cultural y espiritual que le ha valido el apodo de la (Isla de los Dioses). Al ser un oasis predominantemente hinduista dentro del país musulmán más poblado del mundo, ofrece una atmósfera mística única reflejada en sus miles de templos y coloridas ceremonias diarias.",
            imgs: [
                "Imagenes/Bali.jpg",
                "Imagenes/bali-2.webp",
                "Imagenes/bali-3.webp",
                "Imagenes/bali-4.webp"
            ]
        },

        "Ciudad de México": {
            desc: "Ciudad de México es la densamente poblada capital de México que se encuentra a gran altura. Es famosa por su Templo Mayor (un templo azteca del siglo XIII), la Catedral Metropolitana de México, de estilo barroco, de los conquistadores españoles y el Palacio Nacional, que alberga murales históricos de Diego Rivera. Todos estos hitos se ubican en torno a la Plaza de la Constitución, la enorme plaza principal conocida también como el Zócalo.",
            imgs: [
                "Imagenes/ciudad-de-mexico-destino-unico-y-capital-cultural-de-america1.jpg",
                "Imagenes/cdmx-2.webp",
                "Imagenes/cdmx-3.jpg",
                "Imagenes/cdmx-4.png"
            ]
        },

        "Oaxaca": {
            desc: "Oaxaca es un estado del sur de México conocido por sus culturas indígenas. Su ciudad capital, que lleva el mismo nombre, tiene edificios coloniales, a menudo, construidos con piedra volcánica verde. En la plaza principal, El Zócalo, se alza la catedral de Oaxaca, de estilo barroco. Fuera de la ciudad, los sitios arqueológicos precolombinos incluyen Mitla, Yagul y Monte Albán, la capital zapoteca que data de alrededor del año 500 a. C.",
            imgs: [
                "Imagenes/Oaxaca.jfif",
                "Imagenes/cdmx-2.webp",
                "Imagenes/cdmx-3.jpg",
                "Imagenes/cdmx-4.png"
            ]
        },


        "San Miguel de Allende": {
            desc: "San Miguel de Allende, una ciudad de la época colonial en la zona alta central de México, es conocida por su arquitectura barroca española, su activa escena artística y sus festivales culturales. En el centro histórico de adoquines de la ciudad, se encuentra la Parroquia de San Miguel Arcángel, de estilo neogótico, cuyas espectaculares torres rosas se alzan por sobre la plaza principal, El Jardín. Cerca se encuentra la iglesia del Templo de San Francisco con una fachada churrigueresca del siglo XVIII.",
            imgs: [
                "Imagenes/San-Miguel-de-Allende.jpeg",
                "Imagenes/sanmiguel-2.avif",
                "Imagenes/sanmiguel-3.jpg",
                "Imagenes/sanmiguel-4.webp"
            ]
        },


        "Guanajuato": {
            desc: "Ciudad de México es la densamente poblada capital de México que se encuentra a gran altura. Es famosa por su Templo Mayor (un templo azteca del siglo XIII), la Catedral Metropolitana de México, de estilo barroco, de los conquistadores españoles y el Palacio Nacional, que alberga murales históricos de Diego Rivera. Todos estos hitos se ubican en torno a la Plaza de la Constitución, la enorme plaza principal conocida también como el Zócalo.",
            imgs: [
                "Imagenes/ciudad-de-mexico-destino-unico-y-capital-cultural-de-america1.jpg",
                "Imagenes/cdmx-2.webp",
                "Imagenes/cdmx-3.jpg",
                "Imagenes/cdmx-4.png"
            ]
        },


        "Tokio": {
            desc: "Tokio, la ajetreada capital de Japón, mezcla lo ultramoderno y lo tradicional, desde los rascacielos iluminados con neones hasta los templos históricos. El opulento santuario Shinto Meiji es conocido por su puerta altísima y los bosques circundantes. El Palacio Imperial se ubica en medio de grandes jardines públicos. Los distintos museos de la ciudad ofrecen exhibiciones que van desde el arte clásico (en el Museo Nacional de Tokio) hasta un teatro kabuki reconstruido (en el Museo Edo-Tokyo)",
            imgs: [
                "Imagenes/Tokio2.webp",
                "Imagenes/Tokio1.jpg",
                "Imagenes/tokio-3.webp",
                "Imagenes/tokio-2.jpg"
            ]
        },

        
        "Dubái": {
            desc: "Dubái es una ciudad emirato de los Emiratos Árabes Unidos conocida por su lujoso comercio, la arquitectura ultramoderna y su vida nocturna animada. Burj Khalifa, una torre de 830 m de alto, domina el paisaje lleno de rascacielos. A sus pies se encuentra la Fuente de Dubái, con coreografías de chorros y luces al ritmo de la música. En las islas artificiales justo frente a la costa están Atlantis, la Palma, un centro turístico con agua y parques de animales marinos.",
            imgs: [
                "Imagenes/Dubái.webp",
                "Imagenes/Dubái2.jpg",
                "Imagenes/Dubái3.avif",
                "Imagenes/Dubái4.jpg"
            ]
        },


         "Berlín": {
            desc: "Berlín, capital alemana, data del siglo XIII. Los elementos que recuerdan la turbulenta historia de la ciudad en el siglo XX incluyen el Monumento del Holocausto y los restos del Muro de Berlín con grafitis. Después de dividirse durante la Guerra Fría, la Puerta de Brandeburgo del siglo XVIII se convirtió en un símbolo de la reunificación. La ciudad es conocida por su ambiente artístico y los sitios geográficos modernos, como la Filarmónica de Berlín, construida en 1963, de color dorado y con un diseño de paneles que se desprenden de su techo.",
            imgs: [
                "Imagenes/Berlín.jpg",
                "Imagenes/Berlín2.jpg",
                "Imagenes/Berlín3.jpg",
                "Imagenes/Berlín4.jpg"
            ]
        },


        "Lisboa": {
            desc: "Lisboa es la capital costera y montañosa de Portugal. Desde el imponente castillo de San Jorge, la vista abarca los edificios de colores pastel en la ciudad antigua, el estuario del Tajo y el puente colgante 25 de Abril. Cerca, el Museo Nacional del Azulejo exhibe 5 siglos de azulejos de cerámica decorativos. Justo fuera de Lisboa hay una franja de playas en el Atlántico, desde Cascaes hasta Estoril.",
            imgs: [
                "Imagenes/Lisboa.jpg",
                "Imagenes/Lisboa2.avif",
                "Imagenes/Lisboa3.jpg",
                "Imagenes/Lisboa4.webp"
            ]
        },

        "Seúl": {
            desc: "Seúl, pronunciado, oficialmente Ciudad Especial de Seúl, es la capital y ciudad más poblada de Corea del Sur desde la creación de esta república en 1948, la capital histórica de Corea desde hace más de 600 años y la ciudad más poblada de la península de Corea. ",
            imgs: [
                "Imagenes/Seúl.jpg",
                "Imagenes/Seúl2.jpg",
                "Imagenes/Seúl3.jpg",
                "Imagenes/Seúl4.webp"
            ]
        },

        "Singapur": {
            desc: "Singapur, oficialmente conocida como República de Singapur, es una ciudad-Estado y país insular, situada en el corazón marítimo del Sudeste asiático.",
            imgs: [
                "Imagenes/Singapur.jpg",
                "Imagenes/Singapur.png",
                "Imagenes/Singapur3.jpg",
                "Imagenes/Singapur4.jpg"
            ]
        },

        "Bora Bora": {
            desc: "Bora Bora es una pequeña isla del Pacífico Sur al noroeste de Tahití en la Polinesia Francesa. Rodeada de motus (islotes) con orillas de arena y una laguna turquesa protegida por un arrecife de coral, es conocida por el buceo. También es un popular complejo turístico lujoso donde algunos bungalós se ubican sobre pilotes en el agua. En el centro de la isla, se eleva el monte Otemanu, un volcán inactivo de 727 m.",
            imgs: [
                "Imagenes/Bora Bora.webp",
                "Imagenes/Bora Bora2.webp",
                "Imagenes/Bora Bora3.jpg",
                "Imagenes/Bora Bora4.jpg"
            ]
        },

        "Santorini": {
            desc: "Santorini es una de las islas Cícladas en el mar Egeo. Fue devastada por una erupción volcánica en el siglo XVI a. C., que dio forma a su paisaje accidentado. Las casas cúbicas encaladas en sus 2 ciudades principales, Fira y Oia, se aferran a los acantilados sobre un cráter subterráneo. Estas tienen vista al mar, las pequeñas islas al oeste y las playas de piedras de lava blancas, rojas y negras.",
            imgs: [
                "Imagenes/Santorini.jpg",
                "Imagenes/Santorini2.avif",
                "Imagenes/Santorini3.jpg",
                "Imagenes/Santorini4.jpg"
            ]
        },

        "Bacalar": {
            desc: "Bacalar es una población del estado mexicano de Quintana Roo, situada en el sur de su territorio a unos 40 km al norte de la capital, Chetumal.​Bacalar se encuentra situada en la ribera de la Laguna de Bacalar, la más importante de las lagunas del sur quintanarroense y de gran atractivo turístico.",
            imgs: [
                "Imagenes/bacalar.jfif",
                "Imagenes/Bacalar2.avif",
                "Imagenes/Bacalar3.avif",
                "Imagenes/Bacalar4.jpg"
            ]
        },


        "Seychelles": {
            desc: "Seychelles es un archipiélago de 115 islas en el océano Índico, frente a África Oriental. Alberga varias playas, arrecifes de coral y reservas naturales, además de animales exóticos, como las tortugas gigantes de Aldabra. En Mahé, un centro que permite visitar otras islas, se encuentra la capital, Victoria. También tiene los bosques tropicales de montaña del Parque Nacional de Morne Seychellois y playas, incluidas Beau Vallon y Anse Takamaka. ",
            imgs: [
                "Imagenes/Seychelles.jpg",
                "Imagenes/Seychelles1.webp",
                "Imagenes/Seychelles3.webp",
                "Imagenes/Seychelles4.jpg"
            ]
        },
        

        "Islas Fiji": {
            desc: "Fiyi, un país del Pacífico Sur, es un archipiélago de más de 300 islas. Es famoso por sus paisajes escabrosos, las playas bordeadas de palmeras y los arrecifes de coral con lagunas de aguas cristalinas. Sus islas más importantes, Viti Levu y Vanua Levu, albergan la mayor parte de la población. En Viti Levu, se encuentra la capital, Suva, una ciudad puerto con arquitectura colonial británica. El Museo de Fiyi, en los Jardines Thurston de la época victoriana, tiene exhibiciones etnográficas.",
            imgs: [
                "Imagenes/Islas Fiji.jpg",
                "Imagenes/Islas Fiji2.jpg",
                "Imagenes/Islas Fiji3.jpg",
                "Imagenes/Islas Fiji4.avif"
            ]
        },

        "Isla Mauricio": {
            desc: "Mauricio es una nación insular en el océano Índico, conocida por sus playas, lagunas y arrecifes. El interior montañoso incluye el Parque Nacional Gargantas del Río Negro, con bosques tropicales, cascadas, senderos de excursión y fauna, como zorros voladores. La capital Port Louis tiene sitios como el hipódromo Champs de Mars, la casa de hacienda Eureka y el Jardín Botánico de Sir Seewoosagur Ramgoolam del siglo XVIII",
            imgs: [
                "Imagenes/Isla Mauricio.avif",
                "Imagenes/Isla Mauricio2.avif",
                "Imagenes/Isla Mauricio3.avif",
                "Imagenes/Isla Mauricio4.avif"
            ]
        },

        "Toscana": {
            desc: "Toscana es una región del centro de Italia. Su capital, Florencia, alberga algunas de las obras de arte y arquitectura renacentistas más reconocibles, incluida la estatua de (David) de Miguel Ángel, obras de Botticelli en la Galería Uffizi y la catedral de Santa María de la Flor. Su variado paisaje natural abarca los escabrosos montes Apeninos, las playas de la isla de Elba en el mar Tirreno, y los olivares y viñedos de Chianti.",
            imgs: [
                "Imagenes/Toscana.avif",
                "Imagenes/Toscana2.avif",
                "Imagenes/Toscana3.avif",
                "Imagenes/Toscana4.avif"
            ]
        },

        "Tulum": {
            desc: "Paseo en ATV y tirolesas en la selva: Recorre senderos en cuatrimoto, vuela en circuitos de tirolesas y desciende a cenotes ocultos con operadores como Tripadvisor - Tulum Adventure Riviera Maya.Esnórquel y buceo en cenotes: Explora cavernas subterráneas de aguas cristalinas, estalactitas y estalagmitas (como en Cenotes Casa Tortuga).Visitas arqueológicas y naturaleza: Combina la historia maya visitando las ruinas frente al mar de Tulum, Cobá o el sitio arqueológico de Muyil en la reserva de Sian Ka",
            imgs: [
                "Imagenes/Tulumaventura.jpg",
                "Imagenes/Tulumaventura1.webp",
                "Imagenes/Tulumaventura2.webp",
                "Imagenes/Tulumaventura4.webp"
            ]
        },
        
        "Barrancas del Cobre": {
            desc: "Principales atracciones y actividades, ZipRider: Una de las tirolesas más largas del mundo, con un recorrido de 2,538 metros donde se alcanzan velocidades de 80 a 135 km/h.,Teleférico Barrancas: Uno de los teleféricos más largos del mundo, con 3 kilómetros de cable sin torres intermedias y capacidad para 60 pasajeros,Circuito de Tirolesas: Un recorrido con 7 tirolesas y puentes colgantes sobre los cañones. Vía Ferrata: Incluye tramos de escalada, 5 puentes colgantes, un salto de Tarzán y un rappel de 48 metros.",
            imgs: [
                "Imagenes/Barrancas del Cobre.png",
                "Imagenes/Barrancas del Cobre2.jpg",
                "Imagenes/Barrancas del Cobre3.jpeg",
                "Imagenes/Barrancas del Cobre4.jpeg"
            ]
        },

        "Nevado de Toluca": {
            desc: "Senderismo en el Cráter (Laguna del Sol y Laguna de la Luna): Caminatas de 3.5 a 5 horas dentro del cráter volcánico para contemplar sus aguas cristalinas y formaciones rocosas.Ascenso a las Cimas (Pico del Águila o Pico del Fraile): Rutas de mayor exigencia física y técnica para montañistas.Ruta de los Túneles: Un recorrido alternativo de aproximadamente 14 km entre bosques y túneles de piedra en las faldas del volcán.",
            imgs: [
                "Imagenes/Nevado de Toluca.jpg",
                "Imagenes/Nevado de Toluca2.jpg",
                "Imagenes/Nevado de Toluca3.jpg",
                "Imagenes/Nevado de Toluca4.jpg"
            ]
        },

        "Huasteca Potosina": {
            desc: "Rafting (aguas bravas): Se practica en el Río Tampaón (rápidos de clase III ideales para disfrutar la adrenalina y el color azul del agua) y en tramos del Río Micos o El Meco. Salto de cascadas: En la Cascada de Micos puedes hacer una secuencia de saltos desde diferentes alturas con chaleco salvavidas y equipo de protección.Rappel y barranquismo: Descenso con cuerdas por las paredes de agua en lugares como la Cascada de Minas Viejas o cerca de la Cascada de Tamul.",
            imgs: [
                "Imagenes/Huasteca Potosina1.jpg",
                "Imagenes/Huasteca Potosina2.jpg",
                "Imagenes/Huasteca Potosina3.jpg",
                "Imagenes/Huasteca Potosina4.jpeg"
            ]
        },

        "Everest Base Camp": {
            desc: "Duración: 12 a 14 días de caminata (más días en Katmandú para traslados y aclimatación).Altitud máxima: Se alcanzan los 5,364 metros en el Campamento Base y los 5,545 metros en el mirador de Kala Patthar.Ruta y paisaje: Comienza con un vuelo a Lukla, atravesando puentes colgantes, bosques de rododendros, aldeas Sherpa, monasterios tibetanos y la morrena del Glaciar Khumbu.",
            imgs: [
                "Imagenes/Everest Base Camp1.jpg",
                "Imagenes/Everest Base Camp2.avif",
                "Imagenes/Everest Base Camp3.webp",
                "Imagenes/Everest Base Camp4.webp"
            ]
        },

        "Safari en Kenia": {
            desc: "Masái Mara: La reserva más famosa de Kenia, hogar de los Cinco Grandes (león, leopardo, elefante, rinoceronte y búfalo) y escenario de la gran migración de ñus.Parque Nacional de Amboseli: Ideal para ver grandes manadas de elefantes con el majestuoso monte Kilimanjaro como fondo despejado.Parque Nacional de Tsavo East y West: Uno de los parques más grandes y antiguos, conocido por sus elefantes rojos y paisajes volcánicos.",
            imgs: [
                "Imagenes/Safari en Kenia.png",
                "Imagenes/Safari en Kenia2.webp",
                "Imagenes/Safari en Kenia3.jpg",
                "Imagenes/Safari en Kenia4.webp",
                "Imagenes/Safari en Kenia5.png"
            ]
        },

        "Izta-Popo": {
            desc: "Senderismo y montañismo: Rutas ideales para principiantes y avanzadas, como el ascenso hacia La Joya, la ruta a la Boca de Tiburón o recorridos por los manantiales.Ecoturismo y recreación: Centros ecoturísticos con lagos, paseos a caballo, ciclismo de montaña, tirolesa y cuatrimotos.Cultura: Visita al museo y registro en el histórico Paso de Cortés.",
            imgs: [
                "Imagenes/Izta-Popo.jpg",
                "Imagenes/Izta-Popo2.jpg",
                "Imagenes/Izta-Popo3.jpg",
                "Imagenes/Izta-Popo4.jpg"
            ]
        },

        "Cañón del Sumidero": {
            desc: "Recorrido en lancha por el río Grijalva:• Duración: Alrededor de 2 horas.Embarcaderos principales: Chiapa de Corzo y Cahuaré (cerca de Tuxtla Gutiérrez).Costo referencial: Entre 350 y 400 MXN por persona para el paseo en lancha, más una tarifa de acceso al parque federal de aproximadamente 120-125 MXN.Qué ver: Paredes verticales de roca de hasta 1,000 metros de altura, el famoso Árbol de Navidad (formación de musgo y agua), cocodrilos de pantano, monos araña y diversas aves.",
            imgs: [
                "Imagenes/Cañón del Sumidero1.jpg",
                "Imagenes/Cañón del Sumidero2.jpg",
                "Imagenes/Cañón del Sumidero3.webp",
                "Imagenes/Cañón del Sumidero5.jpg",
                "Imagenes/Cañón del Sumidero4.jpg"
            ]
        },

        "Sierra Gorda": {
            desc: "Kayak y tubing: Recorridos guiados por el río Santa María (en la zona de Arroyo Seco) con rápidos clase 1 y paisajes de la cañada.Cuatrimotos y 4x4 (RZR): Expediciones todoterreno que bajan desde la serranía de San Joaquín hasta el fondo del cañón y el río Extoraz, finalizando en campamentos ecoturísticos.Trekking y senderismo: Rutas de larga distancia como la Travesía Sierra Gorda de 100 km, o caminatas desde el Mirador Cuatro Palos hasta comunidades como Bucareli.Cañonismo y grutas: Exploración de pozas turquesa en Puente de Dios (Río Escanela), la Cueva del Agua en Valle Verde y circuitos con tirolesa y puentes colgantes en Las Trancas.",
            imgs: [
                "Imagenes/Cañón del Sumidero1.jpg",
                "Imagenes/Cañón del Sumidero2.jpg",
                "Imagenes/Cañón del Sumidero3.webp",
                "Imagenes/Cañón del Sumidero5.jpg",
                "Imagenes/Cañón del Sumidero4.jpg"
            ]
        },

        "El Chepe": {
            desc: "• Barrancas del Cobre / Divisadero: Es la parada estelar para admirar los cañones.Parque Aventura Barrancas del Cobre (en Divisadero):Teleférico: Cruza parte de las barrancas con capacidad de 60 pasajeros.Tirolesas y ZipRider: Circuitos de alta velocidad, incluyendo una de las tirolesas más largas del mundo.Vía Ferrata: Incluye rappel (48 metros), puentes colgantes y el salto de Tarzán.Pueblo Mágico de Creel: Puerta de entrada a la Sierra Tarahumara y a la cultura rarámuri",
            imgs: [
                "Imagenes/El Chepe1.jpg",
                "Imagenes/El Chepe2.jpg",
                "Imagenes/El Chepe3.jpg",
                "Imagenes/El Chepe4.jpg",
                "Imagenes/El Chepe5.jpg"
            ]
        }

    };

/* =========================================================
   LÓGICA DEL MODAL DE DESTINOS
========================================================= */
const modal = document.getElementById('destinoModal');
const modalClose = document.getElementById('modalClose');
const modalTrack = document.getElementById('modalTrack');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
let modalIndex = 0;

function abrirModalDestino(nombre) {
    const data = destinosData[nombre];
    if (!data) return;

    modalTitle.textContent = nombre;
    modalDesc.textContent = data.desc;

    modalTrack.innerHTML = "";
    data.imgs.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = nombre;
        modalTrack.appendChild(img);
    });

    modalIndex = 0;
    actualizarModalTrack();
    modal.classList.add("active");
}

function actualizarModalTrack() {
    modalTrack.style.transform = `translateX(-${modalIndex * 100}%)`;
}

function cerrarModalDestino() {
    modal.classList.remove("active");
}

modalClose.addEventListener("click", cerrarModalDestino);
modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModalDestino();
});

document.getElementById('modalPrev').addEventListener('click', () => {
    const total = modalTrack.children.length;
    modalIndex = (modalIndex - 1 + total) % total;
    actualizarModalTrack();
});

document.getElementById('modalNext').addEventListener('click', () => {
    const total = modalTrack.children.length;
    modalIndex = (modalIndex + 1) % total;
    actualizarModalTrack();
});

// Detectar clics en carruseles para abrir modal
document.querySelectorAll("[data-carousel]").forEach(carousel => {
    carousel.querySelectorAll(".carousel-slide").forEach(slide => {
        slide.addEventListener("click", () => {
            const h4 = slide.querySelector("h4");
            if (h4 && destinosData[h4.textContent.trim()]) {
                abrirModalDestino(h4.textContent.trim());
            }
        });
    });
});


/* =========================================================
   MODAL DE EXPERIENCIAS
========================================================= */
const experienceModal = document.getElementById('experienceModal');
const expModalClose = document.getElementById('expModalClose');
const expModalTrack = document.getElementById('expModalTrack');
const expModalTitle = document.getElementById('expModalTitle');
const expModalContent = document.getElementById('expModalContent');

const experienciasData = {
    destinos: {
        titulo: "Destinos Especiales",
        contenido: `
            <p>Lugares seleccionados para que descubras nuevas perspectivas. Desde rincones ocultos hasta maravillas del mundo, te llevamos a dónde siempre quisiste estar.</p>
            <p>Consulta con nuestros asesores los destinos que tenemos disponibles para ti.</p>
        `,
        imgs: [
            "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800"
        ]
    },
    hospedaje: {
        titulo: "Hospedaje de Lujo",
        contenido: `
            <p>Hoteles de clase mundial, resorts Todo Incluido y suites frente al mar. Descansa en espacios diseñados para tu máximo confort y relajación.</p>
        `,
        imgs: [
            "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
        ]
    },
    aventura: {
        titulo: "Actividades y Aventura",
        contenido: `
            <p>Buceo, tours gastronómicos, safaris o caminatas. Planeamos las experiencias que más buscas para que cada día sea una nueva aventura.</p>
        `,
        imgs: [
            "Imagenes/aventura.jpg"
        ]
    }
};

let expModalIndex = 0;

function abrirExperiencia(tipo) {
    const data = experienciasData[tipo];
    if (!data) return;

    expModalTitle.textContent = data.titulo;
    expModalContent.innerHTML = data.contenido;

    expModalTrack.innerHTML = "";
    data.imgs.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        expModalTrack.appendChild(img);
    });

    expModalIndex = 0;
    actualizarExpModalTrack();
    experienceModal.classList.add("active");
}

function actualizarExpModalTrack() {
    expModalTrack.style.transform = `translateX(-${expModalIndex * 100}%)`;
}

function cerrarExpModal() {
    experienceModal.classList.remove("active");
}

expModalClose.addEventListener("click", cerrarExpModal);
experienceModal.addEventListener("click", (e) => {
    if (e.target === experienceModal) cerrarExpModal();
});

document.getElementById('expModalPrev').addEventListener('click', () => {
    const total = expModalTrack.children.length;
    expModalIndex = (expModalIndex - 1 + total) % total;
    actualizarExpModalTrack();
});

document.getElementById('expModalNext').addEventListener('click', () => {
    const total = expModalTrack.children.length;
    expModalIndex = (expModalIndex + 1) % total;
    actualizarExpModalTrack();
});


/* =========================================================
   MODAL DE MEDIA (FLYERS Y VIDEOS)
========================================================= */

const mediaModal = document.getElementById('mediaModal');
const mediaModalClose = document.getElementById('mediaModalClose');
const mediaTrack = document.getElementById('mediaTrack');
const mediaTitle = document.getElementById('mediaTitle');
let mediaIndex = 0;

// Configuración de tus medios (imágenes y videos)
const mediaData = {
    'sandos': {
        titulo: 'Promociones Sandos',
        items: [
            'Imagenes/FLYERSANDOS.jpeg',
            'Imagenes/sandos-caracol1.jpeg',
            'Imagenes/sandos-caracol2.jpeg',
            'Imagenes/sandos-caracol3.jpeg',
            'Imagenes/sandos-caracol4.jpeg',
            'Imagenes/sandos-caracol5.jpeg',
            'Imagenes/sandos-caracol6.jpeg',
            'Imagenes/sandos-caracol7.jpeg',
            'Imagenes/sandos-caracol8.jpeg',
            'Imagenes/sandos-caracol9.jpeg',
            'Imagenes/sandos-caracol10.jpeg'
        ]
    },

    'amatte': {
        titulo: 'Promociones Amatte',
        items: [
            'Imagenes/FLYERAMATTE.jpeg',
            'Imagenes/AMATTE.jpeg',
            'Imagenes/AMATTE1.jpeg',
            'Imagenes/AMATTE2.jpeg',
            'Imagenes/AMATTE3.jpeg',
            'Imagenes/AMATTE4.jpeg',
            'Imagenes/AMATTE5.jpeg',
            'Imagenes/AMATTE7.jpeg',
            'Imagenes/AMATTE8.jpeg',
            'Imagenes/AMATTE9.jpeg',
            'Imagenes/AMATTE10.jpeg',
            'Imagenes/AMATTE11.jpeg',
            'Imagenes/AMATTE12.jpeg'
        ]
    },

    'acapulco': {
        titulo: 'Promociones Acapulco',
        items: [
            'Imagenes/FLYERCOACAPULCO.jpeg',
            'Imagenes/acapulco1.jpeg',
            'Imagenes/acapulco1.jpeg',
            'Imagenes/acapulco2.jpeg',
            'Imagenes/acapulco3.jpeg',
            'Imagenes/acapulco4.jpeg',
            'Imagenes/acapulco5.jpeg',
            'Imagenes/acapulco6.jpeg',
            'Imagenes/acapulco7.jpeg',
            'Imagenes/acapulco8.jpeg',
            'Imagenes/acapulco9.jpeg',
            'Imagenes/acapulco10.jpeg',
            'Imagenes/acapulco11.jpeg',
            'Imagenes/acapulco12.jpeg'
        ]
    },

    'video1': {
        titulo: 'Video Amatte',
        items: [
            '<video width="100%" height="100%" controls style="object-fit: contain; background: #000;"><source src="Imagenes/amatte.mp4" type="video/mp4"></video>'
        ]
    },

    'video2': {
        titulo: 'Video Sandos Caracol',
        items: [
            '<video width="100%" height="100%" controls style="object-fit: contain; background: #000;"><source src="Imagenes/sandos-caracol.mp4" type="video/mp4"></video>'
        ]
    }
};

function abrirMedia(tipo) {
    const data = mediaData[tipo];
    if (!data) return;

    mediaTitle.innerText = data.titulo;
    mediaTrack.innerHTML = '';

    data.items.forEach(item => {
        // Si es iframe o video, lo insertamos tal cual
        if (item.startsWith('<iframe') || item.startsWith('<video')) {
            const div = document.createElement('div');
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.flexShrink = '0';
            div.innerHTML = item;
            mediaTrack.appendChild(div);
        } else {
            // Si es imagen, creamos la etiqueta img
            const img = document.createElement('img');
            img.src = item;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.flexShrink = '0';
            img.style.background = '#F8FFFF';
            mediaTrack.appendChild(img);
        }
    });

    mediaIndex = 0;
    updateMediaTrack();
    mediaModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateMediaTrack() {
    mediaTrack.style.transform = `translateX(-${mediaIndex * 100}%)`;
}

mediaModalClose.addEventListener('click', () => {
    mediaModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

mediaModal.addEventListener('click', (e) => {
    if (e.target === mediaModal) {
        mediaModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

document.getElementById('mediaPrev').addEventListener('click', () => {
    const total = mediaTrack.children.length;
    if (total > 0) {
        mediaIndex = (mediaIndex > 0) ? mediaIndex - 1 : total - 1;
        updateMediaTrack();
    }
});

document.getElementById('mediaNext').addEventListener('click', () => {
    const total = mediaTrack.children.length;
    if (total > 0) {
        mediaIndex = (mediaIndex < total - 1) ? mediaIndex + 1 : 0;
        updateMediaTrack();
    }
});

/* =========================================================
   REDIRIGIR CON ORIGEN
========================================================= */
function redirigirConOrigen(origen) {
    // Crear input hidden temporal para guardar el origen
    let input = document.getElementById('origenRegistro');
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'origenRegistro';
        input.name = 'origenRegistro';
        travelForm.appendChild(input);
    }
    input.value = origen;

    // Scroll al formulario
    document.getElementById('registro').scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   CUMPLIMIENTO LFPDPPP — COOKIES
========================================================= */
const COOKIE_KEY = 'destiva_cookie_consent_v1';

function getCookieConsent() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
}

function setCookieConsent(obj) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(obj));
}

function aceptarCookies(tipo) {
    const ahora = new Date().toISOString();
    let consent;
    if (tipo === 'todas') {
        consent = { necesarias:true, preferencias:true, analiticas:true, publicidad:true, fecha:ahora, version:'1.0' };
    } else {
        consent = { necesarias:true, preferencias:false, analiticas:false, publicidad:false, fecha:ahora, version:'1.0' };
    }
    setCookieConsent(consent);
    document.getElementById('cookieBanner').classList.remove('show');
    registrarEvidencia('cookies', tipo, consent);
}

function abrirConfigCookies() {
    const c = getCookieConsent();
    if (c) {
        document.getElementById('cookPref').checked = c.preferencias;
        document.getElementById('cookAnaliticas').checked = c.analiticas;
        document.getElementById('cookPublicidad').checked = c.publicidad;
    }
    document.getElementById('cookieConfigModal').classList.add('active');
    document.getElementById('cookieBanner').classList.remove('show');
}

function cerrarConfigCookies() {
    document.getElementById('cookieConfigModal').classList.remove('active');
}

function guardarConfigCookies() {
    const consent = {
        necesarias: true,
        preferencias: document.getElementById('cookPref').checked,
        analiticas: document.getElementById('cookAnaliticas').checked,
        publicidad: document.getElementById('cookPublicidad').checked,
        fecha: new Date().toISOString(),
        version: '1.0'
    };
    setCookieConsent(consent);
    cerrarConfigCookies();
    registrarEvidencia('cookies_config', 'personalizado', consent);
}

// Mostrar banner si no hay consentimiento previo
window.addEventListener('DOMContentLoaded', () => {
    if (!getCookieConsent()) {
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 800);
    }
});


/* =========================================================
   MODALES DE AVISOS LEGALES
========================================================= */
function abrirAviso(tipo) {
    const id = tipo === 'simplificado' ? 'avisoSimplificadoModal' : 'avisoIntegralModal';
    document.getElementById(id).classList.add('active');
}

function cerrarAviso(tipo) {
    const id = tipo === 'simplificado' ? 'avisoSimplificadoModal' : 'avisoIntegralModal';
    document.getElementById(id).classList.remove('active');
}

// Interceptar clics en enlaces a avisos
document.querySelectorAll('a[href="#aviso-simplificado"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); abrirAviso('simplificado'); });
});
document.querySelectorAll('a[href="#aviso-integral"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); abrirAviso('integral'); });
});


/* =========================================================
   EVIDENCIA EN FIREBASE
========================================================= */
async function registrarEvidencia(tipo, valor, detalle) {
    if (!db) return;
    try {
        await db.collection('consentimientos').add({
            tipo: tipo,
            valor: valor,
            detalle: detalle || {},
            userAgent: navigator.userAgent,
            url: window.location.href,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            avisoVersion: '1.0'
        });
    } catch (e) {
        console.warn('No se pudo registrar evidencia:', e);
    }
}