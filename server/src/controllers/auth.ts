import {
  getCurrentUserService,
  loginService,
  signupService,
} from "../services/auth";
import { catchAsync } from "../utils/catchAsync";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie";

export const signupController = catchAsync(async (req, res) => {
  const { user, token } = await signupService(req.body);
  setAuthCookie(res, token);

  res.status(201).json({
    status: "success",
    data: user,
  });
});

export const loginController = catchAsync(async (req, res) => {
  const { user, token } = await loginService(req.body);
  setAuthCookie(res, token);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const logoutController = catchAsync(async (_, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const meController = catchAsync(async (req, res) => {
  const user = await getCurrentUserService(req.user!.id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
