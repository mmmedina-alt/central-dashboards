import { Box, Button, Flex, Heading, useColorMode } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiArrowLeft, FiSun, FiMoon } from 'react-icons/fi'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { colorMode, toggleColorMode } = useColorMode()

  const handleBack = () => {
    if (location.pathname === '/login') {
      navigate('/')
    } else if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate('/')
    }
  }

  const isManagerView = location.pathname === '/login'

  return (
    <Box as="header" py={4} px={6} bg={colorMode === 'dark' ? 'gray.800' : 'white'} shadow="sm">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Flex align="center" gap={4}>
          {isManagerView && (
            <Button
              leftIcon={<FiArrowLeft />}
              onClick={handleBack}
              variant="ghost"
              size="sm"
            >
              Voltar
            </Button>
          )}
          <Heading size="md" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
            Central de Dashboards
          </Heading>
        </Flex>
        
        <Button
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
          aria-label="Alternar tema"
        >
          {colorMode === 'light' ? <FiMoon /> : <FiSun />}
        </Button>
      </Flex>
    </Box>
  )
}

export default Header 