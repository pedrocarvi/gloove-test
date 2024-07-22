// src/components/UnderConstruction.tsx
import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

const UnderConstruction: React.FC = () => {
  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center">
        <Col className="text-center">
          <h1 className="display-4">Estamos implementando funcionalidades</h1>
          <p className="lead">Esta página estará disponible próximamente. Está esperando la API o se necesita información para acabar su desarrollo</p>
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    </Container>
  );
};

export default UnderConstruction;
