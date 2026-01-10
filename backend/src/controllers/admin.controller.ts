import { Request, Response, NextFunction } from "express";
import {
  deleteUserService,
  listUsersService,
  updateUserRoleService,
} from "../services/admin.service";
import { createCustomError } from "../utils/customError";

export async function listUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await listUsersService();

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (req.user?.id === userId) {
      throw createCustomError(400, "Cannot update your own role");
    }

    const data = await updateUserRoleService(userId, role);

    res.status(200).json({
      message: "Role updated",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;

    if (req.user?.id === userId) {
      throw createCustomError(400, "Cannot delete your own account");
    }

    await deleteUserService(userId);

    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
}
