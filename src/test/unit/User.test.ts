import { DomainError } from "../../lib/errors/Errors.base";
import { User } from "../../domain/user/User.aggregate";
import { Email, Role, Username } from "../../domain/user/User.vo";
import {
  mapUserApiToDomain,
  mapUserDomainToDTO,
  mapUserDomainToView,
} from "../../domain/user/mappers";

describe("User aggregate", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  const userProps = {
    id: userId,
    email: "test@example.com",
    passwordHash: "hashedpassword-123",
    username: "space_user",
    isVerified: false,
    verificationCode: null,
    verificationCodeExpiresAt: null,
    verifiedAt: null,
    isDeleted: false,
    isArchived: false,
    isSupporter: false,
    supporterFrom: null,
    role: "User" as const,
    deletedAt: null,
    archivedAt: null,
    lastActivityAt: new Date("2026-02-22T00:00:00.000Z"),
    createdAt: new Date("2026-02-21T00:00:00.000Z"),
  };

  it("creates and mutates lifecycle state", () => {
    const aggregate = User.rehydrate(userProps);

    aggregate.changeUsername("space_admin");
    aggregate.changeRole("Admin");
    aggregate.verifyEmail();
    aggregate.softDelete(new Date("2026-02-23T00:00:00.000Z"));

    expect(aggregate.username).toBe("space_admin");
    expect(aggregate.role).toBe("Admin");
    expect(aggregate.isVerified).toBe(true);
    expect(aggregate.isDeleted).toBe(true);
  });

  it("maps api/domain/dto", () => {
    const aggregate = mapUserApiToDomain({
      id: userId,
      email: "test@example.com",
      username: "space_user",
      password: "hashedpassword-123",
      is_verified: false,
      verification_code: null,
      verification_code_expires_at: null,
      verified_at: null,
      is_deleted: false,
      is_archived: false,
      is_supporter: false,
      supporter_from: null,
      role: "User",
      deleted_at: null,
      archived_at: null,
      last_activity_at: "2026-02-22T00:00:00.000Z",
      created_at: "2026-02-21T00:00:00.000Z",
    });

    expect(mapUserDomainToView(aggregate).id).toBe(userId);
    expect(mapUserDomainToDTO(aggregate).password).toBe("hashedpassword-123");
  });

  it("throws when restoring archived user", () => {
    const aggregate = User.rehydrate({
      ...userProps,
      isArchived: true,
      isDeleted: true,
      archivedAt: new Date("2026-02-24T00:00:00.000Z"),
      deletedAt: new Date("2026-02-24T00:00:00.000Z"),
    });

    try {
      aggregate.restore();
      fail("Expected error was not thrown");
    } catch (error) {
      expect((error as DomainError).code).toBe("USERS.RESTORE_FAILED");
    }
  });
});

describe("User value objects", () => {
  it("validates email, username and role", () => {
    expect(Email.create("  TEST@EXAMPLE.COM ").toString()).toBe("test@example.com");
    expect(Username.create("my_user").toString()).toBe("my_user");
    expect(Role.create("Admin").toString()).toBe("Admin");
  });

  it("throws on invalid username", () => {
    try {
      Username.create("x");
      fail("Expected error was not thrown");
    } catch (error) {
      expect((error as DomainError).code).toBe("DOMAIN.INVALID_USER_USERNAME");
    }
  });
});
