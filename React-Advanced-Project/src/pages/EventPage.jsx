import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heading, Button, Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useDisclosure, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Image, Stack } from '@chakra-ui/react';

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    category: '',
    image: ''
  });
  const toast = useToast();

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`http://localhost:3001/events/${eventId}`);
      const data = await response.json();
      setEvent(data);
      setFormData(data);
    }
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      const data = await response.json();
      setEvent(data);
      toast({
        title: "Event updated.",
        description: "The event has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      toast({
        title: "Event deleted.",
        description: "The event has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/events'); // Redirect to events list page
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p={4}>
      <Heading mb={4}>{event.title}</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <Box flex="1">
          <Text mb={2}><strong>Description:</strong> {event.description}</Text>
          <Text mb={2}><strong>Start Time:</strong> {event.startTime}</Text>
          <Text mb={2}><strong>End Time:</strong> {event.endTime}</Text>
          <Text mb={2}><strong>Location:</strong> {event.location}</Text>
          <Text mb={2}><strong>Category:</strong> {event.category}</Text>
        </Box>
        <Box flex="1" maxW="300px">
          <Image src={event.image} alt={event.title} borderRadius="md" />
        </Box>
      </Stack>
      <Button colorScheme="blue" onClick={onOpen} mt={4}>EDIT</Button>
      <Button colorScheme="red" onClick={onAlertOpen} ml={4} mt={4}>DELETE</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={formData.title} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input name="description" value={formData.description} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input name="startTime" value={formData.startTime} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Input name="endTime" value={formData.endTime} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input name="location" value={formData.location} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input name="category" value={formData.category} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input name="image" value={formData.image} onChange={handleChange} />
              </FormControl>
              <Button colorScheme="blue" type="submit" mt={4}>Save</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
