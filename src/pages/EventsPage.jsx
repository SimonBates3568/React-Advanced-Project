import React, { useState, useEffect } from 'react';
import { Image, Heading, Box, Button, Input, FormControl, FormLabel, Stack, Text, Select, Flex, SimpleGrid, useToast, CheckboxGroup, Checkbox } from '@chakra-ui/react';
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
    categoryIds: [],
    location: ''
  });

  const toast = useToast();


  // fetch events and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesResponse = await fetch('http://localhost:3001/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const eventsResponse = await fetch('http://localhost:3001/events');
        const eventsData = await eventsResponse.json();

        // instead of setting the json from the events api
        // we remap the array of events to include the category objects
        let events = eventsData.map((e) => {
          // map category ids to category objects and add to event object
          let categories = e.categoryIds.map(c => categoriesData.find(category => category.id === c));
          return {
            // new event object
            // spead operator to include all properties from the original event object
            ...e,
            // add categories property to the event object
            categories: categories || []
          };
        });
        setEvents(events);
        
        // default the new event object to have the first category id if there are categories if not set to empty array (as can be multiple categories)
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          categoryIds: prevEvent.categoryIds.length > 0 ? prevEvent.categoryIds : categoriesData.length > 0 ? [categoriesData[0].id] : []
        }));
        //

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  //
  // Down the rest of the file I renamed category to categoryIds
  // as thats what you are storing in the event object
  //


  // open and close modal
  const handleOpen = () => {
    setIsOpen(true);
    // set the new event object to have the first category id if there are categories if not set to empty array (as can be multiple categories)
    setNewEvent({
      title: '',
      description: '',
      image: '',
      startTime: '',
      endTime: '',
      categoryIds: categories.length > 0 ? [categories[0].id] : [],
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
      categoryIds: categories.length > 0 ? [categories[0].id] : [],
      location: ''
    });
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value
    }));
  };

  //
  // create this to handle the category ids change on the form
  // as there are multiple selection allows as the prop is an array
  // then using your handleChange function would not work

  const handleCategoryIdsChange = (ids) => {
    let categoryIds = ids.map(id => parseInt(id));
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      categoryIds
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
      categoryIds: event.categoryIds,
      location: event.location
    });
    setIsOpen(true);
  
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
              Category: {

                // here we get the new categories property we mapped when downloaing the events from the api, map them to return the name and we have array of string then join those strings with a comma
              
              event.categories.map((category) => category.name).join(', ') || 'Unknown'
              
              }
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
                {
                  /// remove the select and replace with the checkbox group
                  /// as we are now storing multiple category ids in the event object
                  /// we need to allow multiple selection
                }
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <CheckboxGroup name="categoryIds" value={newEvent.categoryIds} onChange={handleCategoryIdsChange}>
                    <Stack direction="row">
                      {categories.map((category) => (
                        <Checkbox key={category.id} value={category.id}>{category.name}</Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
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
