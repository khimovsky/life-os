import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?js$"],
          depConstraints: [
            {
              sourceTag: "type:domain",
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: "type:application",
              onlyDependOnLibsWithTags: ["type:domain"],
            },
            {
              sourceTag: "type:data-access",
              onlyDependOnLibsWithTags: ["type:domain"],
            },
            {
              sourceTag: "type:ui",
              onlyDependOnLibsWithTags: ["type:ui"],
            },
            {
              sourceTag: "type:feature",
              onlyDependOnLibsWithTags: ["type:ui", "type:application", "type:domain"],
            },
            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: [
                "type:app",
                "type:feature",
                "type:ui",
                "type:application",
                "type:domain",
                "type:data-access",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    rules: {},
  },
];
