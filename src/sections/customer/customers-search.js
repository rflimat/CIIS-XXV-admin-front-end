import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Avatar, Card, Button, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PropTypes from "prop-types";
import { Download, Summarize, SummarizeOutlined } from "@mui/icons-material";
import { IconButton } from "yet-another-react-lightbox";
import URI from "src/contexts/url-context";
import { idEvent } from "src/utils/constants";

export const CustomersSearch = ({ search, setSearch, handleSetCounter, status }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      fullWidth
      placeholder="Buscar cliente"
      value={search}
      onChange={setSearch}
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon color="action" fontSize="small">
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      }
      sx={{ maxWidth: 500 }}
    />

    <Button variant="outlined" sx={{ marginLeft: 2 }} onClick={handleSetCounter}>
      <RefreshIcon sx={{ margin: 0 }} />
    </Button>

    <Button
      variant="contained"
      color="success"
      sx={{
        marginLeft: 2,
      }}
      href={
        URI.reports.registrations(idEvent) +
        (status ? "?status=" + status : "")
      }
      target="_blank"
    >
      {/* <Download sx={{ margin: 0 }} /> */}
      <SummarizeOutlined />
    </Button>
  </Card>
);

CustomersSearch.propTypes = {
  handleSetCounter: PropTypes.func,
  status: PropTypes.number,
};
