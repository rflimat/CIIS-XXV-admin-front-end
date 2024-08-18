import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import PropTypes from "prop-types";

export const EventsSearch = ({search, setSearch}) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      fullWidth
      placeholder="Buscar ..."
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
  </Card>
);

EventsSearch.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func,
};
