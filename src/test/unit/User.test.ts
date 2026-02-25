import { DomainError } from "../../lib/errors/Errors.base";
import { User } from "../../domain/user/User.aggregate";
import { Email, Role } from "../../domain/user/User.vo";
import {
  mapUserApiToDomain,
  mapUserDomainToDTO,
  mapUserDomainToView,
} from "../../domain/user/mappers";

describe("User aggregate", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  it("creates and mutates lifecycle state", () => {
    const aggregate = User.create({
      id: userId,
      email: "test@example.com",
      role: "User",
      verified: false,
    });

    aggregate.changeEmail("new@example.com");
    aggregate.changeRole("Admin");
    aggregate.markVerified();

    expect(aggregate.toJSON()).toEqual({
      id: userId,
      email: "new@example.com",
      role: "Admin",
      verified: true,
    });
  });

  it("maps api/domain/dto", () => {
    const aggregate = mapUserApiToDomain({
      id: userId,
      email: "test@example.com",
      role: "User",
      verified: false,
    });

    expect(mapUserDomainToView(aggregate)).toEqual({
      id: userId,
      email: "test@example.com",
      role: "User",
      verified: false,
    });

    expect(mapUserDomainToDTO(aggregate)).toEqual({
      id: userId,
      email: "test@example.com",
      role: "User",
      verified: false,
    });
  });
});

describe("User value objects", () => {
  it("validates email and role", () => {
    expect(Email.create("  TEST@EXAMPLE.COM ").toString()).toBe("test@example.com");
    expect(Role.create("Admin").toString()).toBe("Admin");
  });

  it("throws on invalid role", () => {
    try {
      Role.create("Root" as never);
      fail("Expected error was not thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect((error as DomainError).code).toBe("DOMAIN.INVALID_USER_ROLE");
    }
  });
});
