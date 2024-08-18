import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { capitalize } from "@mui/material";
import capitalizeWords from "src/utils/capitalizeWords";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { useState } from "react";
import { domain } from "src/contexts/url-context";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ButtonGroup from "@mui/material/ButtonGroup";
import Swal from "sweetalert2";
import URI from "src/contexts/url-context";
import { saveOnChest, takeFromChest } from "src/utils/chest";
import { useAuth } from "src/hooks/use-auth";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";


const tallerId = async (taller) => {
  try {
    let unTaller = await fetch(`${URI.taller}/${taller.id}`, {
      method: "GET",
      credentials: "include",
    });
    unTaller = await unTaller.json();
    console.log(unTaller);
    saveOnChest("taller", unTaller);
  } catch (error) {
    console.log(error);
  }
};

export const TablaInscritos = ({ primTaller }) => {
  
  const { user } = useAuth();

  console.log(primTaller);

  const [currentImages, setCurrentImages] = useState({});
  const [openGallery, setOpenGallery] = useState(false);
  const [taller, setTaller] = useState(primTaller);

  const handleChangeStatusConfirm = ({ id }, state, idx) => {
    let buttonCheck = document.getElementById("btn-check-user-" + id);
    let buttonAlert = document.getElementById("btn-alert-user-" + id);
    buttonCheck.disabled = true;
    buttonAlert.disabled = true;
    buttonCheck.classList.add("Mui-disabled");
    buttonAlert.classList.add("Mui-disabled");

    fetch(`${URI.taller}/${taller.id}/inscription/${idx}`, {
      method: "PATCH",
      body: JSON.stringify({ state }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status == 204) {
          await tallerId(taller);
          setTaller(takeFromChest("taller"));
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

  const columns = [
    {
      field: "createdAt",
      headerName: "Fecha creada",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "state",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => {
        let textColor = "black";
        let customContent = "";

        if (params.value === 0) {
          textColor = "black"; // Color de texto para el estado 0
          customContent = "Pendiente";
        } else if (params.value === 1) {
          textColor = "green"; // Color de texto para el estado 1
          customContent = "Confirmado";
        } else if (params.value === 2) {
          textColor = "red"; // Color de texto para el estado 2
          customContent = "Observado";
        }
        return <div style={{ color: textColor }}>{customContent}</div>;
      },
    },
    {
      field: "relatedUser",
      headerName: "Usuario",
      width: 300,
      renderCell: (params) => {
        let User = params.value;
        return capitalizeWords(`${User.name_user} ${User.lastname_user}`);
      },
    },
    {
      field: "Correo",
      headerName: "Correo",
      width: 250,
      renderCell: (params) => {
        let Correo = params.row.relatedUser;
        return `${Correo.email_user}`;
      },
    },
    {
      field: "Celular",
      headerName: "Celular",
      width: 150,
      renderCell: (params) => {
        let Celular = params.row.relatedUser;
        if (Celular.phone_user) {
          return `${Celular.phone_user}`;
        } else {
          return "No especificado"; 
        }
      },
    },
    {
      field: "voucher",
      headerName: "Ver Voucher",
      width: 120,
      renderCell: (params) => (
        <TableCell>
          <IconButton
            aria-label="Ver voucher"
            size="medium"
            onClick={() => {
              let slides = [];
              slides.push({ src: domain + "/api/v2" + params.value });
              // console.log(slides);
              // customer.slides = slides;

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
      ),
    },

    {
      field: "Acciones",
      headerName: "Acciones",
      width: 160,
      // hide: user.role !== 1,
      // hide: true,
      renderCell: (params) => (
        <TableCell>
          {/* {user.role === 1 && ( */}
          <ButtonGroup variant="contained" aria-label="Controles de confirmación">
            <Button
              id={"btn-check-user-" + params.row.id}
              color="success"
              disabled={params.row.status == 2}
              title="Confirmar"
              onClick={() => handleChangeStatus(params, 1, params.row.id)}
            >
              <CheckCircleIcon />
            </Button>
            <Button
              id={"btn-alert-user-" + params.id}
              color="error"
              disabled={params.row.status == 2}
              title="Observar"
              onClick={() => handleChangeStatus(params, 2, params.row.id)}
            >
              <ErrorIcon />
            </Button>
          </ButtonGroup>
          {/* )} */}
        </TableCell>
      ),
    },
  ];

  const hideAccionesColumn = user.role !== 1;

  const filteredColumns = columns.filter((column) => {
    if (hideAccionesColumn && column.field === "Acciones" ) {
      return false;
    }
    if (hideAccionesColumn && column.field === "voucher" ) {
      return false;
    }
    return true; // Mantén las demás columnas visibles
  });

  const rows = taller.inscriptions;
  // console.log(rows);
  // console.log(user.role);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={filteredColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 22,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
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
    </Box>
  );
};
