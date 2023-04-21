import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import Pin from "../../../assets/pin";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup
} from "@mui/material";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from "react-map-gl";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const TOKEN =
  "pk.eyJ1IjoiaXZhbi1rcmlzdGlhd2FuIiwiYSI6ImNsMWN4dHljZzA3Z2ozcHFjcnpxbDhnaTIifQ.Z7KSBghh93LRW-7aCNQzEg"; // Set your mapbox token here

const TampilPendudukChild = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const { id, idPendudukChild } = useParams();
  const [popupInfo, setPopupInfo] = useState(null);
  const [tempIdPendudukChild, setTempIdPendudukChild] = useState("");
  const [kkPenduduk, setKkPenduduk] = useState("");
  const [namaPenduduk, setNamaPenduduk] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [penduduk, setPenduduk] = useState({});

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPendudukChildById();
  }, []);

  const getPendudukChildById = async () => {
    if (id) {
      const response = await axios.post(
        `${tempUrl}/penduduks/${idPendudukChild}`,
        {
          _id: user.id,
          token: user.token
        }
      );
      setPenduduk(response.data);
      setTempIdPendudukChild(response.data.id);
      setKkPenduduk(response.data.kkPenduduk);
      setNamaPenduduk(response.data.namaPenduduk);
      setLatitude(response.data.latitude);
      setLongitude(response.data.longitude);
    }
  };

  const deletePenduduk = async (id) => {
    try {
      setLoading(true);
      // Delete Penduduk
      await axios.post(`${tempUrl}/deletePenduduk/${tempIdPendudukChild}`, {
        _id: user.id,
        token: user.token
      });
      setLoading(false);
      navigate(`/daftarPenduduk/penduduk/${id}`);
    } catch (error) {
      alert(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Detail Penduduk</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarPenduduk/penduduk/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      {latitude !== 0 && (
        <div
          style={{
            width: `${screenSize - 400}px`,
            height: "400px",
            marginTop: "20px"
          }}
        >
          <Map
            initialViewState={{
              latitude: latitude,
              longitude: longitude,
              zoom: 15,
              bearing: 0,
              pitch: 0
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={TOKEN}
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

            <Marker
              key={`marker`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              onClick={(e) => {
                // If we let the click event propagates to the map, it will immediately close the popup
                // with `closeOnClick: true`
                e.originalEvent.stopPropagation();
                setPopupInfo(penduduk);
              }}
            >
              <Pin />
            </Marker>

            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(longitude)}
                latitude={Number(latitude)}
                onClose={() => setPopupInfo(null)}
              >
                <div>
                  {kkPenduduk}, {namaPenduduk}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      )}
      <Box sx={deleteButtonContainer}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`Yakin ingin menghapus data ${kkPenduduk}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deletePenduduk(id)}>Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(
                `/daftarPenduduk/penduduk/${id}/${idPendudukChild}/edit`
              );
            }}
          >
            Ubah
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            sx={{ textTransform: "none" }}
            onClick={handleClickOpen}
          >
            Hapus
          </Button>
        </ButtonGroup>
      </Box>
      <hr />
      <Card>
        <Card.Header>Detail Penduduk</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    KK :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kkPenduduk}
                      disabled
                      readOnly
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaPenduduk}
                      disabled
                      readOnly
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
                  <Form.Label column sm="3" style={textRight}>
                    Latitude :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={latitude}
                      disabled
                      readOnly
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
                  <Form.Label column sm="3" style={textRight}>
                    Longitude :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={longitude}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TampilPendudukChild;

const deleteButtonContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
