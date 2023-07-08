import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader, usePagination, SearchBar } from "../../../components";
import { ShowTablePenduduk } from "../../../components/ShowTable";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Pagination, ButtonGroup } from "@mui/material";
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TOKEN =
  "pk.eyJ1IjoiaXZhbi1rcmlzdGlhd2FuIiwiYSI6ImNsMWN4dHljZzA3Z2ozcHFjcnpxbDhnaTIifQ.Z7KSBghh93LRW-7aCNQzEg"; // Set your mapbox token here

const TampilPenduduk = () => {
  const tableRef = useRef(null);
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [kodeRt, setKodeRt] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [penduduksData, setPenduduksData] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = penduduksData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kkPenduduk.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaPenduduk.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.latitude == searchTerm ||
      val.longitude == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(penduduksData.length / PER_PAGE);
  const _DATA = usePagination(penduduksData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getRtById();
  }, []);

  const getRtById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/rts/${id}`, {
      _id: user.id,
      token: user.token,
    });
    setKodeRt(response.data.kodeRt);
    setLatitude(response.data.latitude);
    setLongitude(response.data.longitude);
    const response2 = await axios.post(`${tempUrl}/penduduksByRt`, {
      rtId: id,
      _id: user.id,
      token: user.token,
    });
    setPenduduksData(response2.data);
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaDesa} - ${setting.kotaDesa}`, 15, 10);
    doc.text(`${setting.alamatDesa}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Penduduk RT ${kodeRt}`, 85, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0],
      },
    });
    doc.save("daftarPenduduk.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Penduduk",
    sheet: "DaftarPenduduk",
  });

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <h3>RT</h3>
      <h5 style={{ fontWeight: 400 }}>Penduduk</h5>
      <hr />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarPenduduk")}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>
      <div
        style={{
          width: `${screenSize - 400}px`,
          height: "400px",
          marginTop: "20px",
        }}
      >
        <Map
          initialViewState={{
            latitude: latitude,
            longitude: longitude,
            zoom: 15,
            bearing: 0,
            pitch: 0,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />
        </Map>
      </div>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
            style={{ marginTop: 20 }}
          >
            CETAK
          </Button>
          <table class="table" id="table">
            <thead>
              <tr>
                <th>KK</th>
                <th>Nama</th>
              </tr>
            </thead>
            <tbody>
              {penduduksData.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kkPenduduk}</td>
                  <td>{user.namaPenduduk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            style={{ marginTop: 20 }}
          >
            EXCEL
          </Button>
        )}
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>KK</th>
                <th>Nama</th>
              </tr>
              {penduduksData.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kkPenduduk}</td>
                  <td>{user.namaPenduduk}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <>
          <ButtonGroup variant="contained">
            <Button
              color="success"
              sx={{ bgcolor: "success.light", textTransform: "none" }}
              startIcon={<AddCircleOutlineIcon />}
              size="small"
              onClick={() => {
                navigate(`/daftarPenduduk/penduduk/${id}/tambahPenduduk`);
              }}
            >
              Tambah
            </Button>
          </ButtonGroup>
        </>
      </Box>
      <Form>
        <Card>
          <Card.Header>RT</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Rt :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control required value={kodeRt} disabled readOnly />
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
                    <Form.Control required value={latitude} disabled readOnly />
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
                      value={longitude}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTablePenduduk
          id={id}
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilPenduduk;

const buttonModifierContainer = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};
