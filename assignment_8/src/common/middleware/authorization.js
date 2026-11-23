import { userRole, responses as re } from "../index.js";
export const authoriz = (UserRole = []) => {
  return (req, res, next) => {
    let role = req.user.role;
    if (role == userRole.admin) next();
    if (UserRole.includes(role)) next();
    return re.badReq(res, 403, "You don't have access on this URL");
  };
};
