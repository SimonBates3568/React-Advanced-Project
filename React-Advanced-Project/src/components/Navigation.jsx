import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link } from '@chakra-ui/react';

export const Navigation = () => {
  return (
    <Box as="nav" bg="teal.500" p={4}>
      <Flex as="ul" listStyleType="none" justify="space-around" wrap="wrap">
        <Box as="li" m={2}>
          <Link as={RouterLink} to="/" color="white" fontSize={["sm", "md", "lg"]}>
            Events
          </Link>
        </Box>
        <Box as="li" m={2}>
          <Link as={RouterLink} to="/event/1" color="white" fontSize={["sm", "md", "lg"]}>
            Event
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};
