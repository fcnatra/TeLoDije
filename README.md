# Kata: Registro de Predicciones "Te Lo Dije"

## Problema
Muchas amistades terminan en debates sobre quién tenía razón en una predicción (ejemplo: "te dije que iba a llover").

## Contexto
Este kata consiste en construir una app simple que permita a cualquier persona dejar una predicción registrada (como un "tweet sellado") para revisarla después.

## Entrega Esperada
Un microproducto que permite a los usuarios guardar un "Yo predije que..." con una fecha y verlo después. La app consiste en un formulario para guardar predicciones y una vista para mostrarlas.

## Resumen de la Solución
- Aplicación web usando HTML, CSS y JavaScript (con jQuery)
- Las predicciones se almacenan en el localStorage del navegador
- Los usuarios pueden agregar una predicción y ver todas las predicciones guardadas con sus fechas

## Cómo Ejecutar
1. Abre `index.html` en tu navegador (no se requiere servidor)
2. Ingresa tu predicción en el campo de entrada y haz clic en "Guardar predicción"
3. Tu predicción aparecerá en la lista de abajo, junto con la fecha

## Cómo Probar
1. Abre una terminal y navega a la carpeta `tests`
2. Ejecuta el script de prueba:
   ```
   test_predictions.cmd
   ```
   El script verificará que el HTML contenga el formulario requerido y la lista de predicciones

## Estructura de Archivos
- `index.html` – Página principal de la app
- `styles.css` – Estilos de la app
- `script.js` – Lógica de la app (guardar y mostrar predicciones)
- `tests/test_predictions.cmd` – Prueba automatizada para la estructura HTML

## Autor
VibeCoding Team
