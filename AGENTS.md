# AGENTS.md

## Objetivo

Construir una app **100% estática**, hecha solo con **HTML + CSS + JavaScript**, que permita **visualizar de forma aproximada** los efectos de la **tDCS** y la **HD-tDCS** sobre un cerebro 3D.

La app debe funcionar **sin backend**, **sin Python**, **sin npm**, **sin instalación**, y debe poder abrirse simplemente haciendo **doble clic en `index.html`** en un ordenador normal.

## Restricciones duras

Estas restricciones son obligatorias y no deben romperse:

1. **Todo debe correr en cliente**.
2. **No usar backend** de ningún tipo.
3. **No usar Node.js en ejecución**.
4. **No requerir build step**.
5. **No requerir servidor local**.
6. **No usar dependencias que fallen por CORS al abrir con `file://`**.
7. La app debe funcionar abriendo directamente el archivo `index.html`.
8. La app debe ser una **aproximación visual y heurística**, no una simulación biofísica FEM real.
9. No prometer resultados clínicos reales.
10. Debe ser fácilmente distribuible como una carpeta con archivos estáticos.

## Qué debe hacer la app

La app debe permitir:

1. Ver un **cerebro en 3D** de forma interactiva.
2. Ver una **superficie externa de cabeza/cuero cabelludo** sencilla.
3. Mostrar **electrodos** sobre la cabeza.
4. Soportar:
   - **tDCS estándar bipolar**
   - **HD-tDCS 4x1**
5. Elegir una **región cerebral objetivo** desde una lista.
6. Elegir una intención:
   - **Estimular**
   - **Inhibir**
7. Mostrar una **propuesta de colocación de electrodos** para intentar aproximarse a ese objetivo.
8. Pintar sobre el cerebro un **mapa visual aproximado** de mayor o menor influencia.
9. Mostrar también una **vista 2D tipo cap EEG** para que se entienda rápido dónde van los electrodos.
10. Permitir cambiar entre varios montajes y compararlos visualmente.

## Enfoque científico permitido

La app **NO** debe intentar resolver modelos eléctricos realistas.

En su lugar, debe usar un enfoque **heurístico y educativo**, basado en:

- posiciones estandarizadas del sistema **10-20 / 10-10**,
- un conjunto de **reglas predefinidas**,
- targets cerebrales aproximados,
- mapas de influencia simplificados,
- una lógica de proximidad entre electrodos y áreas corticales.

La app debe dejar claro en la interfaz que:

- es una **visualización orientativa**,
- no sustituye simulación personalizada,
- no debe interpretarse como recomendación clínica.

## Filosofía de implementación

Hay que priorizar:

- portabilidad,
- claridad visual,
- facilidad de uso,
- cero instalación,
- robustez offline,
- código simple y mantenible.

Hay que evitar:

- complejidad excesiva,
- frameworks innecesarios,
- dependencia de pipelines de build,
- cargas remotas obligatorias.

## Stack técnico

Usar exclusivamente:

- `index.html`
- `style.css`
- `app.js`

Se permiten librerías JS cargadas por archivo local si quedan incluidas dentro de la carpeta del proyecto.

### Recomendación
Usar **Three.js** en archivo local para el 3D.

No depender de CDN si puede evitarse. Si se usa una librería externa, debe incluirse en la carpeta del proyecto para que funcione offline.

## Estructura mínima del proyecto

```text
/tdcs-app
  index.html
  style.css
  app.js
  /libs
    three.min.js
    OrbitControls.js
  /assets
    brain_placeholder.json (opcional)
    scalp_placeholder.json (opcional)
    cap2d.png (opcional)
```

La app debe poder funcionar incluso si finalmente el cerebro y la cabeza se representan mediante **geometrías simplificadas** en lugar de mallas anatómicas complejas.

## Requisitos de interfaz

La interfaz debe tener estas zonas:

### 1. Panel lateral de control
Debe incluir:

- selector de modo:
  - `tDCS estándar`
  - `HD-tDCS 4x1`
- selector de región objetivo
- selector de intención:
  - `Estimular`
  - `Inhibir`
- selector o slider de intensidad relativa visual
- botón:
  - `Generar montaje`
- lista de montajes sugeridos
- leyenda de colores
- aviso científico breve

### 2. Vista principal 3D
Debe mostrar:

- cabeza / scalp
- cerebro
- electrodos
- overlay visual aproximado de influencia

Debe permitir:

- rotar
- zoom
- pan

### 3. Vista 2D tipo cap
Debe mostrar una cabeza esquemática desde arriba con posiciones EEG y electrodos activos resaltados.

### 4. Panel de información
Debe mostrar:

- nombre del target
- hemisferio
- tipo de montaje
- electrodos propuestos
- polaridad aproximada
- explicación breve del porqué del montaje
- advertencia de que es una aproximación

## Targets cerebrales mínimos

La app debe incluir como mínimo estos objetivos amigables:

- DLPFC izquierda
- DLPFC derecha
- M1 izquierda
- M1 derecha
- vmPFC
- OFC izquierda
- OFC derecha
- IFG izquierda
- IFG derecha
- TPJ izquierda
- TPJ derecha
- PPC izquierda
- PPC derecha
- SMA
- V1

Cada target debe tener internamente:

- nombre amigable
- hemisferio
- coordenada aproximada 3D en el cerebro
- posición scalp proxy aproximada
- lista de montajes preferidos

## Sistema de electrodos

Debe existir un conjunto fijo de posiciones aproximadas tipo EEG:

- Fp1
- Fp2
- F3
- F4
- F7
- F8
- Fz
- FC1
- FC2
- C3
- C4
- Cz
- P3
- P4
- Pz
- O1
- O2
- T7
- T8
- AF3
- AF4
- CP1
- CP2

Cada posición debe tener:

- coordenada 3D aproximada en la superficie de la cabeza
- coordenada 2D para la vista cap
- etiqueta visible

## Lógica de propuesta de montajes

La app debe usar reglas heurísticas simples.

### Para tDCS estándar
Debe proponer montajes de 2 electrodos:

- un electrodo principal
- un retorno

Ejemplos orientativos:

- DLPFC izquierda → F3 con retorno en Fp2 o supraorbital contralateral
- DLPFC derecha → F4 con retorno en Fp1
- M1 izquierda → C3 con retorno en Fp2
- M1 derecha → C4 con retorno en Fp1
- vmPFC → Fpz/Fz aproximado con retorno posterior
- V1 → O1/O2 o Oz aproximado con retorno frontal

### Para HD-tDCS 4x1
Debe proponer:

- 1 electrodo central
- 4 retornos alrededor

Ejemplos:
- centro en F3 con anillo AF3, F1, FC1, F5 aproximado
- centro en C3 con anillo FC1, C1, CP1, C5 aproximado

No hace falta que sea neuroanatómicamente perfecto. Debe ser visualmente coherente y consistente.

## Lógica de “estimular” e “inhibir”

La app puede usar esta simplificación de UI:

- `Estimular`:
  - resaltar el target con color cálido
  - colocar como principal el electrodo del target
- `Inhibir`:
  - invertir visualmente la polaridad del montaje
  - usar color frío predominante

Pero la app debe mostrar una advertencia textual visible:

> “Estimular/inhibir se usa aquí como simplificación visual. La respuesta fisiológica real depende de múltiples factores y esta app no realiza simulación biofísica personalizada.”

## Mapa de influencia visual

No usar simulación eléctrica real.

Usar un modelo heurístico como este:

1. Definir para cada electrodo una influencia espacial sobre la superficie cortical.
2. Modelar esa influencia con una caída gaussiana o por distancia.
3. Sumar influencias positivas y negativas según polaridad.
4. Normalizar el resultado.
5. Pintar el cerebro con un gradiente:
   - azul = menor / polaridad opuesta
   - gris = neutro
   - rojo / amarillo = mayor influencia relativa

También se puede añadir un “cono” o “mancha” de proyección desde el scalp al cerebro para reforzar el efecto visual.

## Visualización 3D

### Opción preferida
Usar Three.js con:

- una esfera deformada o malla simple como cerebro,
- una esfera externa semitransparente como scalp,
- pequeños discos o cilindros como electrodos,
- etiquetas flotantes opcionales.

### Si hay tiempo
Intentar usar una malla de cerebro low-poly incluida localmente.

### Si no hay tiempo
Usar una geometría simplificada estilizada pero bonita.

Lo importante es que:
- sea interactiva,
- sea clara,
- y permita ubicar bien las zonas.

## Vista 2D cap

La vista 2D debe ser sencilla y muy clara:

- círculo de cabeza
- nariz
- orejas opcionales
- puntos 10-20 / 10-10
- nombres de posiciones
- electrodos activos destacados
- polaridad visible (`+`, `-`, `return`, `center`)

Debe actualizarse al cambiar el target o el montaje.

## Datos internos

Toda la configuración debe vivir en JS como objetos simples.

Ejemplo de estructuras esperadas:

```js
const targets = [
  {
    id: "dlpfc_left",
    name: "DLPFC izquierda",
    hemisphere: "left",
    brainCoord: { x: -0.35, y: 0.45, z: 0.25 },
    scalpCoordName: "F3",
    preferredMontages: ["tdcs_f3_fp2", "hd_f3_ring"]
  }
];
```

```js
const electrodes = {
  F3: {
    scalp3D: { x: -0.28, y: 0.82, z: 0.42 },
    cap2D: { x: 120, y: 110 }
  }
};
```

```js
const montages = [
  {
    id: "tdcs_f3_fp2",
    mode: "tdcs",
    label: "F3 → Fp2",
    active: [
      { name: "F3", role: "anode" },
      { name: "Fp2", role: "cathode" }
    ],
    targets: ["dlpfc_left"]
  }
];
```

## Comportamiento esperado

### Al iniciar
La app debe cargar con:

- un cerebro 3D visible,
- un target por defecto,
- un montaje por defecto,
- una leyenda visible,
- un aviso científico visible.

### Al elegir target
La app debe:

1. actualizar el panel
2. elegir montajes compatibles
3. mostrar el mejor por defecto
4. pintar el mapa de influencia
5. actualizar la vista 2D

### Al cambiar de tDCS a HD-tDCS
La app debe:

- cambiar la lógica de montaje
- cambiar la lista sugerida
- actualizar electrodos y visualización

### Al cambiar entre estimular/inhibir
La app debe:

- invertir la polaridad visual
- actualizar colores
- actualizar la explicación textual

## Requisitos de calidad

El agente debe producir una app que sea:

- clara
- estable
- autocontenida
- fácil de entender
- bonita sin ser recargada

## Requisitos de código

- Código legible y comentado.
- Separar lógica de datos, render y UI.
- Evitar funciones gigantes.
- Evitar magia hardcodeada dispersa.
- Centralizar:
  - targets
  - electrodos
  - montajes
  - colores
  - parámetros visuales

## Requisitos de portabilidad

El resultado final debe poder comprimirse en ZIP y enviarse a otra persona.

Esa persona debe poder:

1. descomprimir
2. abrir `index.html`
3. usar la app inmediatamente

Sin instalar nada.

## Requisitos de entrega

El agente debe generar:

1. `index.html`
2. `style.css`
3. `app.js`

Y, si lo considera útil:

4. carpeta `libs/`
5. carpeta `assets/`

## Mejoras opcionales si sobran recursos

Solo si no complican la portabilidad:

- botón de capturar imagen
- botón de reset de cámara
- comparación rápida entre dos montajes
- toggle para mostrar/ocultar scalp
- intensidad visual ajustable
- tooltip sobre regiones y electrodos
- modo oscuro

## Lo que NO debe hacer el agente

No debe:

- crear backend
- usar Python
- requerir servidor
- usar npm obligatorio
- meter frameworks pesados innecesarios
- venderlo como simulación clínica real
- introducir complejidad excesiva
- bloquear el uso offline

## Prioridades absolutas

Si hay que sacrificar algo, sacrificar antes precisión anatómica que portabilidad.

Orden de prioridad:

1. que abra con doble clic
2. que sea visualmente clara
3. que permita elegir target y generar montaje
4. que soporte tDCS y HD-tDCS
5. que muestre cerebro 3D
6. que pinte influencia aproximada
7. que quede bonita

## Instrucción final al agente

Construye una app web completamente estática y offline, orientada a visualización educativa y planificación heurística aproximada de tDCS y HD-tDCS. Debe abrirse directamente con `index.html`, sin instalación ni servidor, y permitir elegir un target cerebral, elegir entre estimular o inhibir, visualizar el cerebro en 3D, mostrar electrodos y sugerir montajes de forma clara y usable. La prioridad máxima es la portabilidad y la experiencia visual, no la simulación biofísica real.
