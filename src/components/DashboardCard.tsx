import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  Tooltip,
  Spinner,
  Image,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiExternalLink, FiShare2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Dashboard } from '../types/dashboard';
import { ShareModal } from './ShareModal';

interface DashboardCardProps {
  dashboard: Dashboard;
  onEdit: (dashboard: Dashboard) => void;
  onDelete: (id: string) => void;
  isManagerView?: boolean;
}

export function DashboardCard({ dashboard, onEdit, onDelete, isManagerView = false }: DashboardCardProps) {
  const [favicon, setFavicon] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  const { colorMode } = useColorMode();

  // Extrair domínio para favicon
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'unknown';
    }
  };

  // Carregar favicon
  useEffect(() => {
    const domain = getDomain(dashboard.url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    
    const img = new window.Image();
    img.onload = () => {
      setFavicon(faviconUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setFavicon('');
      setIsLoading(false);
    };
    img.src = faviconUrl;
  }, [dashboard.url]);

  // Verificar se a URL é válida
  useEffect(() => {
    const checkUrl = async () => {
      try {
        await fetch(dashboard.url, { 
          method: 'HEAD',
          mode: 'no-cors' // Para evitar CORS
        });
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };
    
    // Verificar após 2 segundos para não sobrecarregar
    const timer = setTimeout(checkUrl, 2000);
    return () => clearTimeout(timer);
  }, [dashboard.url]);

  const handleShare = () => {
    onShareOpen();
  };

  const getStatusColor = () => {
    if (isValid === null) return 'gray';
    return isValid ? 'green' : 'red';
  };

  const getStatusText = () => {
    if (isValid === null) return 'Verificando...';
    return isValid ? 'Ativo' : 'Inativo';
  };

  return (
    <>
      <Card
        as="article"
        role="article"
        aria-labelledby={`dashboard-title-${dashboard.id}`}
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: 'translateY(-2px)',
          shadow: 'lg',
        }}
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        border="1px solid"
        borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      >
        <CardHeader pb={2}>
          <Flex justify="space-between" align="start">
            <HStack spacing={3} flex={1}>
              <Box position="relative">
                {isLoading ? (
                  <Spinner size="sm" />
                ) : favicon ? (
                  <Image
                    src={favicon}
                    alt={`Favicon de ${getDomain(dashboard.url)}`}
                    boxSize="24px"
                    borderRadius="sm"
                    fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0U1RTdFQSIvPgo8L3N2Zz4K"
                  />
                ) : (
                  <Box
                    boxSize="24px"
                    bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FiExternalLink size={12} />
                  </Box>
                )}
              </Box>
              <VStack align="start" spacing={1} flex={1}>
                <Heading
                  id={`dashboard-title-${dashboard.id}`}
                  size="md"
                  noOfLines={1}
                  color={colorMode === 'dark' ? 'white' : 'gray.800'}
                >
                  {dashboard.title}
                </Heading>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  {getDomain(dashboard.url)}
                </Text>
              </VStack>
            </HStack>
            
            <Badge
              colorScheme={getStatusColor()}
              size="sm"
              variant="subtle"
              display="flex"
              alignItems="center"
              gap={1}
            >
              {isValid === null ? (
                <Spinner size="xs" />
              ) : isValid ? (
                <FiCheckCircle size={10} />
              ) : (
                <FiXCircle size={10} />
              )}
              {getStatusText()}
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody pt={0}>
          <VStack align="start" spacing={3}>
            <Text
              fontSize="sm"
              color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
              noOfLines={2}
              lineHeight="1.4"
            >
              {dashboard.description}
            </Text>
            
            {dashboard.category && (
              <Badge
                colorScheme="blue"
                variant="outline"
                size="sm"
              >
                {dashboard.category}
              </Badge>
            )}
            
            <Text
              fontSize="xs"
              color="gray.500"
              fontFamily="mono"
              noOfLines={1}
              wordBreak="break-all"
            >
              {dashboard.url}
            </Text>

            {/* Botões de ação */}
            <HStack spacing={2} w="full" justify="center" pt={2}>
              <Tooltip label="Abrir link" placement="top">
                <IconButton
                  icon={<FiExternalLink />}
                  onClick={() => window.open(dashboard.url, '_blank')}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  aria-label="Abrir link"
                />
              </Tooltip>
              
              <Tooltip label="Compartilhar" placement="top">
                <IconButton
                  icon={<FiShare2 />}
                  onClick={handleShare}
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  aria-label="Compartilhar"
                />
              </Tooltip>
              
              {isManagerView && (
                <>
                  <Tooltip label="Editar" placement="top">
                    <IconButton
                      icon={<FiEdit />}
                      onClick={() => onEdit(dashboard)}
                      size="sm"
                      colorScheme="orange"
                      variant="outline"
                      aria-label="Editar dashboard"
                    />
                  </Tooltip>
                  
                  <Tooltip label="Excluir" placement="top">
                    <IconButton
                      icon={<FiTrash2 />}
                      onClick={() => onDelete(dashboard.id)}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      aria-label="Excluir dashboard"
                    />
                  </Tooltip>
                </>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <ShareModal
        isOpen={isShareOpen}
        onClose={onShareClose}
        dashboard={dashboard}
      />
    </>
  );
} 