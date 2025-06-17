import { useState, useEffect, useRef } from 'react';
import {
  Button,
  PinInput,
  PinInputField,
  HStack,
  useToast,
  Text,
  Box,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';

const CORRECT_PIN = '2024';
const PIN_STORAGE_KEY = 'dashboard-pin-verified';

interface PinAccessProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PinAccess({ isOpen, onClose, onSuccess }: PinAccessProps) {
  const [pin, setPin] = useState('');
  const toast = useToast();
  const { colorMode } = useColorMode();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstPinRef = useRef<HTMLInputElement>(null);

  // Reset verification when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin('');
      // Clear session storage when modal opens to force new verification
      sessionStorage.removeItem(PIN_STORAGE_KEY);
      
      // Foco automático no primeiro campo do PIN
      setTimeout(() => {
        firstPinRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  const handlePinComplete = (value: string) => {
    if (value === CORRECT_PIN) {
      sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
      onSuccess();
      onClose();
      toast({
        title: 'Acesso liberado',
        description: 'Você pode acessar as funcionalidades de gestão.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setPin('');
      toast({
        title: 'PIN incorreto',
        description: 'Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // Foco automático no primeiro campo após PIN incorreto
      setTimeout(() => {
        firstPinRef.current?.focus();
      }, 100);
    }
  };

  if (!isOpen) return null;

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
        bg={modalBg}
        color={modalColor}
        borderRadius="xl"
        boxShadow="2xl"
        p={{ base: 6, sm: 8 }}
        minW={{ base: '90vw', sm: '400px' }}
        maxW="500px"
        w="full"
        position="relative"
        animation="fadeInModal 0.2s"
      >
        {/* Botão de fechar */}
        <IconButton
          icon={<svg width="12" height="12" viewBox="0 0 12 12"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="2"/></svg>}
          aria-label="Fechar"
          onClick={onClose}
          position="absolute"
          top={3}
          right={3}
          size="sm"
          variant="ghost"
          zIndex={2}
        />

        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Acesso Restrito
        </Text>

        <Text mb={6} textAlign="center" color="gray.500">
          Digite o PIN de acesso para continuar:
        </Text>

        <HStack justify="center" mb={6}>
          <PinInput
            type="number"
            value={pin}
            onChange={setPin}
            onComplete={handlePinComplete}
            mask
            size="lg"
          >
            <PinInputField ref={firstPinRef} />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>

        <Box display="flex" justifyContent="center" mt={6}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
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