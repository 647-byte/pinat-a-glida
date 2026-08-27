import { isValidObjectId } from "mongoose";

const integrityCheck = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            //כאן לטפל בשגיאה
            return next(error);
        }
        next();
    }
}
const integrityId=(req,res,next,id)=>{
    if (!isValidObjectId(id)){
        //כאן לטפל בשגיאה
        return next();
    }
    next();
}
export {integrityCheck,integrityId}