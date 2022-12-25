import { user } from "../../prisma/prisma";
import { user as respUser } from "../../protocols/entity/user";
import { data } from "../../protocols/presentational/userCreateData";
import { userRepository } from "../../protocols/repository/userRepository";

export class UserRepository implements userRepository {
  async loadByEmail(email: string) {
    const userResponse: respUser | null = await user.findFirst({
      where: {
        email: email,
      },
    });
    return userResponse;
  }
  async create(data: data) {
    try {
      const userResponse = await user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.password,
        },
      });
      return userResponse;
    } catch (error) {
      console.log(error);
    }
  }
}