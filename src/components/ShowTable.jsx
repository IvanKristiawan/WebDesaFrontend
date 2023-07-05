import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700,
    },
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
});

export function ShowTableUser({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Username
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tipe User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/daftarUser/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.tipeUser}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableGantiPeriode({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Dari Tanggal
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Sampai Tanggal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaPeriode
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.dariTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.sampaiTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/gantiPeriode/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaPeriode}
                </TableCell>
                <TableCell>{user.dariTanggal}</TableCell>
                <TableCell>{user.sampaiTanggal}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableRt({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>RT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeRt.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/rt/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeRt}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarPenduduk({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>RT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeRt.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/daftarPenduduk/penduduk/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeRt}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTablePenduduk({ id, currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              KK
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kkPenduduk
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaPenduduk
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => {
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: Colors.grey300 },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/daftarPenduduk/penduduk/${id}/${user.id}`);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {user.kkPenduduk}
                  </TableCell>
                  <TableCell>{user.namaPenduduk}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableLokasiPetinggi({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nama Petinggi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaLokasiPetinggi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/lokasiPetinggi/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaLokasiPetinggi}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableLokasiUmkm({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nama Umkm</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaLokasiUmkm
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/lokasiUmkm/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaLokasiUmkm}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableLokasiWisata({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nama Wisata</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaLokasiWisata
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/lokasiWisata/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaLokasiWisata}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTablePosyanduLansia({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              KK
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              NIK
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kkPosyanduLansia
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.nikPosyanduLansia
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaPosyanduLansia
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/posyanduLansia/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kkPosyanduLansia}
                </TableCell>
                <TableCell>{user.nikPosyanduLansia}</TableCell>
                <TableCell>{user.namaPosyanduLansia}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
