import { isValidObjectId } from "mongoose";

const integrityCheck = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(',\n');
            const err = new Error(errorMessage);
            err.status = 400;
            err.type = "validation_error";
            return next(error);
        }
        next();
    }
}
const integrityId=(req,res,next,id)=>{
    if (!isValidObjectId(id)){
        const error = new Error("מזהה (ID) אינו תקין");
        error.status = 400;
        error.type = "bad_request";
        return next(error);
    }
    next();
}
export {integrityCheck,integrityId}