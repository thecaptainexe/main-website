import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyRelease,
  compareVersions,
  getLatestCanaryRelease,
  getLatestStableRelease,
  parseVersion,
} from "./github-api.js";

test("classifies only exact release prefixes and parses SemVer", () => {
  assert.equal(classifyRelease("stable_1.2.3"), "stable");
  assert.equal(classifyRelease("canary_1.2.3-beta.2"), "canary");
  assert.equal(classifyRelease("v1.2.3"), null);
  assert.equal(classifyRelease("Stable_1.2.3"), null);
  assert.equal(classifyRelease(null), null);
  assert.equal(parseVersion(null), null);
  assert.equal(parseVersion("stable_1.2"), null);
  assert.deepEqual(parseVersion("canary_1.2.3+build.7"), {
    channel: "canary",
    major: 1,
    minor: 2,
    patch: 3,
    prerelease: [],
    build: ["build", "7"],
  });
});

test("compares SemVer precedence rather than lexical order", () => {
  assert.equal(compareVersions("1.10.0", "1.9.0") > 0, true);
  assert.equal(compareVersions("1.0.0", "1.0.0-rc.1") > 0, true);
  assert.equal(compareVersions("1.0.0-rc.2", "1.0.0-rc.10") < 0, true);
});

test("selects the highest valid non-draft release for each channel", () => {
  const releases = [
    { tag_name: "stable_1.9.0", draft: false },
    { tag_name: "stable_1.10.0", draft: false },
    { tag_name: "stable_99.0.0", draft: true },
    { tag_name: "v100.0.0", draft: false },
    { tag_name: "canary_2.0.0", draft: false },
    { tag_name: "canary_2.1.0", draft: false },
    { tag_name: "canary_3.0", draft: false },
  ];

  assert.equal(getLatestStableRelease(releases).tag_name, "stable_1.10.0");
  assert.equal(getLatestCanaryRelease(releases).tag_name, "canary_2.1.0");
  assert.equal(getLatestStableRelease([]), null);
});
