import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahUmkm = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaUmkm, setNamaUmkm] = useState("");
  const [linkImage, setLinkImage] = useState("");
  const [linkWebsite, setLinkWebsite] = useState("");

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
    getUmkmById();
  }, []);

  const getUmkmById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/umkms/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setNamaUmkm(response.data.namaUmkm);
    setLinkImage(response.data.linkImage);
    setLinkWebsite(response.data.linkWebsite);
    setLoading(false);
  };

  const updateUmkm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateUmkm/${id}`, {
            namaUmkm,
            linkImage,
            linkWebsite,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate(`/umkm/${id}`);
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
      <h5 style={{ fontWeight: 400 }}>Ubah UMKM</h5>
      <hr />
      <Card>
        <Card.Header>UMKM</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateUmkm}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Nama UMKM :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaUmkm}
                      onChange={(e) =>
                        setNamaUmkm(e.target.value.toUpperCase())
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
                    Link Image :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={linkImage}
                      onChange={(e) => setLinkImage(e.target.value)}
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
                    Link Website :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={linkWebsite}
                      onChange={(e) => setLinkWebsite(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/umkm")}
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

export default UbahUmkm;

const alertBox = {
  width: "100%",
};
