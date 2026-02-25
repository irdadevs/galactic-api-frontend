import { ZodError } from "zod";
import {
  authUserEnvelopeSchema,
  parseAuthUserEnvelope,
} from "../../infra/api/auth.api";

describe("Auth response contract", () => {
  it("accepts secure user payload for login/signup", () => {
    const parsed = parseAuthUserEnvelope({
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        email: "pilot@example.com",
        role: "User",
        verified: false,
      },
    });

    expect(parsed).toEqual({
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        email: "pilot@example.com",
        role: "User",
        verified: false,
      },
    });
  });

  it("rejects extra user fields", () => {
    expect(() =>
      authUserEnvelopeSchema.parse({
        user: {
          id: "11111111-1111-4111-8111-111111111111",
          email: "pilot@example.com",
          role: "Admin",
          verified: true,
          passwordHash: "should-never-be-exposed",
        },
      }),
    ).toThrow(ZodError);
  });
});
