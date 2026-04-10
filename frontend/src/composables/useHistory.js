import { ref } from "vue";
import axios from "axios";
const undoStack = ref([]);
const redoStack = ref([]);
let isProcessing = false; 

export const useHistory = (canvas) => {

    
    const save = () => {
        if (!canvas.value || isProcessing) return;

       
        const json = JSON.stringify(canvas.value.toJSON());
        undoStack.value.push(json);

       
        redoStack.value = [];

       
        if (undoStack.value.length > 50) {
            undoStack.value.shift();
        }
    };

  
    const undo = async () => {
        if (undoStack.value.length <= 1) return; 

        isProcessing = true;

       
        const currentState = undoStack.value.pop();
        redoStack.value.push(currentState);

        
        const previousState = undoStack.value[undoStack.value.length - 1];

       
        await canvas.value.loadFromJSON(JSON.parse(previousState));
        canvas.value.renderAll();

        isProcessing = false;
    };


    const redo = async () => {
        if (redoStack.value.length === 0) return;

        isProcessing = true;


        const nextState = redoStack.value.pop();
        undoStack.value.push(nextState);

        await canvas.value.loadFromJSON(JSON.parse(nextState));
        canvas.value.renderAll();

        isProcessing = false;
    };

    const fetchAllData = async () => {
        try {
            
            const res = await axios.get('http://localhost:4000/api/all');
            
            return res.data.data;
        } catch (err) {
            console.log(err.message);
        }
    }

    const fetchDataById = async (id) => {
        try {
            
            const response = await axios.get(`http://localhost:4000/api/canva/${id}`);
            const canvasJson = response.data.data.canvasJson;
            undoStack.value = [];
            redoStack.value = [];
           await canvas.value.loadFromJSON(canvasJson);
           canvas.value.renderAll()

        } catch (error) {
            console.error("Error loading canvas:", error.message);
        }
    }

    const fetchLatest=async(req,res)=>{
        try{
            console.log('api hit');
            const response = await axios.get(`http://localhost:4000/api/latest`);
            const canvasJson = response.data.canvasJson;
            console.log(canvasJson)
            undoStack.value = [];
            redoStack.value = [];
            await canvas.value.loadFromJSON(canvasJson);
            canvas.value.renderAll()
        }catch(error){

             console.error("Error loading canvas:", error.message);
        }
    }

    return {
        save,
        undo,
        redo,
        undoStack,
        redoStack,
        fetchAllData,
        fetchDataById,
        fetchLatest
    };
};
