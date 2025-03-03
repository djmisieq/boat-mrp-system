import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCalculator, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { API_URL } from '../config';
import { formatDate } from '../utils/formatters';

const MaterialRequirements = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [materialRequirements, setMaterialRequirements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState('');
  const [requirementDetails, setRequirementDetails] = useState(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    reference_number: '',
    consider_stock: true,
    consider_min_stock: true,
    planning_start_date: new Date(),
    planning_end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    source_orders: [],
    notes: ''
  });

  useEffect(() => {
    loadMaterialRequirements();
    loadOrders();
  }, []);

  const loadMaterialRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/material-requirements/`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setMaterialRequirements(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading material requirements:', err);
      setError('Nie udało się załadować zapotrzebowań materiałowych.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/?status=confirmed`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadRequirementDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/material-requirements/${id}/details`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setRequirementDetails(response.data);
    } catch (err) {
      console.error('Error loading requirement details:', err);
    }
  };

  const handleOpenModal = (requirement = null) => {
    if (requirement) {
      // Edit mode
      setFormData({
        reference_number: requirement.reference_number,
        consider_stock: requirement.consider_stock,
        consider_min_stock: requirement.consider_min_stock,
        planning_start_date: new Date(requirement.planning_start_date),
        planning_end_date: requirement.planning_end_date ? new Date(requirement.planning_end_date) : null,
        source_orders: requirement.source_orders.map(o => o.order_id),
        notes: requirement.notes || ''
      });
      setSelectedRequirement(requirement);
    } else {
      // Create mode
      setFormData({
        reference_number: `MRP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
        consider_stock: true,
        consider_min_stock: true,
        planning_start_date: new Date(),
        planning_end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        source_orders: [],
        notes: ''
      });
      setSelectedRequirement(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCalculationError('');
  };

  const handleDeleteModal = (requirement) => {
    setSelectedRequirement(requirement);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowDetails = async (requirement) => {
    setSelectedRequirement(requirement);
    await loadRequirementDetails(requirement.id);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setRequirementDetails(null);
  };

  const handleCalculate = async (id) => {
    setCalculating(true);
    setCalculationError('');
    try {
      await axios.post(`${API_URL}/material-requirements/${id}/calculate`, {}, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      await loadMaterialRequirements();
      if (showDetailsModal && requirementDetails) {
        await loadRequirementDetails(id);
      }
    } catch (err) {
      console.error('Error calculating material requirement:', err);
      setCalculationError(err.response?.data?.detail || 'Błąd obliczania zapotrzebowania');
    } finally {
      setCalculating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleOrderSelection = (e) => {
    const { value, checked } = e.target;
    const orderId = parseInt(value);
    
    if (checked) {
      // Add order to selection
      setFormData({
        ...formData,
        source_orders: [...formData.source_orders, orderId]
      });
    } else {
      // Remove order from selection
      setFormData({
        ...formData,
        source_orders: formData.source_orders.filter(id => id !== orderId)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.source_orders.length === 0) {
      setCalculationError('Wybierz co najmniej jedno zamówienie.');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        planning_start_date: formData.planning_start_date.toISOString(),
        planning_end_date: formData.planning_end_date ? formData.planning_end_date.toISOString() : null
      };
      
      if (selectedRequirement) {
        // Update
        await axios.patch(`${API_URL}/material-requirements/${selectedRequirement.id}`, payload, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
      } else {
        // Create
        await axios.post(`${API_URL}/material-requirements/`, payload, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
      }
      
      handleCloseModal();
      loadMaterialRequirements();
    } catch (err) {
      console.error('Error saving material requirement:', err);
      setCalculationError(err.response?.data?.detail || 'Błąd zapisywania zapotrzebowania');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/material-requirements/${selectedRequirement.id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      handleCloseDeleteModal();
      loadMaterialRequirements();
    } catch (err) {
      console.error('Error deleting material requirement:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge bg="secondary">Projekt</Badge>;
      case 'calculated':
        return <Badge bg="info">Obliczone</Badge>;
      case 'processing':
        return <Badge bg="primary">W realizacji</Badge>;
      case 'completed':
        return <Badge bg="success">Zrealizowane</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Anulowane</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Zapotrzebowanie Materiałowe (MRP)</h5>
            <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
              <FaPlus className="me-1" /> Nowe zapotrzebowanie
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Ładowanie danych...</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nr referencyjny</th>
                  <th>Status</th>
                  <th>Data utworzenia</th>
                  <th>Data obliczenia</th>
                  <th>Okres planowania</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {materialRequirements.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Brak zapotrzebowań materiałowych. Utwórz nowe, aby rozpocząć planowanie MRP.
                    </td>
                  </tr>
                ) : (
                  materialRequirements.map(requirement => (
                    <tr key={requirement.id}>
                      <td>{requirement.reference_number}</td>
                      <td>{getStatusBadge(requirement.status)}</td>
                      <td>{formatDate(requirement.creation_date)}</td>
                      <td>{requirement.calculation_date ? formatDate(requirement.calculation_date) : '-'}</td>
                      <td>
                        <small>
                          <FaCalendarAlt className="me-1" />
                          {formatDate(requirement.planning_start_date)}
                          {requirement.planning_end_date && ` - ${formatDate(requirement.planning_end_date)}`}
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowDetails(requirement)}
                          title="Szczegóły"
                        >
                          Szczegóły
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => handleCalculate(requirement.id)}
                          disabled={calculating}
                          title="Oblicz zapotrzebowanie"
                        >
                          <FaCalculator />
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleOpenModal(requirement)}
                          title="Edytuj"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteModal(requirement)}
                          title="Usuń"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRequirement ? 'Edycja zapotrzebowania materiałowego' : 'Nowe zapotrzebowanie materiałowe'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {calculationError && <Alert variant="danger">{calculationError}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nr referencyjny</Form.Label>
                  <Form.Control
                    type="text"
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Uwagi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data rozpoczęcia planowania</Form.Label>
                  <div>
                    <DatePicker
                      selected={formData.planning_start_date}
                      onChange={(date) => handleDateChange(date, 'planning_start_date')}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data zakończenia planowania</Form.Label>
                  <div>
                    <DatePicker
                      selected={formData.planning_end_date}
                      onChange={(date) => handleDateChange(date, 'planning_end_date')}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      minDate={formData.planning_start_date}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Uwzględnij stany magazynowe"
                    name="consider_stock"
                    checked={formData.consider_stock}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Uwzględnij minimalne stany magazynowe"
                    name="consider_min_stock"
                    checked={formData.consider_min_stock}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Zamówienia źródłowe</Form.Label>
              {orders.length === 0 ? (
                <Alert variant="warning">
                  Brak potwierdzonych zamówień. Utwórz i zatwierdź zamówienia, aby móc zaplanować zapotrzebowanie materiałowe.
                </Alert>
              ) : (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="border p-2 rounded">
                  {orders.map(order => (
                    <Form.Check
                      key={order.id}
                      type="checkbox"
                      label={`${order.order_number} (${formatDate(order.order_date)})`}
                      value={order.id}
                      checked={formData.source_orders.includes(order.id)}
                      onChange={handleOrderSelection}
                    />
                  ))}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Anuluj
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={orders.length === 0}
          >
            {selectedRequirement ? 'Zapisz zmiany' : 'Utwórz zapotrzebowanie'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdź usunięcie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz usunąć zapotrzebowanie materiałowe <strong>{selectedRequirement?.reference_number}</strong>?
          <div className="text-danger mt-2">Ta operacja jest nieodwracalna.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Szczegóły zapotrzebowania {selectedRequirement?.reference_number}{' '}
            {selectedRequirement && getStatusBadge(selectedRequirement.status)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!requirementDetails ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Ładowanie szczegółów...</p>
            </div>
          ) : (
            <>
              {calculationError && <Alert variant="danger">{calculationError}</Alert>}
              
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>Informacje podstawowe</Card.Header>
                    <Card.Body>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Nr referencyjny:</td>
                            <td>{requirementDetails.reference_number}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Status:</td>
                            <td>{getStatusBadge(requirementDetails.status)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Data utworzenia:</td>
                            <td>{formatDate(requirementDetails.creation_date)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Data obliczenia:</td>
                            <td>{requirementDetails.calculation_date ? formatDate(requirementDetails.calculation_date) : '-'}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Okres planowania:</td>
                            <td>
                              {formatDate(requirementDetails.planning_start_date)}
                              {requirementDetails.planning_end_date && ` - ${formatDate(requirementDetails.planning_end_date)}`}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Uwzględnia stany magazynowe:</td>
                            <td>{requirementDetails.consider_stock ? 'Tak' : 'Nie'}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Uwzględnia min. stany:</td>
                            <td>{requirementDetails.consider_min_stock ? 'Tak' : 'Nie'}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Uwagi:</td>
                            <td>{requirementDetails.notes || '-'}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>Zamówienia źródłowe</Card.Header>
                    <Card.Body>
                      {requirementDetails.source_orders.length === 0 ? (
                        <p className="text-muted">Brak zamówień źródłowych</p>
                      ) : (
                        <Table hover size="sm">
                          <thead>
                            <tr>
                              <th>Nr zamówienia</th>
                              <th>Status</th>
                              <th>Data zamówienia</th>
                              <th>Wymagana data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requirementDetails.source_orders.map(order => (
                              <tr key={order.id}>
                                <td>{order.order_number}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{order.required_date ? formatDate(order.required_date) : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>Zapotrzebowanie na komponenty</div>
                  <div>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleCalculate(requirementDetails.id)}
                      disabled={calculating}
                    >
                      {calculating ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Obliczanie...
                        </>
                      ) : (
                        <>
                          <FaCalculator className="me-1" /> Oblicz zapotrzebowanie
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={requirementDetails.items.length === 0}
                    >
                      <FaFileExport className="me-1" /> Eksportuj
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {requirementDetails.items.length === 0 ? (
                    <Alert variant="warning">
                      Brak obliczonych pozycji zapotrzebowania. 
                      Kliknij przycisk "Oblicz zapotrzebowanie", aby wykonać obliczenia MRP.
                    </Alert>
                  ) : (
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Kod</th>
                          <th>Nazwa</th>
                          <th>Typ</th>
                          <th>Ilość wymagana</th>
                          <th>Ilość dostępna</th>
                          <th>Ilość do zam.</th>
                          <th>Data wymagania</th>
                          <th>Data zamówienia</th>
                          <th>Lead time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requirementDetails.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.product_code}</td>
                            <td>{item.product_name}</td>
                            <td>
                              <Badge bg="secondary">{item.product_type}</Badge>
                            </td>
                            <td>{item.required_quantity} {item.unit}</td>
                            <td>{item.available_quantity} {item.unit}</td>
                            <td className={item.quantity_to_procure > 0 ? 'text-danger fw-bold' : 'text-success'}>
                              {item.quantity_to_procure} {item.unit}
                            </td>
                            <td>{item.requirement_date ? formatDate(item.requirement_date) : '-'}</td>
                            <td>{item.planned_order_date ? formatDate(item.planned_order_date) : '-'}</td>
                            <td>{item.lead_time_days} dni</td>
                            <td>
                              {item.is_available ? (
                                <Badge bg="success">Dostępne</Badge>
                              ) : (
                                <Badge bg="danger">Do zamówienia</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MaterialRequirements;
