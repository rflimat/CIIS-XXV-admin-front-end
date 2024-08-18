import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from "@mui/material";
import { styled } from "@mui/joy";

export const SpeakerForm = ({ speaker, handleSubmit = () => {} }) => {
  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <form onSubmit={(e) => {
            handleSubmit(e, selectedFile);
          }}>
            <Card>
              <CardHeader
                subheader="Rellenar los campos con la información necesaria"
                title="Formulario"
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombres"
                        name="name"
                        defaultValue={speaker && speaker.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Apellidos"
                        name="lastname"
                        defaultValue={speaker && speaker.lastname}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Correo"
                        name="email"
                        defaultValue={speaker && speaker.email}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Telefono"
                        name="phone"
                        defaultValue={speaker && speaker.phone}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Universidad"
                        name="university"
                        defaultValue={speaker && speaker.university}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Grado"
                        name="degree"
                        defaultValue={speaker && speaker.degree}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Rol"
                        name="role"
                        defaultValue={speaker && speaker.role}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Lugar de trabajo"
                        name="workplace"
                        defaultValue={speaker && speaker.workplace}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nacionalidad"
                        name="nationality"
                        defaultValue={speaker && speaker.nationality}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={12}>
                      <TextField
                        fullWidth
                        label="Red Social"
                        name="socialNetwork"
                        defaultValue={speaker && speaker.socialNetwork}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={12}>
                      <TextField
                        label="Descripción"
                        name="description"
                        defaultValue={speaker && speaker.description}
                        fullWidth
                        multiline
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Trayectoria"
                        name="trajectory"
                        defaultValue={speaker && speaker.trajectory}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Año de egreso"
                        name="release_year"
                        defaultValue={speaker && speaker.release_year}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Años de experiencia"
                        name="experience_years"
                        defaultValue={speaker && speaker.experience_years}
                      />
                    </Grid>
                    <Grid xs={12} md={12}>
                      <Button
                        required
                        // name="avatar"
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                      >
                        Añadir Foto
                        <VisuallyHiddenInput
                          // name="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                      <span style={{marginLeft: 10}}>{selectedFile && selectedFile.name}</span>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
