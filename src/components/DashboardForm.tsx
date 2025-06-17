import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
  Text,
  Box,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import type { Dashboard, DashboardFormData } from '../types/dashboard';

interface DashboardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DashboardFormData) => void;
  initialData?: Dashboard;
  categories?: string[];
}

export function DashboardForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories = [],
}: DashboardFormProps) {
  const [formData, setFormData] = useState<DashboardFormData>({
    title: '',
    description: '',
    url: '',
    category: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          url: initialData.url,
          category: initialData.category || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          url: '',
          category: '',
        });
      }
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialData]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fechar ao clicar fora
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const handleClose = useCallback(() => {
    setIsLoading(false);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.title || !formData.url) {
        throw new Error('Título e URL são obrigatórios');
      }
      await onSubmit(formData);
      toast({
        title: initialData ? 'Dashboard atualizado' : 'Dashboard criado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Tente novamente',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }, [formData, onSubmit, initialData, toast, handleClose]);

  if (!isOpen) return null;

  // Animação simples de fade
  const overlayBg = colorMode === 'dark' ? 'blackAlpha.700' : 'blackAlpha.600';
  const modalBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const modalColor = colorMode === 'dark' ? 'white' : 'gray.800';

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1400}
      bg={overlayBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.2s"
      aria-modal="true"
      role="dialog"
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={modalBg}
        color={modalColor}
        borderRadius="xl"
        boxShadow="2xl"
        p={{ base: 4, sm: 8 }}
        minW={{ base: '90vw', sm: '400px' }}
        maxW="600px"
        w="full"
        maxH="90vh"
        overflowY="auto"
        position="relative"
        animation="fadeInModal 0.2s"
      >
        {/* Botão de fechar */}
        <IconButton
          icon={<svg width="12" height="12" viewBox="0 0 12 12"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="2"/></svg>}
          aria-label="Fechar"
          onClick={handleClose}
          position="absolute"
          top={3}
          right={3}
          size="sm"
          variant="ghost"
          zIndex={2}
        />
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          {initialData ? 'Editar Dashboard' : 'Novo Dashboard'}
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Título</FormLabel>
            <Input
              ref={inputRef}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nome do dashboard"
              autoComplete="off"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do dashboard"
              rows={3}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>URL</FormLabel>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Categoria</FormLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Selecione uma categoria"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>
        </VStack>
        <Box display="flex" justifyContent="flex-end" gap={3} mt={8}>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Salvando..."
            type="submit"
          >
            {initialData ? 'Atualizar' : 'Criar'}
          </Button>
        </Box>
      </Box>
      {/* Animação CSS */}
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
} 