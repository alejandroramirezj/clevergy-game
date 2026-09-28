# ⚡ CLEVERGY GAME: RETREAT - THE LEGEND OF THE TEAM

Un juego arcade de plataformas retro en 2D creado para el equipo de **Clevergy**.

## 🎮 Argumento
El código fuente del Retreat de Clevergy ha sido corrompido y robado por hordas de **Emails urgentes**, **Reuniones interminables ("¿Tienes 5 minutos?")** y el temido Boss **THE EMAIL CHAIN**. 

Elige a cualquiera de los **18 miembros del equipo** (cada uno con habilidades, físicas y mecánicas personalizadas) para derrotar a los enemigos de oficina, recoger cafés, rescatar los fragmentos de código y entrar en el salón de la fama.

---

## 👥 Miembros del Equipo y Habilidades

| Personaje | Icono | Rol / Forma | Habilidad Especial (X) |
|---|---|---|---|
| **Alejandro R.** | 🪰 | Mosca boxeadora | FLY PUNCH + Planear en salto (Spritesheet animado) |
| **Ale Graciano** | 🫒 | Botella de aceite | OIL SLIDE: Deslizamiento arrollador |
| **Álvaro Merino** | 🧮 | Calculadora | ERROR 404: Lanza operación matemática explosiva |
| **Álvaro** | 🎙️ | Micro de podcast | PODCAST ATTACK: Onda sonora de largo alcance |
| **Ana** | 🦁 | Escaladora leona | CLIMB MODE: Trepa paredes verticalmente |
| **Beltrán** | 🔵 | Dedal azul | THIMBLE SHIELD: Escudo de invulnerabilidad |
| **Bruno** | 🗿 | Tótem multicara | MULTIFACE: Efecto aleatorio según la cara del tótem |
| **Gonzalo** | 🥦 | Brócoli | BROCCOLI RAGE: Mini-brócolis aliados teledirigidos |
| **Javi** | ☭ | Señal comunista | WORKERS UNITED: Invoca trabajadores en marcha |
| **Jesús** | 🍺 | Cruzcampo | CRUZCAMPO SMASH: Impacto sísmico en suelo y aire |
| **José Luis** | 🖨️ | Impresora 3D | PRINT: Imprime hasta 3 plataformas flotantes |
| **Josu** | 🥮 | Panetón escalador | Bote diagonal y salto con rebote en paredes |
| **Juan** | 📻 | Microondas | MICROWAVE: Onda de calor perimetral (¡Ding!) |
| **Maca** | 🏐 | Pelota de voley | SPIKE: Bote incesante arrollador |
| **Manu** | 💪 | Forzudo | SUPER STEP: Salto gigante con impacto masivo |
| **Pablo** | 🍊 | Naranja | ORANGE ROLL: Rueda a toda velocidad |
| **Paloma** | 🕊️ | Paloma | FLY AWAY: Vuelo propulsado por barra de energía |
| **Silvia** | 👟 | Zapatilla | SPEEDRUN: Dash invulnerable a velocidad extrema |

---

## 🗺️ Mundos

La pantalla «Elige mundo» muestra 3 columnas, cada una con la estética de su mundo (en móvil vertical, un carrusel deslizable):

1. **La Oficina** — plataformas 2.5D en Google for Startups Campus Madrid, con el render de boli (`src/doodle/platform/`).
2. **Coworking Fight** — pelea estilo Smash de hasta 4 en la azotea del CINK, contra CPUs u online (`src/doodle/fight/`).
3. **BoliBic Tag** — laser tag en primera persona con el boli Bic por el CINK Coworking, con salas multijugador.

4. **Pantano de San Juan** — carreras de motos de agua (`src/doodle/race/`).

Todos los menús (portada, elección de mundo, briefing, modales y el deck Game Boy) comparten el estilo cuaderno de `src/ui/doodleTheme.css`, que se carga después de `style.css`.

Los antiguos mundos 2–5 del plataformas siguen definidos en `src/config/worlds.js` con `hidden: true`; basta con quitar esa marca para volver a mostrarlos.

---

## 🏢 Mundo 1 · La Oficina (plataformas 3D)

Plataformas 2.5D por Google for Startups Campus Madrid (la fábrica neomudéjar de ladrillo de la calle Moreno Nieto, con el Palacio Real y la Almudena al fondo). El nivel está en `platformLevel.js`: terraza con sombrillas, Campus Café con altillo, la torre de cinco plantas de coworking (ascensor, rejilla de ventilación y forjados con huecos alternos), las salas de cristal de arriba (fosos, sillas plegables), las gradas del auditorio y el jefe **EMAIL CHAIN** en el escenario del **Demo Day**, y la salida con la bandera.

- **Mecánicas:** salto variable, *coyote time*, búfer, salto en pared, pisotón, bloques ?, ladrillos, plataformas atravesables (▼ + salto), sillas plegables que se hunden, rejillas que te suben, pufs que rebotan, 3 corazones, cafeteras de control y 3 disquetes secretos.
- **Poderes originales:** Alejandro puñetazo + planeo · Ale se desliza · Álvaro M. bomba 404 que rebota · Álvaro onda de podcast · Ana trepa (mantén PODER en la pared) · Beltrán estocada + escudo (▼) · Bruno cara aleatoria · Gonzalo mini-brócolis · Javi trabajadores · Jesús smash / picado · **José Luis imprime plataformas (máx. 3, 9 s)** · Josu bote diagonal · Juan microondas · Maca modo pelota · Manu super step · Pablo rueda · Paloma vuela (mantén salto) · Silvia dash invulnerable.
- **Jefe:** salta, suelta emails y lanza ondas al caer; cuando se cansa, písale la cabeza (3 veces).

## 🚤 Mundo 4 · Pantano de San Juan (3D)

Carreras de motos de agua estilo kart por el Pantano de San Juan (Madrid): la presa, la playa de la Virgen de la Nueva, pinares, islotes de granito, veleros y un embarcadero. 3 vueltas, 6 pilotos.

- **Conducción:** acelera sola; derrapa en las curvas (azul → naranja) y suelta para el miniturbo; rampas, flechas de turbo y choques con boyas, islotes y rivales.
- **Objetos de oficina:** ☕ café turbo, ✉️ email (sigue el canal), 📅 reunión teledirigida al de delante, 💧 mancha de tinta y ⭐ modo focus (invencible). Los de atrás reciben mejores objetos.
- **Online P2P:** hasta 6 personas y el resto CPU (las simula el anfitrión). Cada móvil manda su moto; quien lanza un objeto decide el impacto y el anfitrión lo reenvía. Si alguien se va, la CPU toma su moto.

## 🥊 Mundo 2 · Coworking Fight (3D, estilo Smash)

Hasta 4 luchadores en la azotea del CINK (terraza con bordes y tres bancos colgados, las Cuatro Torres al fondo). No hay barra de vida: cada golpe suma **porcentaje** y cuanto más llevas, más lejos sales volando; si cruzas la zona límite pierdes una de tus **3 vidas**.

- **Golpes según hacia dónde apuntes:** combo neutro, golpe fuerte (lateral a tope), arriba, abajo; en el aire neutro, delante, arriba y picado. Especial de cada personaje y **súper salto** (▲ + especial) para volver.
- **Defensa:** escudo (se gasta y se rompe), esquiva rodando y esquiva en el aire; te agarras a los bordes de la terraza.
- **Objetos:** grapadora y bomba de post-its (se lanzan), Boli Bic gigante (golpes más fuertes), café (−25 %) y modo focus (invencible).
- **Modos:** contra 1–3 CPUs, u online hasta 4 (el anfitrión puede rellenar con CPUs). Cada móvil simula su luchador; el anfitrión simula las CPUs, reparte objetos, reenvía mensajes y arbitra.

### Mando táctil común (`src/doodle/touchPad.js`)
Los dos mundos 3D usan el mismo componente, pensado para móvil en horizontal: joystick flotante bajo el pulgar izquierdo y hasta 4 botones de cuaderno en abanico bajo el derecho (el grande es la acción principal). Arrastrar en el resto de la pantalla apunta.

---

## ✏️ Mundo 3 · BoliBic Tag (3D)

**Escenario: CINK Coworking (Infanta Mercedes, Madrid)** — `src/doodle/cinkLevel.js`. Empiezas en la calle, en la esquina de Pedro Villar con Limonero, y entras por las puertas automáticas de la esquina redonda.
- **Planta baja:** recepción con Victoria (te saluda; si le disparas, se queja), mesa alta con taburetes, comedor con mesas de madera, 4 microondas y vending, terraza con césped, y salas 1–4.
- **Primera planta:** hot desk y, subiendo la escalera a la derecha, la oficina de Clevergy en la esquina redonda (3 mesas, estantería con café, pizarra).
- **Segunda planta:** oficinas 201–203. Azotea con la torre cilíndrica.
- Logo y carteles hechos con trazos de tinta (`inkText.js`). Los enemigos aparecen en tu planta y te siguen si cambias de piso; el jefe aterriza en la terraza.

Shooter en primera o tercera persona dibujado a boli sobre un cuaderno (Three.js). Sobrevive a 5 oleadas de emails, invitaciones de calendario y «¿tienes 5 minutos?» y derrota a **INBOX INFINITO**.

- **Look de boli:** render en dos pasadas (`src/doodle/doodleRender.js`): la escena escribe luz/tinta/normal en un render target y un shader de pantalla completa dibuja contornos, rayado anclado al mundo y papel de libreta.
- **Tercera persona:** tu personaje aparece como pegatina recortada usando sus mismos sprites (`doodleSticker.js`). Cambia con **V**, el botón 👁 o **Y** en el mando.
- **Controles:** teclado + ratón, mando físico (sticks, RT dispara, A salta, B dash) y en móvil: en vertical el deck Game Boy del resto de mundos (▲▼ andar, ◀▶ girar, **B** disparar con autoapuntado, **A** saltar); en horizontal un joystick flotante que aparece bajo el pulgar izquierdo y botones de cuaderno para disparar (arrástralo para apuntar mientras disparas), saltar, dash y recargar. Arrastra sobre la pantalla para apuntar.
- **Multijugador en sala (hasta 6):** «Crear sala» genera un código de 5 letras y los demás pulsan «Unirse». Es P2P por WebRTC con PeerJS (`doodleNet.js`). Cada jugador sale de un punto distinto del mapa. Quien crea la sala elige el modo:
  - **⚔️ Todos contra todos:** los disparos dañan a los demás jugadores; gana el primero en llegar a 10 bajas. Reapareces a los 3 s en el punto más alejado del resto, con 2 s de invulnerabilidad. Los rivales no se ven a través de las paredes y aparecen cafés por el mapa.
  - **🤝 Cooperativo:** todos contra las oleadas; el anfitrión simula enemigos y puntos. Si caes, vuelves en la siguiente oleada; la partida acaba si caéis todos.
- Se carga bajo demanda (chunk aparte), así que no engorda el bundle del plataformas.

---

## 🕹️ Controles

- **Móvil en horizontal** (el uso principal): joystick flotante a la izquierda y botones de acción a la derecha, iguales en los 4 mundos.
- **Móvil en vertical**: mando Game Boy. En los menús la cruceta mueve el foco, ◀ ▶ cambian de personaje o de mundo, **A** pulsa el botón marcado y **B** vuelve atrás (`src/ui/deckNav.js`).
- **Teclado**: A/D o flechas para moverse, Espacio para saltar, J acción, K especial, Tab o 1-2-3 para cambiar de compañero, Esc pausa, M música.
- **Mando** de consola: cualquiera compatible con la Gamepad API.

---

## 🚀 Cómo ejecutar el proyecto

```bash
# 1. Entrar en el directorio del proyecto
cd /Users/komon/Documents/codigos/clevergy-game

# 2. Instalar dependencias (Vite)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción (despliegue en Cloudflare Pages / Vercel)
npm run build
```

---

## 🏗️ Estructura del Código

```
clevergy-game/
├── index.html              # Portada, elección de mundo, ranking, historia y deck Game Boy
├── functions/api/          # Cloudflare Pages Functions: ranking y login con Google
├── server/                 # Utilidades de las Functions (verificación del token, sesión)
├── migrations/             # Migraciones de D1
├── public/                 # favicon (la R a rayones), sprites y qr.html
└── src/
    ├── main.js             # Arranque: menús y carga bajo demanda de los 4 mundos 3D
    ├── config/             # Personajes (y su poder) y mundos
    ├── engine/             # Audio de menús, mando del deck y sprites/avatares
    ├── game/               # Estado, ranking, login, enlaces por personaje
    ├── ui/                 # Menús: portada, mundos, ranking, historia, tema de cuaderno
    └── doodle/             # Motor a boli (Three.js) y los mundos:
        ├── platform/       #   1 · La Oficina
        ├── fight/          #   2 · Coworking Fight
        ├── doodleWorld.js  #   3 · BoliBic Tag (+ cinkLevel.js)
        └── race/           #   4 · Pantano de San Juan
```

## 🔗 Enlaces por personaje (QR)

`https://<dominio>/jose-luis`, `/paloma`, `/alvaro-merino`… abren el juego con ese personaje ya elegido (también vale el id o el nombre sin tildes). La página **`/qr.html`** genera los 18 QR listos para imprimir (`/qr.html?base=https://otro-dominio` para otro dominio). Código: `src/game/charRoute.js`.

## 🔐 Cuenta con Google, progreso y ranking

Login con "Iniciar sesión con Google" (Google Identity Services): el navegador obtiene un ID token y `functions/api/auth/google.js` verifica su firma contra las claves de Google, guarda el usuario en D1 y deja una cookie de sesión firmada. Es opcional: botón **Entrar** en la portada, aviso en el ranking y bienvenida con tu cara si llegas por un QR. Al entrar por primera vez eliges qué personaje eres (por defecto, el del QR) y lo confirmas. Con sesión, tu nombre en el ranking es el de tu cuenta y el progreso de los mundos se guarda en la cuenta.

Puesta en marcha (una vez):

1. Google Cloud Console → APIs y servicios → Credenciales → **ID de cliente de OAuth · Aplicación web**. En *Orígenes de JavaScript autorizados* añade el dominio de Pages (y `http://localhost:8788` si pruebas con `wrangler pages dev`).
2. Cloudflare Pages → Settings → Variables: `GOOGLE_CLIENT_ID` (el ID de cliente), `SESSION_SECRET` (cadena aleatoria larga, como secreto), opcional `ALLOWED_DOMAIN=clever.gy` (sólo el equipo) y `REQUIRE_LOGIN=1` (sólo cuentan récords con sesión).
3. Migraciones de D1:
   `npx wrangler d1 execute clevergy-game-db --remote --file=migrations/0002_add_world.sql`
   `npx wrangler d1 execute clevergy-game-db --remote --file=migrations/0003_users.sql`

API: `GET /api/auth/config`, `POST /api/auth/google`, `POST /api/auth/logout`, `GET|POST /api/me` (personaje y progreso), `GET|POST /api/leaderboard` (ahora con `world` para el ranking por mundo). Todos los mundos 3D envían su puntuación al ranking al terminar.
