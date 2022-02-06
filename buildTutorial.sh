node node_modules/@shaunlusk/slcommon/dist/iftr tutorialTemplate.html demos/tutorial.html tutorial.iftr.json
sed -Ei 's/(import \{.*\} from )"..";/\1"@shaunlusk\/slgfx";/g' demos/tutorial.html
sed -i 's/\/\*newcode start\*\//<span class="new-code">/g' demos/tutorial.html
sed -i 's/\/\*newcode end\*\//<\/span>/g' demos/tutorial.html
sed -i 's/<GfxLayer, ILayerProps>/\&lt;GfxLayer, ILayerProps\&gt;/g' demos/tutorial.html
