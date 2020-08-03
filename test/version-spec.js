import { version } from "../src";

import { expect } from "chai";

describe("passport-things-factory", () => {
  describe("module", () => {
    it("should report a version", () => {
      expect(version).to.be.a("string");
    });
  });
});
