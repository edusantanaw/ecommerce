import { user } from "../../protocols/entity/user";
import { data } from "../../protocols/presentational/userCreateData";
import { EmailAlreadyBeingUsed } from "../../utils/helper/errors/emailAlreadyBeingUsed";
import httpResponse from "../../utils/helper/httpResponse";

interface encrypter {
  genHash: (pass: string) => Promise<string>;
}

interface generateToken {
  generate: (userId: string, secret: string) => string;
}

interface userRepository {
  loadByEmail: (email: string) => Promise<user | null>;
  create: (data: data) => Promise<user>;
}

export class CreateUserUseCase {
  constructor(
    private encrypter: encrypter,
    private userRepository: userRepository,
    private generateToken: generateToken
  ) {}
  async create(data: data) {
    const verifyUserExists = await this.userRepository.loadByEmail(data.email);
    if (verifyUserExists)
      throw httpResponse.badRequest(new EmailAlreadyBeingUsed());
    const hashPassword = await this.encrypter.genHash(data.password);
    data.password = hashPassword;
    const user = await this.userRepository.create(data);
    const accessToken = this.generateToken.generate(user.id, "secret");
    return { accessToken, user };
  }
}
