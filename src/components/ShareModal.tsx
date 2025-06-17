import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  useToast,
  IconButton,
  Tooltip,
  Box,
  Divider,
} from '@chakra-ui/react';
import { FiCopy, FiMail, FiTwitter, FiLinkedin, FiLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Dashboard } from '../types/dashboard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: Dashboard | null;
}

export function ShareModal({ isOpen, onClose, dashboard }: ShareModalProps) {
  const [customMessage, setCustomMessage] = useState('');
  const toast = useToast();

  if (!dashboard) return null;

  const shareText = customMessage || `${dashboard.title} - ${dashboard.description}`;
  const shareUrl = dashboard.url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copiado!',
        description: 'URL copiada para a área de transferência',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Tente novamente',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleShare = async (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      email: `mailto:?subject=${encodeURIComponent(dashboard.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    };

    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: dashboard.title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        handleCopy();
      }
    } catch (error) {
      handleCopy();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay zIndex={9998} />
      <ModalContent zIndex={9999}>
        <ModalHeader>Compartilhar Dashboard</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>
                {dashboard.title}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                {dashboard.description}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Mensagem personalizada (opcional):
              </Text>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Adicione uma mensagem personalizada..."
                size="sm"
                rows={3}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Link para compartilhar:
              </Text>
              <HStack>
                <Input
                  value={shareUrl}
                  isReadOnly
                  size="sm"
                  fontFamily="mono"
                  fontSize="xs"
                />
                <Tooltip label="Copiar link">
                  <IconButton
                    icon={<FiCopy />}
                    onClick={handleCopy}
                    size="sm"
                    aria-label="Copiar link"
                  />
                </Tooltip>
              </HStack>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={3}>
                Compartilhar via:
              </Text>
              <HStack spacing={2} justify="center">
                <Tooltip label="Compartilhar nativo">
                  <IconButton
                    icon={<FiLink />}
                    onClick={handleNativeShare}
                    colorScheme="blue"
                    aria-label="Compartilhar nativo"
                  />
                </Tooltip>
                <Tooltip label="Twitter">
                  <IconButton
                    icon={<FiTwitter />}
                    onClick={() => handleShare('twitter')}
                    colorScheme="twitter"
                    aria-label="Compartilhar no Twitter"
                  />
                </Tooltip>
                <Tooltip label="LinkedIn">
                  <IconButton
                    icon={<FiLinkedin />}
                    onClick={() => handleShare('linkedin')}
                    colorScheme="linkedin"
                    aria-label="Compartilhar no LinkedIn"
                  />
                </Tooltip>
                <Tooltip label="WhatsApp">
                  <IconButton
                    icon={<FaWhatsapp />}
                    onClick={() => handleShare('whatsapp')}
                    colorScheme="green"
                    aria-label="Compartilhar no WhatsApp"
                  />
                </Tooltip>
                <Tooltip label="Email">
                  <IconButton
                    icon={<FiMail />}
                    onClick={() => handleShare('email')}
                    colorScheme="gray"
                    aria-label="Compartilhar por email"
                  />
                </Tooltip>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 