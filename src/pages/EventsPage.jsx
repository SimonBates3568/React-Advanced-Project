import React, { useState, useEffect } from 'react';
import { Image, Heading, Box, Button, Input, FormControl, FormLabel, Stack, Text, Select, Flex, SimpleGrid } from '@chakra-ui/react';
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
    category: ''
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3001/events');
      const data = await response.json();
      setEvents(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('http://localhost:3001/categories');
      const data = await response.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setIsEdit(false);
    setNewEvent({
      title: '',
      description: '',
      image: '',
      startTime: '',
      endTime: '',
      category: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

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
  };

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

  const filteredEvents = events.filter(event =>
    (selectedCategory === 'All' || event.category === selectedCategory) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Heading mb={4}>List of Events</Heading>
      <Flex mb={4} width="100%" maxWidth="600px" justifyContent="center">
        <Input
          placeholder="Search events"
          value={searchQuery}
          onChange={handleSearchChange}
          mr={4}
        />
        <Select placeholder="Select category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} width="100%" maxWidth="1200px">
        {filteredEvents.map((event) => (
          <Box key={event.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={2}>{event.title}</Heading>
            <Text mb={2}>{event.description}</Text>
            <Image src={event.image} alt="image" boxSize="300px" objectFit="cover" mb={2} />
            <Text mb={2}>Start Time: {event.startTime}</Text>
            <Text mb={2}>End Time: {event.endTime}</Text>
            <Text mb={2}>Category: {categories.find(cat => cat.id === event.category)?.name}</Text>
            <Flex>
              <Link to={`/event/${event.id}`}>
                <Button colorScheme="teal" variant="link" mr={2}>View Details</Button>
              </Link>
              <Button colorScheme="yellow" onClick={() => handleEdit(event)}>Edit</Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      <Button mt={4} colorScheme="teal" onClick={handleOpen}>Add Event</Button>
      
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
                  <FormLabel>Category</FormLabel>
                  <Select name="category" value={newEvent.category} onChange={handleChange}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <Flex>
                  <Button type="submit" colorScheme="blue" mr={2}>{isEdit ? 'Save Changes' : 'Submit'}</Button>
                  <Button type="button" onClick={handleClose}>Close</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EventsPage;
