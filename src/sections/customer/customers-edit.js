import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Fab,
  Input,
} from "@mui/material";

import PropTypes from "prop-types";
import { FileUpload } from "@mui/icons-material";
import { useState } from "react";
import URI from "src/contexts/url-context";
import { v4 } from "uuid";

function displayFormData(formData) {
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
}

const CustomerFormEdit = (props) => {
  const { user2edit, openForm = false, onClose = null, handleSetCounter } = props;

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const handleVoucherChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedVoucher(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUniversityChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedUniversity(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedVoucher(null);
    setSelectedUniversity(null);
  };

  const [msgError, setMsgError] = useState(false);
  const [msgErrorServer, setMsgErrorServer] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMsgErrorServer(false);
    setMsgError(false);

    if (event.target.checkValidity()) {
      let data = new FormData(event.target);
      // displayFormData(data); // show form data at console
      fetch(URI.registrations + `/${user2edit?.id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return handleSetCounter();
          else {
            res.json().then((a) => console.log(a));
            throw new Error();
          }
        })
        .catch((err) => setMsgErrorServer(true));
    } else setMsgError(true);
  };

  return (
    <Dialog open={openForm} onClose={handleClose}>
      <DialogTitle>Editando datos de usuario</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={handleSubmit}>
          <Typography variant="body2" mb={2}>
            Regularizando datos del usuario observado
          </Typography>
          {msgError && (
            <Typography variant="body2" mb={2} mt={-2} color={"error"}>
              Rellene todos los campos correctamente*
            </Typography>
          )}

          {msgErrorServer && (
            <Typography variant="body2" mb={2} mt={-2} color={"error"}>
              Ha ocurrido un error durante la actualización
            </Typography>
          )}
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <TextField
                type="text"
                name="name"
                variant="standard"
                label="Nombres"
                defaultValue={user2edit?.name}
                fullWidth
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                type="text"
                name="lastname"
                variant="standard"
                label="Apellidos"
                fullWidth
                defaultValue={user2edit?.lastname}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                type="text"
                name="phone"
                variant="standard"
                label="Celular"
                fullWidth
                defaultValue={user2edit?.phone}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                type="text"
                defaultValue={user2edit?.dni}
                name="dni"
                variant="standard"
                label="DNI"
                fullWidth
                required
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                type="email"
                defaultValue={user2edit?.email}
                name="email"
                variant="standard"
                label="Correo"
                fullWidth
                required
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                <Box mx={"auto"}>
                  <Box
                    minHeight={200}
                    minWidth={200}
                    mb={2}
                    sx={{
                      background: `url(${
                        selectedVoucher || `${user2edit?.slides[0]?.src}?rand=${v4()}`
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Box>
                <label htmlFor="upload-photo-voucher">
                  <input
                    style={{ display: "none" }}
                    id="upload-photo-voucher"
                    name="filevoucher"
                    type="file"
                    accept="image/*"
                    onChange={handleVoucherChange}
                  />
                  <Fab
                    color="#1C2536"
                    size="small"
                    component="span"
                    aria-label="add"
                    variant="extended"
                    sx={{ width: "100%" }}
                  >
                    <FileUpload /> Nuevo voucher
                  </Fab>
                </label>
              </Box>
            </Grid>
            {user2edit?.typeattendee.isuniversity && (
              <Grid item md={6} xs={12}>
                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                  <Box mx={"auto"}>
                    <Box
                      minHeight={200}
                      minWidth={200}
                      mb={2}
                      sx={{
                        background: `url(${
                          selectedUniversity || `${user2edit?.slides[1]?.src}?rand=${v4()}`
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </Box>
                  <label htmlFor="upload-photo-university">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo-university"
                      name="fileuniversity"
                      type="file"
                      accept="image/*"
                      onChange={handleUniversityChange}
                    />
                    <Fab
                      color="#1C2536"
                      size="small"
                      component="span"
                      aria-label="add"
                      variant="extended"
                      sx={{ width: "100%" }}
                    >
                      <FileUpload /> Nueva ficha
                    </Fab>
                  </label>
                </Box>
              </Grid>
            )}
          </Grid>
          <Box display={"flex"} justifyContent={"end"} mt={3}>
            <Button
              sx={{ color: "grey", textTransform: "uppercase", fontWeight: "bold" }}
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              sx={{ color: "blue", textTransform: "uppercase", fontWeight: "bold" }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormEdit;

CustomerFormEdit.propTypes = {
  user2edit: PropTypes.object,
  openForm: PropTypes.bool,
};
