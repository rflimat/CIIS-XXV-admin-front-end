import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Avatar, Card, Button, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PropTypes from "prop-types";
import { Download, Summarize, SummarizeOutlined } from "@mui/icons-material";
import { IconButton } from "yet-another-react-lightbox";

export const CustomersSearch = ({ handleSetCounter, status }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Buscar cliente"
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
        "https://ciistacna.com/api/v1/reports/event/12/registrations/" +
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
