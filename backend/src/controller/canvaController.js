const Canvas =require('../model/canvas');

const createCanva=async(req,res)=>{
    try{
        const {canvasJson} =req.body;
        
        if(!canvasJson){
            return res.status(401).json({
                message:"Data are required"
            })
        }
        const canva= await new Canvas({canvasJson})
        canva.save();
        return res.status(200).json({message:'data create Successfull'})
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:'Server Side Error'});
    }
}

const getCanva=async(req,res)=>{
    try{
        const data =await Canvas.find({});
        return res.status(200).json({message:"SuccessFull",data});
    }catch(error){
        return res.status(500).json({message:"Server Side Error"})
    }
}

const getCanvaId=async(req,res)=>{
    try{
        const {id}=req.params;
        const data=await Canvas.findById(id);
        return res.status(200).json({message:"SuccessFull",data});
    }catch(error){
        return res.status(500).json({message:"Server Side Error"})
    }
}

const getLatest = async (req, res) => {
    try {

        const data = await Canvas.findOne().sort({ createdAt: -1 });
        
        if (!data) {
            return res.status(404).json({ message: "No canvas found" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports={createCanva,getCanva,getCanvaId,getLatest}

