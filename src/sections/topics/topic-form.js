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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/router";

export const TopicForm = ({ topic, handleSubmit = () => {} }) => {
  const [isActive, setIsActive] = useState(1);
  const router = useRouter();

  const handleChangeIsActive = (event) => {
    setIsActive(Number(event.target.value));
  };

  useEffect(() => {
    if (topic && topic.is_active) {
      setIsActive(Number(topic.is_active));
    }
  }, [topic]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                subheader="Rellenar los campos con la información necesaria"
                title="Formulario"
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={9}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        defaultValue={topic && topic.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Activo</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="is_active"
                          value={isActive}
                          label="Event"
                          onChange={handleChangeIsActive}
                          required
                        >
                          <MenuItem value={1}>Si</MenuItem>
                          <MenuItem value={0}>No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={12}>
                      <TextField
                        label="Descripción"
                        name="description"
                        defaultValue={topic && topic.description}
                        fullWidth
                        multiline
                        required
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
                <Button type="button" variant="secondary" onClick={() => {
                  router.push("/topics")
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
