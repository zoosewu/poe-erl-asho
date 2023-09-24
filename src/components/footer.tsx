import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <Container fluid className="bg-light py-3">
      <Container>
        <p className="text-center mb-0">
          © {new Date().getFullYear()} HoloSchedule. All rights reserved.
        </p>
      </Container>
    </Container>
  );
};

export default Footer;