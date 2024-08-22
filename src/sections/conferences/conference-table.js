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
import { ButtonGroup, Button, IconButton } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import React from "react";
import Lightbox from "yet-another-react-lightbox";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useState } from "react";
import { domain } from "src/contexts/url-context";
import URI from "src/contexts/url-context";

import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import FeedIcon from "@mui/icons-material/Feed";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { FileUpload, Pageview } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { format } from "date-fns";

export const ConferenceTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    handleSetCounter = () => {},
    counter = 0,
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 10,
    selected = [],
    conferenceId = function () {},
    deleteConference = function () {}
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tema</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Turno</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((conference, idx) => {
                let slides = [];
                slides.push({ src: domain + `/api/v2/conference/${conference.id_conference}` });

                conference.slides = slides;

                return (
                  <TableRow hover key={conference.id_conference}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{conference.topic}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {format(new Date(conference.starDateTime), 'dd/MM/yyyy hh:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(conference.expDateTime), 'dd/MM/yyyy hh:mm:ss')}
                    </TableCell>
                    <TableCell>{conference.isMorning ? "Mañana" : "Tarde"}</TableCell>
                    <TableCell>{conference.isActive ? "Si" : "No"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => conferenceId(conference)}>
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton onClick={() => deleteConference(conference)}>
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

ConferenceTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  handleSetCounter: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  counter: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
