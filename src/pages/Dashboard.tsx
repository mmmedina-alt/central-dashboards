import { Box, Container, Grid, Heading, Text, useColorMode } from '@chakra-ui/react'

function Dashboard() {
  const { colorMode } = useColorMode()

  const dashboards = [
    { id: 1, title: 'Editais Ativos', count: 12 },
    { id: 2, title: 'Em Análise', count: 5 },
    { id: 3, title: 'Finalizados', count: 8 },
    { id: 4, title: 'Total de Inscrições', count: 156 },
  ]

  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={8} color={colorMode === 'dark' ? 'white' : 'gray.800'}>
        Dashboards
      </Heading>

      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        {dashboards.map((dashboard) => (
          <Box
            key={dashboard.id}
            p={6}
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'xl',
              borderColor: 'brand.500',
              borderWidth: '2px',
            }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {dashboard.title}
            </Text>
            <Text fontSize="3xl" color="brand.500">
              {dashboard.count}
            </Text>
          </Box>
        ))}
      </Grid>
    </Container>
  )
}

export default Dashboard 