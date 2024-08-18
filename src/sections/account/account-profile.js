import { Avatar, Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

export const AccountProfile = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={"/assets/logos/logo-ciis-xxiv.png"}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user?.name} {user?.firstLastname} {user?.secondLastname}
          </Typography>
          <Typography color="text.secondary" gutterBottom variant="body1" mb={2} mt={-1}>
            {user.role == 3 ? "Organizador" : "Administrador"} CIIS
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Tacna, Perú
          </Typography>
          <Typography color="text.secondary" variant="body2">
            ESIS ft. CIIS
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};
