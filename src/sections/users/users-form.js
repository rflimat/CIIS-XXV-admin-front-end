import { useCallback, useState, useEffect } from "react";
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

export const UsersForm = ({ user, handleSubmit = () => {} }) => {
  const [role, setRole] = useState(0);
  const router = useRouter();

  const handleChangeRole = (event) => {
    setRole(Number(event.target.value));
  };

  useEffect(() => {
    if (user && user.role.id) {
      setRole(Number(user.role.id));
    }
  }, [user]);

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
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombres"
                        name="name"
                        defaultValue={user && user.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Apellidos"
                        name="lastname"
                        defaultValue={user && user.lastname}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Rol</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="role"
                          value={role}
                          label="Event"
                          onChange={handleChangeRole}
                          required
                        >
                          <MenuItem value={1}>Administrador</MenuItem>
                          <MenuItem value={2}>Organizador</MenuItem>
                          <MenuItem value={3}>Asistente</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="DNI"
                        name="dni"
                        defaultValue={user && user.dni}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Celular"
                        name="phone"
                        type="text"
                        defaultValue={user && user.phone}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Correo electrónico"
                        name="email"
                        defaultValue={user && user.email}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contraseña"
                        name="password"
                        type="password"
                        required={user ? false : true}
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
                  router.push("/users")
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
