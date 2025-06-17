import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Box, Container, Grid, useDisclosure, VStack, Heading, Button, useColorMode, Skeleton, Input, HStack, Text } from '@chakra-ui/react'
import { DashboardCard } from './components/DashboardCard'
import { DashboardForm } from './components/DashboardForm'
import { PinAccess } from './components/PinAccess'
import { useDashboards } from './hooks/useDashboards'
import { Dashboard } from './types/dashboard'
import Header from './components/Header'
import { FiFilter } from 'react-icons/fi'

function App() {
  const { dashboards, isLoading, addDashboard, updateDashboard, removeDashboard } = useDashboards()
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isPinOpen, onOpen: onPinOpen, onClose: onPinClose } = useDisclosure()
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { colorMode } = useColorMode()

  // Fechar modais quando a rota mudar
  useEffect(() => {
    if (location.pathname === '/') {
      // Se voltou para home, fechar todos os modais
      onFormClose();
      onPinClose();
      setSelectedDashboard(undefined);
    }
  }, [location.pathname, onFormClose, onPinClose]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K para abrir busca
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
      
      // Ctrl/Cmd + N para novo dashboard (apenas na tela de gestor)
      if ((event.ctrlKey || event.metaKey) && event.key === 'n' && location.pathname === '/login') {
        event.preventDefault();
        handleAddClick();
      }
      
      // Escape para fechar modais
      if (event.key === 'Escape') {
        if (isFormOpen) onFormClose();
        if (isPinOpen) onPinClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, isFormOpen, isPinOpen, onFormClose, onPinClose]);

  const handleAddClick = useCallback(() => {
    setSelectedDashboard(undefined)
    if (location.pathname === '/') {
      onPinOpen()
    } else if (location.pathname === '/login') {
      onFormOpen()
    }
  }, [location.pathname, onPinOpen, onFormOpen])

  const handleEditDashboard = useCallback((dashboard: Dashboard) => {
    console.log('Editando dashboard:', dashboard);
    console.log('Estado atual - isFormOpen:', isFormOpen);
    setSelectedDashboard(dashboard)
    console.log('Chamando onFormOpen...');
    onFormOpen()
    console.log('onFormOpen chamado, novo estado - isFormOpen:', isFormOpen);
  }, [onFormOpen, isFormOpen])

  const handlePinSuccess = useCallback(() => {
    onFormClose();
    navigate('/login')
  }, [navigate, onFormClose])

  const handleFormClose = useCallback(() => {
    console.log('Fechando formulário');
    onFormClose()
    setSelectedDashboard(undefined)
  }, [onFormClose])

  const handleFormSubmit = useCallback(async (data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Submetendo formulário:', data, 'selectedDashboard:', selectedDashboard);
    try {
      if (selectedDashboard) {
        console.log('Atualizando dashboard:', selectedDashboard.id);
        await updateDashboard(selectedDashboard.id, data)
      } else {
        console.log('Adicionando novo dashboard');
        await addDashboard(data)
      }
      console.log('Dashboard salvo com sucesso, fechando formulário');
      onFormClose()
      setSelectedDashboard(undefined)
    } catch (error) {
      console.error('Erro ao salvar dashboard:', error)
    }
  }, [selectedDashboard, updateDashboard, addDashboard, onFormClose])

  // Filtrar dashboards
  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || dashboard.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(dashboards.map(d => d.category).filter(Boolean))];

  return (
    <Box 
      minH="100vh" 
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
      role="main"
      aria-label="Central de Dashboards"
      display="flex"
      flexDirection="column"
    >
      <Header />
      
      <Container maxW="1200px" py={8} flex="1">
        <Routes>
          <Route
            path="/"
            element={
              <VStack align="stretch" spacing={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="lg" id="main-heading">Central de Dashboards</Heading>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleAddClick}
                    aria-describedby="main-heading"
                  >
                    Acesso do Gestor
                  </Button>
                </Box>

                {/* Barra de busca e filtros */}
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <Box flex={1} position="relative">
                      <Input
                        id="search-input"
                        placeholder="Buscar dashboards... (Ctrl+K)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Buscar dashboards"
                      />
                    </Box>
                    <Button
                      leftIcon={<FiFilter />}
                      variant="outline"
                      onClick={() => setSelectedCategory('')}
                      aria-label="Limpar filtros"
                    >
                      Limpar
                    </Button>
                  </HStack>
                  
                  {categories.length > 0 && (
                    <HStack spacing={2} flexWrap="wrap">
                      <Button
                        size="sm"
                        variant={selectedCategory === '' ? 'solid' : 'outline'}
                        onClick={() => setSelectedCategory('')}
                        aria-pressed={selectedCategory === ''}
                      >
                        Todos
                      </Button>
                      {categories.map(category => (
                        <Button
                          key={category}
                          size="sm"
                          variant={selectedCategory === category ? 'solid' : 'outline'}
                          onClick={() => setSelectedCategory(category || '')}
                          aria-pressed={selectedCategory === category}
                        >
                          {category}
                        </Button>
                      ))}
                    </HStack>
                  )}
                </VStack>

                {isLoading ? (
                  <Grid
                    templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    gap={6}
                    role="status"
                    aria-label="Carregando dashboards"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <Skeleton
                        key={n}
                        height="200px"
                        borderRadius="lg"
                        startColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
                        endColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                      />
                    ))}
                  </Grid>
                ) : (
                  <>
                    {filteredDashboards.length > 0 ? (
                      <Grid
                        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                        gap={6}
                        role="region"
                        aria-label="Lista de dashboards"
                      >
                        {filteredDashboards.map((dashboard) => (
                          <DashboardCard
                            key={dashboard.id}
                            dashboard={dashboard}
                            onEdit={handleEditDashboard}
                            onDelete={removeDashboard}
                            isManagerView={false}
                          />
                        ))}
                      </Grid>
                    ) : (
                      <Box 
                        textAlign="center" 
                        py={12}
                        role="status"
                        aria-label="Nenhum dashboard encontrado"
                      >
                        <Text fontSize="lg" color="gray.500">
                          {searchTerm || selectedCategory 
                            ? 'Nenhum dashboard encontrado com os filtros aplicados'
                            : 'Nenhum dashboard disponível'
                          }
                        </Text>
                      </Box>
                    )}
                  </>
                )}
              </VStack>
            }
          />

          <Route
            path="/login"
            element={
              <VStack align="stretch" spacing={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="lg">Gerenciar Dashboards</Heading>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleAddClick}
                    aria-label="Adicionar novo dashboard (Ctrl+N)"
                  >
                    Adicionar Novo
                  </Button>
                </Box>

                <Grid
                  templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  gap={6}
                  role="region"
                  aria-label="Lista de dashboards para gerenciamento"
                >
                  {dashboards.map((dashboard) => (
                    <DashboardCard
                      key={dashboard.id}
                      dashboard={dashboard}
                      onEdit={handleEditDashboard}
                      onDelete={removeDashboard}
                      isManagerView={true}
                    />
                  ))}
                </Grid>
              </VStack>
            }
          />
        </Routes>
      </Container>

      <PinAccess
        isOpen={isPinOpen}
        onClose={onPinClose}
        onSuccess={handlePinSuccess}
      />

      <DashboardForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedDashboard}
      />

      {/* Rodapé */}
      <Box
        as="footer"
        py={4}
        mt="auto"
        textAlign="center"
        borderTop="1px solid"
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
        bg="transparent"
      >
        <Text
          fontSize="xs"
          color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}
          opacity={0.7}
        >
          Feito com ❤️ Matheus Medina
        </Text>
      </Box>
    </Box>
  )
}

export default App 