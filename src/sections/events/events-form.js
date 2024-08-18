import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/joy";
import MultipleSelectChip from "../../components/multiple-select-chip";
import URI from "src/contexts/url-context";
import { DropzoneArea } from 'mui-file-dropzone';

export const EventsForm = ({ event, handleSubmit = () => {} }) => {
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

  const [active, setActive] = useState(1);
  const [typeEvent, setTypeEvent] = useState(0);
  const [topics, setTopics] = useState([]);
  const [eventTopics, setEventTopics] = useState([]);
  const [selectedFileLogo, setSelectedFileLogo] = useState(null);
  const [selectedFileBrouchure, setSelectedFileBrouchere] = useState(null);
  const [selectedGalleryEvent, setSelectedGalleryEvent] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let data = await fetch(`${URI.topics.src}`, {
          method: "GET",
          credentials: "include",
        });

        data = await data.json();
        setTopics(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    if (event && event.active) {
      setActive(Number(event.active));
    }
    if (event && event.type_event_id) {
      setTypeEvent(Number(event.type_event_id));
    }
    if (event && event.topics) {
      setEventTopics(event.topics);
    }
  }, [event]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <form onSubmit={(e) => {
            handleSubmit(e, selectedFileLogo, selectedFileBrouchure, selectedGalleryEvent);
          }}>
            <Card>
              <CardHeader
                subheader="Rellenar los campos con la información necesaria"
                title="Formulario"
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={12}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        defaultValue={event && event.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={12}>
                      <TextField
                        fullWidth
                        label="Descripcion"
                        name="about"
                        defaultValue={event && event.about}
                        multiline
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Lugar"
                        name="place"
                        defaultValue={event && event.place}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha Inicio"
                        name="start_date"
                        type="date"
                        defaultValue={event && event.start_date}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha Fin"
                        name="exp_date"
                        type="date"
                        defaultValue={event && event.exp_date}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Tipo Evento</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="type_event_id"
                          value={typeEvent}
                          label="TipoEvento"
                          onChange={(event) => {
                            setTypeEvent(Number(event.target.value));
                          }}
                          required
                        >
                          <MenuItem value={1}>CIIS</MenuItem>
                          <MenuItem value={2}>POSTMASTER</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Precio"
                        name="price"
                        type="text"
                        defaultValue={event && event.price}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Activo</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="active"
                          value={active}
                          label="Event"
                          onChange={(event) => {
                            setActive(Number(event.target.value));
                          }}
                          required
                        >
                          <MenuItem value={1}>Si</MenuItem>
                          <MenuItem value={0}>No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Topics</InputLabel>
                        <MultipleSelectChip
                          data={topics}
                          element={eventTopics}
                          setElement={setEventTopics}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <Button
                        required
                        // name="logo"
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                      >
                        Añadir Logo
                        <VisuallyHiddenInput
                          // name="logo"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            setSelectedFileLogo(event.target.files[0]);
                          }}
                        />
                      </Button>
                      <span style={{ marginLeft: 10 }}>
                        {selectedFileLogo && selectedFileLogo.name}
                      </span>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <Button
                        required
                        // name="brouchere"
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                      >
                        Añadir Brouchere
                        <VisuallyHiddenInput
                          // name="brouchere"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            setSelectedFileBrouchere(event.target.files[0]);
                          }}
                        />
                      </Button>
                      <span style={{ marginLeft: 10 }}>
                        {selectedFileBrouchure && selectedFileBrouchure.name}
                      </span>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <InputLabel style={{marginBottom: 10}}>Galeria de Imagenes:</InputLabel>
                      <DropzoneArea
                        acceptedFiles={['image/*']}
                        dropzoneText={"Arrastre y suelte una imagen aquí o haga clic"}
                        onChange={(files) => setSelectedGalleryEvent(files)}
                        showAlerts={false}
                      />
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
