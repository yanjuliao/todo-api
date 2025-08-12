import { User } from "../infraestructure/user.entity";
import { UserResponseDto } from "./dto/response/user.response.dto";


export const toUserResponse = (u: User): Omit<UserResponseDto, never> => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});
