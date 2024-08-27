import { useCallback, useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { styled } from "@mui/joy";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";

export const SponsorForm = ({ sponsor, handleSubmit = () => {} }) => {
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
  const [event, setEvent] = useState(0);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChangeIsActive = (event) => {
    setEvent(Number(event.target.value));
  };

  useEffect(() => {
    if (sponsor && sponsor.idEvent) {
      setEvent(Number(sponsor.idEvent));
    }
  }, [sponsor]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = await fetch(`${URI.events.src}`, {
          method: "GET",
          credentials: "include",
        });

        data = await data.json();
        setEvents(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

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
                    <Grid xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        defaultValue={sponsor && sponsor.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Evento</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="idEvent"
                          value={event}
                          label="Event"
                          onChange={handleChangeIsActive}
                          required
                        >
                          {events.map((event, key) => (
                            <MenuItem key={key} value={event.id_event}>{event.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Web Sponsor"
                        name="webSponsor"
                        defaultValue={sponsor && sponsor.webSponsor}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Facebook Sponsor"
                        name="facebookSponsor"
                        defaultValue={sponsor && sponsor.facebookSponsor}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Youtube Sponsor"
                        name="youtubeSponsor"
                        defaultValue={sponsor && sponsor.youtubeSponsor}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Linkedin Sponsor"
                        name="linkedinSponsor"
                        defaultValue={sponsor && sponsor.linkedinSponsor}
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
                <Button type="button" variant="secondary" onClick={() => {
                  router.push("/sponsors")
                }}>
                  Cancelar
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
