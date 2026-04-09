
import { Canvas, Circle, Rect, Triangle, PencilBrush } from 'fabric'
import { shallowRef } from 'vue'
import { useHistory } from '../composables/useHistory'
import axios from 'axios'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const canvas = shallowRef(null)
const selectedObject = shallowRef(null)
const positionX = shallowRef(0)
const positionY = shallowRef(0)

export const useFabric = () => {

    const { save, undo, redo, fetchAllData, fetchDataById,fetchLatest } = useHistory(canvas)
    const notify = () => {
        toast("Save Succesfull !", {
            autoClose: 1000,
        }); 
    }
    const syncToVue = (obj) => {
        if (!obj) return
        selectedObject.value = obj
        positionX.value = Math.round(obj.left)
        positionY.value = Math.round(obj.top)
        
    }

    const initCanvas = (canvasEl) => {
        if (!canvasEl.value) return

        canvas.value = new Canvas(canvasEl.value, {
            width: 700,
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

    const addRect = () => {
        const rect = new Rect({
            width: 100,
            height: 100,
            fill: 'white',
            left: 50,
            top: 50,
            stroke: 'black',
            strokeWidth: 2
        })
        canvas.value.add(rect)
        canvas.value.setActiveObject(rect)
    }

    const addCircle = () => {
        const circle = new Circle({
            width: 100,
            height: 100,
            radius: 40,
            fill: 'white',
            left: 50,
            top: 50,
            stroke: 'black',
            strokeWidth: 2
        })
        canvas.value.add(circle);
    }

    const addTriangle = () => {
        const triangle = new Triangle({
            width: 100,
            height: 100,
            fill: 'white',
            left: 50,
            top: 50,
            stroke: "black",
            strokeWidth: 3
        })
        canvas.value.add(triangle)
    }

    const enableDrawingMode = () => {
        if (!canvas.value) return
        canvas.value.isDrawingMode = true
    }

    const changeBrushWidth=(size)=>{
        canvas.value.freeDrawingBrush.width=size;
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
            notify()
            
        } catch (err) {
            console.log(err.message);
        }
    }
  
    

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
        changeBrushWidth 
    }
}
