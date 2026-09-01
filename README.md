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

## 🕹️ Controles

### Teclado
- **← / →** o **A / D**: Moverse
- **↑ / W / Espacio**: Saltar
- **X / J**: Usar habilidad especial
- **TAB**: Cambiar al siguiente compañero del equipo (Shift+TAB para anterior)
- **T**: Abrir / cerrar selector del equipo
- **M**: Activar / desactivar música chiptune
- **Enter**: Iniciar partida / revivir

### Pantalla Táctil (Móvil / Tablet)
- Botones en pantalla: **◀ ▶** (Mover), **▲** (Saltar), **✦** (Habilidad), **⇄** (Siguiente héroe), **👥** (Elegir equipo).
- Modo horizontal automático con aviso de rotación de pantalla.

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
├── index.html              # HTML principal y overlays arcade
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── public/
│   ├── favicon.svg         # Favicon estilo pixel art
│   └── sprites/
│       └── alejandro.png   # Spritesheet optimizado de Alejandro
└── src/
    ├── style.css           # Estilos arcade CRT, UI y botones táctiles
    ├── main.js             # Entrada y bucle principal (requestAnimationFrame)
    ├── config/
    │   ├── constants.js    # Constantes físicas, mapa y checkpoints
    │   └── characters.js   # Datos de los 18 personajes de Clevergy
    ├── engine/
    │   ├── audio.js        # Sintetizador chiptune y sfx con Web Audio API
    │   ├── input.js        # Input manager (teclado + controles táctiles)
    │   ├── physics.js      # Colisiones por tiles AABB y plataformas
    │   └── sprites.js      # Render pixel art y spritesheets animados
    ├── game/
    │   ├── state.js        # Estado global reactivo del juego
    │   ├── abilities.js    # Lógica de las 18 habilidades únicas
    │   ├── enemies.js      # IA de enemigos, esbirros y combate contra el Boss
    │   ├── renderer.js     # Renderizado por capas en Canvas 2D
    │   └── leaderboard.js  # Sistema de ranking y puntuaciones
    └── ui/
        └── overlays.js     # Menús (boot, equipo, game over, victoria)
```
