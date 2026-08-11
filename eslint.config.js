import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import autoImportConfig from './.eslintrc-auto-import.json' with { type: 'json' }

const autoImportGlobals = Object.fromEntries(
  Object.keys(autoImportConfig.globals).map(name => [name, 'readonly'])
)

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...autoImportGlobals
      }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
)
