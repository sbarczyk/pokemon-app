import expo from "eslint-config-expo";
import prettier from "eslint-config-prettier";
import reactNative from "eslint-plugin-react-native";

export default [
  ...expo,
  {
    plugins: {
      "react-native": reactNative,
    },
    rules: {
      ...prettier.rules,

      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            minProperties: 2,
            multiline: true,
            consistent: true,
          },
          ObjectPattern: {
            minProperties: 2,
            multiline: true,
            consistent: true,
          },
        },
      ],
      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],
      "react-native/no-unused-styles": "error",
      "react-native/sort-styles": ["error", "asc"],
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",

      "no-unused-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
