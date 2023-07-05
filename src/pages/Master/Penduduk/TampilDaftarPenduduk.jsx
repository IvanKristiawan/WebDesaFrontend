import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarPenduduk } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarPenduduk = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rtsData, setRtsData] = useState([]);

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = rtsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (val.kodeRt.toUpperCase().includes(searchTerm.toUpperCase())) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(rtsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getRtsData();
  }, []);

  const getRtsData = async () => {
    setLoading(true);
    try {
      const allBelis = await axios.post(`${tempUrl}/rts`, {
        _id: user.id,
        token: user.token,
      });
      setRtsData(allBelis.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box>
      <Typography color="#757575">Desa</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Rt
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarPenduduk
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
    </Box>
  );
};

export default TampilDaftarPenduduk;

const subTitleText = {
  fontWeight: "900",
};

const dividerStyle = {
  pt: 4,
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
