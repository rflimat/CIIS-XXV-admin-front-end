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
import { FileUpload } from "@mui/icons-material";
import CustomerFormEdit from "./customers-edit";
import Swal from "sweetalert2";

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    handleSetCounter = () => {},
    onRowsPerPageChange = () => {},
    page = 0,
    rowsPerPage = 0,
    rowsPerPageOptions = [1, 2],
  } = props;

  const statusContent = [
    { style: "rgb(219, 129, 10)", label: "Pendiente" },
    { style: "rgb(0,200,0)", label: "Confirmado" },
    { style: "rgb(200,20,0)", label: "Observado" },
  ];

  const [currentImages, setCurrentImages] = useState({});
  const [openGallery, setOpenGallery] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [user2edit, setUser2edit] = useState(null);

  const handleChangeStatusConfirm = ({ id }, status, idx) => {
    let buttonCheck = document.getElementById("btn-check-user-" + id);
    let buttonAlert = document.getElementById("btn-alert-user-" + id);
    buttonCheck.disabled = true;
    buttonAlert.disabled = true;
    buttonCheck.classList.add("Mui-disabled");
    buttonAlert.classList.add("Mui-disabled");

    fetch(URI.reservation.one(id).src, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          handleSetCounter();
        } else {
          buttonCheck.disabled = false;
          buttonAlert.disabled = false;
          buttonCheck.classList.remove("Mui-disabled");
          buttonAlert.classList.remove("Mui-disabled");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  function handleChangeStatus({ id }, status, idx) {
    Swal.fire({
      title: "¿Está seguro?",
      html: `Está a punto de <b>${
        status == 1 ? "aceptar" : "observar"
      }</b> la inscripción, no habrá vuelta atrás y se le notificará al usuario.`,
      icon: "question",
      confirmButtonText: "Confirmar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then((op) => {
      if (op.isConfirmed) handleChangeStatusConfirm({ id }, status, idx);
    });
  }

  const handleOpenForm = (user) => {
    setOpenForm(true);
    setUser2edit(user);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Tipo de inscripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Voucher</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer, idx) => {
                let slides = [];
                slides.push({ src: domain + "/api/v2" + customer.dir_voucher });
                if (customer.dir_fileuniversity)
                  slides.push({ src: domain + "/api/v2" + customer.dir_fileuniversity });

                customer.slides = slides;

                return (
                  <TableRow hover key={customer.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {customer.name} {customer.lastname}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.typeattendee.name_attendee}</TableCell>
                    <TableCell>
                      <Typography
                        fontWeight={"bold"}
                        color={statusContent[customer.enrollmentstatus].style}
                      >
                        {statusContent[customer.enrollmentstatus].label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Ver voucher"
                        size="medium"
                        onClick={() => {
                          setCurrentImages({ slides, index: 0 });
                          setOpenGallery(true);
                        }}
                        color="light"
                        sx={{ border: 0.2, borderColor: "rgba(28, 37, 54, .5)" }}
                        variant="contained"
                      >
                        <RequestQuoteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {customer.typeattendee.isuniversity && (
                        <IconButton
                          aria-label="Ver voucher"
                          size="medium"
                          onClick={() => {
                            setCurrentImages({ slides, index: 1 });
                            setOpenGallery(true);
                          }}
                          color="light"
                          sx={{ border: 0.2, borderColor: "rgba(28, 37, 54, .5)" }}
                          variant="contained"
                        >
                          <FeedIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <ButtonGroup variant="contained" aria-label="Controles de confirmación">
                        <Button
                          id={"btn-check-user-" + customer.id}
                          color="success"
                          disabled={[1].includes(customer.enrollmentstatus)}
                          title="Confirmar"
                          onClick={() => handleChangeStatus(customer, 1, idx)}
                        >
                          <CheckCircleIcon />
                        </Button>
                        <Button
                          id={"btn-alert-user-" + customer.id}
                          color="error"
                          disabled={[1, 2].includes(customer.enrollmentstatus)}
                          title="Observar"
                          onClick={() => handleChangeStatus(customer, 2, idx)}
                        >
                          <ErrorIcon />
                        </Button>
                        {customer.enrollmentstatus == 3 && (
                          <Button
                            id={"btn-edit-user-" + customer.id}
                            color="info"
                            disabled={customer.enrollmentstatus == 2}
                            title="Editar"
                            onClick={() => handleOpenForm(customer)}
                          >
                            <BorderColorIcon />
                          </Button>
                        )}
                      </ButtonGroup>
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
        rowsPerPageOptions={rowsPerPageOptions}
      />

      <Lightbox
        index={currentImages.index}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .7)" } }}
        open={openGallery}
        close={() => setOpenGallery(false)}
        slides={currentImages.slides}
        plugins={[Zoom, Thumbnails]}
        animation={0.02}
        zoom={{
          maxZoomPixelRatio: 5, // Aumenta o disminuye según quieras permitir más o menos zoom
          zoomInMultiplier: 1.2, // Aumenta o disminuye para ajustar la velocidad del zoom con la rueda del mouse o gestos de pinza
          doubleTapDelay: 300, // Aumenta este valor para requerir un doble toque más largo para activar el zoom
          doubleClickDelay: 300, // Aumenta este valor para requerir un doble clic más largo para activar el zoom
          doubleClickMaxStops: 2, // Puedes dejarlo en 2 para un doble clic con un aumento máximo de 2 veces el tamaño original
          keyboardMoveDistance: 100, // Aumenta o disminuye según quieras cambiar la velocidad de desplazamiento con las teclas de flecha
          wheelZoomDistanceFactor: 1000, // Disminuye este valor para tener un zoom más lento con la rueda del mouse
          pinchZoomDistanceFactor: 1000, // Disminuye este valor para tener un zoom más lento con gestos de pinza en dispositivos táctiles
          scrollToZoom: 1, // Activa el zoom al desplazarse con la rueda del mouse
        }}
        carousel={{ preload: 1 }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 1,
          borderRadius: 4,
          padding: 4,
          gap: 16,
          showToggle: 0,
        }}
      />

      <CustomerFormEdit
        openForm={openForm}
        user2edit={user2edit}
        onClose={() => setOpenForm(false)}
        handleSetCounter={handleSetCounter}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
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
