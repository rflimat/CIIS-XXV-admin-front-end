import PropTypes from "prop-types";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

import React from "react";

import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { format } from "date-fns";

export const EventsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 10,
    eventId = function () {},
    deleteEvent = function () {},
    report = function () {}
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombres</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((event, idx) => {
                return (
                  <TableRow hover key={event.id_event}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{event.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{event.place}</TableCell>
                    <TableCell>
                      {format(new Date(event.start_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.exp_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{event.active ? "Si" : "No"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => report(event)}>
                        <DescriptionIcon></DescriptionIcon>
                      </IconButton>
                      <IconButton onClick={() => eventId(event)}>
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton onClick={() => deleteEvent(event)}>
                        <HighlightOffIcon></HighlightOffIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        labelRowsPerPage="Filas por página"
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 100]}
      />
    </Card>
  );
};

EventsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
