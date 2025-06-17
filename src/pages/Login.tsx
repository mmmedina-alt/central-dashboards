import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  useColorMode,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { colorMode } = useColorMode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      navigate('/')
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Por favor, verifique suas credenciais.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        p={8}
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6}>
          <Heading size="lg">Acesso do Gestor</Heading>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                width="100%"
                isLoading={isLoading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}

export default Login 