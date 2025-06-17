import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
  },
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
      // Melhorar contraste para acessibilidade
      '::selection': {
        bg: props.colorMode === 'dark' ? 'brand.200' : 'brand.100',
        color: props.colorMode === 'dark' ? 'gray.900' : 'gray.800',
      },
      // Foco visível para navegação por teclado
      '*:focus-visible': {
        outline: `2px solid ${props.colorMode === 'dark' ? 'brand.300' : 'brand.500'}`,
        outlineOffset: '2px',
      },
    }),
  },
  // Melhorar contraste de cores
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        _light: 'gray.800',
        _dark: 'white',
      },
      'chakra-body-bg': {
        _light: 'gray.50',
        _dark: 'gray.900',
      },
      'chakra-subtle-bg': {
        _light: 'gray.100',
        _dark: 'gray.800',
      },
      'chakra-subtle-text': {
        _light: 'gray.600',
        _dark: 'gray.300',
      },
    },
  },
})

export default theme 