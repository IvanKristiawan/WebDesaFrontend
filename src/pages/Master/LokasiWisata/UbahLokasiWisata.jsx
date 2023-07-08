import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahLokasiWisata = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaLokasiWisata, setNamaLokasiWisata] = useState("");
  const [linkGoogleMaps, setLinkGoogleMaps] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getLokasiWisataById();
  }, []);

  const getLokasiWisataById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/lokasiWisatas/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNamaLokasiWisata(response.data.namaLokasiWisata);
    setLinkGoogleMaps(response.data.linkGoogleMaps);
    setLatitude(response.data.latitude);
    setLongitude(response.data.longitude);
    setLoading(false);
  };

  const updateLokasiWisata = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateLokasiWisata/${id}`, {
            namaLokasiWisata,
            linkGoogleMaps,
            latitude,
            longitude,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/lokasiWisata/${id}`);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      } catch (error) {
        alert(error);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Data Web</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Lokasi Wisata</h5>
      <hr />
      <Card>
        <Card.Header>Lokasi Wisata</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateLokasiWisata}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Nama Wisata :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaLokasiWisata}
                      onChange={(e) =>
                        setNamaLokasiWisata(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Link Google Maps :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={linkGoogleMaps}
                      onChange={(e) => setLinkGoogleMaps(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Latitude :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      value={latitude}
                      onChange={(e) =>
                        setLatitude(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Longitude :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      value={longitude}
                      onChange={(e) =>
                        setLongitude(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/lokasiWisata")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default UbahLokasiWisata;

const alertBox = {
  width: "100%",
};
