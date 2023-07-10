import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../constants/report.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableLokasiPetinggi } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import Pin from "../../../assets/pin";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TOKEN =
  "pk.eyJ1IjoiaXZhbi1rcmlzdGlhd2FuIiwiYSI6ImNsMWN4dHljZzA3Z2ozcHFjcnpxbDhnaTIifQ.Z7KSBghh93LRW-7aCNQzEg"; // Set your mapbox token here

const TampilLokasiPetinggi = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();
  const [popupInfo, setPopupInfo] = useState(null);

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaLokasiPetinggi, setNamaLokasiPetinggi] = useState("");
  const [linkGoogleMaps, setLinkGoogleMaps] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lokasiPetinggis, setLokasiPetinggis] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = lokasiPetinggis.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.namaLokasiPetinggi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.latitude == searchTerm ||
      val.longitude == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(lokasiPetinggis, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getLokasiPetinggis();
    id && getLokasiPetinggiById();
  }, [id]);

  const getLokasiPetinggis = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/lokasiPetinggis`, {
        _id: user.id,
        token: user.token,
      });
      setLokasiPetinggis(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getLokasiPetinggiById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/lokasiPetinggis/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaLokasiPetinggi(response.data.namaLokasiPetinggi);
      setLinkGoogleMaps(response.data.linkGoogleMaps);
      setLatitude(response.data.latitude);
      setLongitude(response.data.longitude);
    }
  };

  const deleteLokasiPetinggi = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteLokasiPetinggi/${id}`, {
        _id: user.id,
        token: user.token,
      });
      getLokasiPetinggis();
      setNamaLokasiPetinggi("");
      setLinkGoogleMaps("");
      setLatitude("");
      setLongitude("");
      navigate("/lokasiPetinggi");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(
          `${namaLokasiPetinggi} tidak bisa dihapus karena sudah ada data!`
        );
      }
    }
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
    doc.text(`Daftar Lokasi Petinggi`, 75, 30);
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
    doc.save("daftarLokasiPetinggi.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "LokasiPetinggi",
    sheet: "DaftarLokasiPetinggi",
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right",
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Data Web</h3>
      <h5 style={{ fontWeight: 400 }}>Lokasi Petinggi</h5>
      {latitude !== 0 && id && (
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

            <Marker
              key={`marker`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
              onClick={(e) => {
                // If we let the click event propagates to the map, it will immediately close the popup
                // with `closeOnClick: true`
                e.originalEvent.stopPropagation();
                setPopupInfo(lokasiPetinggis);
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
                <div>Petinggi : {namaLokasiPetinggi}</div>
                <a href={linkGoogleMaps}>Lihat</a>
              </Popup>
            )}
          </Map>
        </div>
      )}
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
          <table class="styled-table" id="table">
            <thead>
              <tr>
                <th>Nama Petinggi</th>
              </tr>
            </thead>
            <tbody>
              {lokasiPetinggis.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaLokasiPetinggi}</td>
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
        <table class="styled-table" ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Nama Petinggi</th>
              </tr>
              {lokasiPetinggis.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaLokasiPetinggi}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/lokasiPetinggi/tambahLokasiPetinggi`}
          editLink={`/lokasiPetinggi/${id}/edit`}
          deleteUser={deleteLokasiPetinggi}
          nameUser={namaLokasiPetinggi}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Nama Petinggi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={namaLokasiPetinggi}
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
                    <Form.Control value={latitude} disabled readOnly />
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
                    <Form.Control value={longitude} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableLokasiPetinggi
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

export default TampilLokasiPetinggi;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};
