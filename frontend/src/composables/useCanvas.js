
import { Canvas, Circle, Rect, Triangle, PencilBrush, Path, Line, Polygon, Polyline } from 'fabric'
import { shallowRef } from 'vue'
import { useHistory } from '../composables/useHistory'
import axios from 'axios'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const canvas = shallowRef(null)
const selectedObject = shallowRef(null)
const positionX = shallowRef(0)
const positionY = shallowRef(0)
const fill = shallowRef('')
let polylinePoints = []
let tempDots = []
let activeLine = null

export const useFabric = () => {

    const { save, undo, redo, fetchAllData, fetchDataById, fetchLatest } = useHistory(canvas)
    const notify = () => {
        toast("Save Succesfull !", {
            autoClose: 1000,
        });
    }
    const syncToVue = (obj) => {
        if (!obj) return
        fill.value = obj.fill
        selectedObject.value = obj
        positionX.value = Math.round(obj.left)
        positionY.value = Math.round(obj.top)

    }

    const initCanvas = (canvasEl) => {
        if (!canvasEl.value) return

        canvas.value = new Canvas(canvasEl.value, {
            width: 900,
            height: 500,
            backgroundColor: 'white',
            preserveObjectStacking: true
        })


        canvas.value.on('selection:created', (e) => syncToVue(e.selected[0]))
        canvas.value.on('selection:updated', (e) => syncToVue(e.selected[0]))


        canvas.value.on('selection:cleared', () => {
            selectedObject.value = null
        })


        canvas.value.freeDrawingBrush = new PencilBrush(canvas.value)
        canvas.value.freeDrawingBrush.color = 'blue'
        canvas.value.freeDrawingBrush.width = 5

        canvas.value.on('object:moving', (e) => syncToVue(e.target))
        canvas.value.on('object:modified', (e) => syncToVue(e.target))

        canvas.value.on('object:added', save);
        canvas.value.on('object:modified', save);
        canvas.value.on('object:removed', save);
        save();
    }


    const updateObjectPosition = () => {
        if (selectedObject.value) {
            selectedObject.value.set({
                left: Number(positionX.value),
                top: Number(positionY.value)
            })

            selectedObject.value.setCoords()
            canvas.value.renderAll()
        }
    }

    const addRect = (h, w, l, t, c) => {

        const finalH = (typeof h === 'number') ? h : 100;
        const finalW = (typeof w === 'number') ? w : 100;
        const finalL = (typeof l === 'number') ? l : 50;
        const finalT = (typeof t === 'number') ? t : 50;
        const finalC = (typeof c === 'string') ? c : 'white';


        const rect = new Rect({
            height: finalH,
            width: finalW,
            left: finalL,
            top: finalT,
            fill: finalC,
            stroke: 'black',
            strokeWidth: 2
        });

        canvas.value.add(rect);
        canvas.value.setActiveObject(rect);
        canvas.value.renderAll(); // Canvas refresh zaroori hai
    }

    const addCircle = (h, w, l, t, c, r) => {
        const finalH = (typeof h === 'number') ? h : 100;
        const finalW = (typeof w === 'number') ? w : 100;
        const finalL = (typeof l === 'number') ? l : 70;
        const finalT = (typeof t === 'number') ? t : 50;
        const finalC = (typeof c === 'string') ? c : 'white';
        const finalR = (typeof r === 'number') ? r : 50;
        const circle = new Circle({
            width: finalW,
            height: finalH,
            radius: finalR,
            fill: finalC,
            left: finalL,
            top: finalT,
            stroke: 'black',
            strokeWidth: 2
        })
        canvas.value.add(circle);
    }

    const addTriangle = (h, w, l, t, c) => {
        const finalH = (typeof h === 'number') ? h : 100;
        const finalW = (typeof w === 'number') ? w : 100;
        const finalL = (typeof l === 'number') ? l : 70;
        const finalT = (typeof t === 'number') ? t : 50;
        const finalC = (typeof c === 'string') ? c : 'white';

        const triangle = new Triangle({
            height: finalH,
            width: finalW,
            left: finalL,
            top: finalT,
            fill: finalC,
            stroke: 'black',
            strokeWidth: 2
        })
        canvas.value.add(triangle)
    }

    const enableDrawingMode = () => {
        if (!canvas.value) return
        canvas.value.isDrawingMode = true
    }

    const changeBrushWidth = (size) => {
        canvas.value.freeDrawingBrush.width = size;
    }

    const disableDrawingMode = () => {
        if (!canvas.value) return
        canvas.value.isDrawingMode = false
    }

    const sentToFront = () => {
        const obj = canvas.value.getActiveObject()
        if (!obj) return alert('Object is not selected')
        canvas.value.bringObjectToFront(obj)
        canvas.value.renderAll()
    }

    const sentToBack = () => {
        const obj = canvas.value.getActiveObject()
        if (!obj) return alert('Object is not selected')
        canvas.value.sendObjectToBack(obj)
        canvas.value.renderAll()
    }

    const destroyCanvas = async () => {
        if (canvas.value) {

            await canvas.value.dispose();
            canvas.value = null;
            selectedObject.value = null;
            console.log('Canvas destroyed and memory cleared');
        }

    }

    const SaveDb = async () => {
        try {

            const data = canvas.value.toJSON();
            const res = await axios.post('http://localhost:4000/api/create', { canvasJson: data })
            canvas.value.clear();
            canvas.value.renderAll();
            notify()

        } catch (err) {
            console.log(err.message);
        }
    }

    const enableSnapping = () => {
        const gridSize = 20;
        canvas.value.on('object:moving', (options) => {
            options.target.set({
                left: Math.round(options.target.left / gridSize) * gridSize,
                top: Math.round(options.target.top / gridSize) * gridSize
            });
        });
    };

    const addArc = () => {
        const arc = new Circle({
            radius: 50,
            left: 100,
            top: 100,
            stroke: 'black',
            strokeWidth: 2,
            fill: '',
            startAngle: 0,
            endAngle: 180,
        });
        canvas.value.add(arc);
        canvas.value.renderAll();
    };


    const addSpline = () => {

        const splinePathData = 'M 0 50 C 30 0, 70 100, 100 50';

        const splinePath = new Path(splinePathData, {
            left: 150,
            top: 150,
            fill: '',
            stroke: 'blue',
            strokeWidth: 3,
            strokeUniform: true
        });

        canvas.value.add(splinePath);
        canvas.value.renderAll();
    };

    const addPentagon = () => {
        const sideCount = 5;
        const radius = 50;
        const points = [];


        for (let i = 0; i < sideCount; i++) {
            const angle = (i / sideCount) * Math.PI * 2 - Math.PI / 2;
            points.push({
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            });
        }

        const pentagon = new Polygon(points, {
            left: 150,
            top: 150,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 2,
          
            objectCaching: false
        });

        canvas.value.add(pentagon);
        canvas.value.setActiveObject(pentagon);
        canvas.value.renderAll();
    };




const startPointSelection = () => {
    polylinePoints = [];
    tempDots = [];
    activeLine = null;

    canvas.value.isDrawingMode = false;
    canvas.value.selection = false;
    canvas.value.defaultCursor = 'crosshair';

   
    canvas.value.on('mouse:down', (options) => {
        const pointer = canvas.value.getScenePoint(options.e);
        const newPoint = { x: pointer.x, y: pointer.y };

        polylinePoints.push(newPoint);
    
        const dot = new Circle({
            radius: 3,
            fill: '#ef4444',
            left: newPoint.x,
            top: newPoint.y,
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        tempDots.push(dot);
        canvas.value.add(dot);

       
        if (polylinePoints.length > 1) {
            const prevPoint = polylinePoints[polylinePoints.length - 2];
            const line = new Line([prevPoint.x, prevPoint.y, newPoint.x, newPoint.y], {
                stroke: 'black',
                strokeWidth: 2,
                selectable: false,
                evented: false
            });
            tempDots.push(line);
            canvas.value.add(line);
        }
        
        canvas.value.renderAll();
    });

 
    canvas.value.on('mouse:move', (options) => {
        if (polylinePoints.length === 0) return;

        const pointer = canvas.value.getScenePoint(options.e);
        const lastPoint = polylinePoints[polylinePoints.length - 1];

     
        if (activeLine) {
            canvas.value.remove(activeLine);
        }

        
        activeLine = new Line([lastPoint.x, lastPoint.y, pointer.x, pointer.y], {
            stroke: 'rgba(0,0,0,0.3)',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            strokeDashArray: [5, 5] 
        });

        canvas.value.add(activeLine);
        canvas.value.renderAll();
    });
};

const createPolylineFromPoints = () => {
    if (polylinePoints.length < 2) {
        
        return;
    }

  
    tempDots.forEach(obj => canvas.value.remove(obj));
    if (activeLine) canvas.value.remove(activeLine);

   
    const poly = new Polyline(polylinePoints, {
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 3,
        objectCaching: false
    });

    canvas.value.add(poly);

   
    canvas.value.off('mouse:down');
    canvas.value.off('mouse:move');
    canvas.value.selection = true;
    canvas.value.defaultCursor = 'default';

    canvas.value.setActiveObject(poly);
    canvas.value.renderAll();
    save();
};


    const addLine = () => {

        const line = new Line([50, 50, 200, 50], {
            stroke: 'black',
            strokeWidth: 3,
            left: 100,
            top: 100,
            originX: 'center',
            originY: 'center'
        });

        canvas.value.add(line);
        canvas.value.setActiveObject(line);
        canvas.value.renderAll();
    };


    return {
        canvas,
        initCanvas,
        addRect,
        addCircle,
        addTriangle,
        enableDrawingMode,
        disableDrawingMode,
        sentToFront,
        sentToBack,
        selectedObject,
        positionX,
        positionY,
        undo,
        redo,
        updateObjectPosition,
        destroyCanvas,
        SaveDb,
        fetchAllData,
        fetchDataById,
        fetchLatest,
        changeBrushWidth,
        fill,
        addArc,
        addSpline,
        enableSnapping, startPointSelection, createPolylineFromPoints,
        addLine, addPentagon
    }
}
