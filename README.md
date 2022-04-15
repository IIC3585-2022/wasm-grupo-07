# Tarea 3 - Grupo7

Comando utilizado para compilar con Emscripten:

```
emcc -O3 -s WASM=1 -o glue.js -s EXTRA_EXPORTED_RUNTIME_METHODS="['getValue', 'setValue']" -s EXPORTED_FUNCTIONS="['_calloc', '_printAllSubsets']" -s EXPORT_ES6=1 -s MODULARIZE=1 array_sum.cpp
```
