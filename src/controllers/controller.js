import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    deleteUserAllService
} from '../models/models.js';


const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
}


export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return handleResponse(res, 400, 'Name, email and password are required');
        }

        const user = await createUserService(name, email, password);
        handleResponse(res, 201, 'User created successfully', user);
    } catch (error) {
        console.error('Error in createUser:', error);
        handleResponse(res, 500, 'Error creating user');
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, 'Users fetched successfully', users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        handleResponse(res, 500, 'Error fetching users');
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User fetched successfully', user);
    } catch (error) {
        console.error('Error in getUserById:', error);
        handleResponse(res, 500, 'Error fetching user');
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const updatedUser = await updateUserService(id, name, email, password);
        if (!updatedUser) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User updated successfully', updatedUser);
    } catch (error) {
        console.error('Error in updateUser:', error);
        handleResponse(res, 500, 'Error updating user');
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUserService(id);
        if (!deletedUser) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User deleted successfully', deletedUser);
    } catch (error) {
        console.error('Error in deleteUser:', error);
        handleResponse(res, 500, 'Error deleting user');
    }
}

export const deleteAll = async (req, res) => {
    try {
        const deleted = await deleteUserAllService();

        if (deleted.count === 0) {
            return handleResponse(res, 404, 'No users found to delete');
        }

        handleResponse(
            res,
            200,
            `All users (${deleted.count}) were deleted successfully`,
            { deletedCount: deleted.count, deletedUsers: deleted.users }
        );
    } catch (error) {
        if (error.message === "Operation not allowed in production") {
            return handleResponse(res, 403, error.message);
        }

        console.error('Error in deleteAll:', error);
        handleResponse(res, 500, 'Error deleting all users');
    }
};