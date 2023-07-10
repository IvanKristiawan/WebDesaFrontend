import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../../constants/report.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableUmkm } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilUmkm = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [namaUmkm, setNamaUmkm] = useState("");
  const [linkImage, setLinkImage] = useState("");
  const [linkWebsite, setLinkWebsite] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [umkms, setUmkms] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = umkms.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.namaUmkm.toUpperCase().includes(searchTerm.toUpperCase())) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(umkms, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getUmkms();
    id && getUmkmById();
  }, [id]);

  const getUmkms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/umkms`, {
        _id: user.id,
        token: user.token,
      });
      setUmkms(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getUmkmById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/umkms/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNamaUmkm(response.data.namaUmkm);
      setLinkImage(response.data.linkImage);
      setLinkWebsite(response.data.linkWebsite);
    }
  };

  const deleteUmkm = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteUmkm/${id}`, {
        _id: user.id,
        token: user.token,
      });
      getUmkms();
      setNamaUmkm("");
      setLinkImage("");
      setLinkWebsite("");
      navigate("/umkm");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaUmkm} tidak bisa dihapus karena sudah ada data!`);
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
    doc.text(`Daftar UMKM`, 75, 30);
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
    doc.save("daftarUMKM.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "UMKM",
    sheet: "DaftarUMKM",
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
      <h5 style={{ fontWeight: 400 }}>UMKM</h5>
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
                <th>Nama UMKM</th>
              </tr>
            </thead>
            <tbody>
              {umkms.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaUmkm}</td>
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
                <th>Nama UMKM</th>
              </tr>
              {umkms.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaUmkm}</td>
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
          addLink={`/umkm/tambahUmkm`}
          editLink={`/umkm/${id}/edit`}
          deleteUser={deleteUmkm}
          nameUser={namaUmkm}
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
                    Nama UMKM :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaUmkm} disabled readOnly />
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
                    Link Gambar :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={linkImage} disabled readOnly />
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
                    Link Website :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={linkWebsite} disabled readOnly />
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
        <ShowTableUmkm currentPosts={currentPosts} searchTerm={searchTerm} />
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

export default TampilUmkm;

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
