import joi from 'joi';

const userSchmema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required()
})
const validateUserInput = (req, res, next) => {
    const { error } = userSchmema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Invalid input',
            error: error.details[0].message
        });
    }
    next();
} 

export default validateUserInput;