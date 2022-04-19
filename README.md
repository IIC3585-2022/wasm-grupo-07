# Tarea 3 - Grupo7

Comando utilizado para compilar con Emscripten (Windows, CMD):

Dentro de la carpeta emsdk

```
git pull

emsdk install latest

emsdk activate latest

emsdk_env.bat
```

```
emcc -O3 -s WASM=1 -o glue.js -s EXTRA_EXPORTED_RUNTIME_METHODS="['getValue', 'setValue']" -s EXPORTED_FUNCTIONS="['_calloc', '_printAllSubsets', '_freeMatrix', '_free']" -s EXPORT_ES6=1 -s MODULARIZE=1 -s TOTAL_MEMORY=512MB -sALLOW_MEMORY_GROWTH  array_sum.cpp
```
