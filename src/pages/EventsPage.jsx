import React, { useState, useEffect } from 'react';
import { Image, Heading, Box, Button, Input, FormControl, FormLabel, Stack, Text, Select, Flex, SimpleGrid, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    image: '',
    startTime: '',
    endTime: '',
    category: '',
    location: ''
  });

  const toast = useToast();

  // fetch events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3001/events');
      const data = await response.json();
      setEvents(data);
    }
    fetchData();
  }, []);

  // fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:3001/categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setNewEvent((prevEvent) => ({
            ...prevEvent,
            category: prevEvent.category || data[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // open and close modal
  const handleOpen = () => {
    setIsOpen(true);
    setNewEvent({
      title: '',
      description: '',
      image: '',
      startTime: '',
      endTime: '',
      category: categories.length > 0 ? categories[0].id : '',
      location: ''
    });
  };
  const handleClose = () => {
    setIsOpen(false);
    setIsEdit(false);
    setNewEvent({
      title: '',
      description: '',
      image: '',
      startTime: '',
      endTime: '',
      category: categories.length > 0 ? categories[0].id : '',
      location: ''
    });
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value
    }));
  };

  // handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      const response = await fetch(`http://localhost:3001/events/${currentEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      const data = await response.json();
      setEvents((prevEvents) => prevEvents.map(event => event.id === currentEventId ? data : event));
    } else {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, data]);
    }
    handleClose();
    toast({
      title: "Event Created.",
      description: "Created the event!.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // handle edit
  const handleEdit = (event) => {
    setIsEdit(true);
    setCurrentEventId(event.id);
    setNewEvent({
      title: event.title,
      description: event.description,
      image: event.image,
      startTime: event.startTime,
      endTime: event.endTime,
      category: event.category
    });
    handleOpen();
  };

  // filter events
  const filteredEvents = events.filter(event =>
    (selectedCategory === 'All' || event.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // check if no events match the search query
  const noEventsMessage = filteredEvents.length === 0 ? 'No events match your search criteria.' : '';

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Heading mb={4}>List of Events</Heading>
      <Flex mb={4} width="100%" maxWidth="600px" justifyContent="center" alignItems="center">
        <Input
          placeholder="Search events"
          value={searchQuery}
          onChange={handleSearchChange}
          mr={4}
        />
        <Select placeholder="Select category" value={selectedCategory} onChange={handleCategoryChange} mr={4}>
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
        <Button colorScheme="teal" onClick={handleOpen} p={8}>Add Event</Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%" maxWidth="1200px">
        {filteredEvents.map((event) => (
          <Link to={`/event/${event.id}`} key={event.id}>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)', cursor: 'pointer', boxShadow: '2xl' }}
              bg="white"
              overflow="hidden"
            >
              <Image src={event.image} alt="image" boxSize="300px" objectFit="cover" mb={2} mx="auto" borderRadius="md" />
              <Box p={4}>
                <Heading size="md" mb={2}>{event.title}</Heading>
                <Text mb={2} fontWeight="bold">{event.description}</Text>
                <Text mb={2} fontWeight="bold">Start Time: {new Date(event.startTime).toLocaleString()}</Text>
                <Text mb={2} fontWeight="bold">End Time: {new Date(event.endTime).toLocaleString()}</Text>
                <Text mb={2} fontWeight="bold">
                  Category: {categories.find(cat => cat.id === event.category)?.name || 'Unknown'}
                </Text>
                <Flex justifyContent="center" mt={4}>
                  <Button colorScheme="yellow" onClick={(e) => { e.preventDefault(); handleEdit(event); }} p={8}>Edit</Button>
                </Flex>
              </Box>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
      {noEventsMessage && <Text mt={4}>{noEventsMessage}</Text>}
      
      {isOpen && (
        <Box className="popup" position="fixed" top="0" left="0" width="100%" height="100%" bg="rgba(0,0,0,0.5)" display="flex" justifyContent="center" alignItems="center">
          <Box className="popup-content" bg="white" p={6} borderRadius="md" boxShadow="lg" maxWidth="500px" width="100%">
            <Heading size="lg" mb={4}>{isEdit ? 'Edit Event' : 'Add Event'}</Heading>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input type="text" name="title" value={newEvent.title} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input type="text" name="description" value={newEvent.description} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input type="text" name="image" value={newEvent.image} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Start Time</FormLabel>
                  <Input type="datetime-local" name="startTime" value={newEvent.startTime} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>End Time</FormLabel>
                  <Input type="datetime-local" name="endTime" value={newEvent.endTime} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input type="text" name="location" value={newEvent.location} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select name="category" value={newEvent.category} onChange={handleChange}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <Flex justifyContent="center">
                  <Button type="submit" colorScheme="blue" mr={2} p={8}>{isEdit ? 'Save Changes' : 'Submit'}</Button>
                  <Button type="button" onClick={handleClose} p={8}>Close</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};
