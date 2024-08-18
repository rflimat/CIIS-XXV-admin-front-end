import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";
import { domain } from "src/contexts/url-context";

export const SponsorCards = (props) => {
  const {
    items = [],
    sponsorId = function () {},
    deleteSponsor = function () {}
  } = props;

  return (
    <>
      <Grid container spacing={3}>
        {items.map((sponsor, idx) => (
          <Grid xs={12} sm={6} md={4} key={"sponsor-data-v2-" + idx}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={sponsor.name}
                height="300"
                image={`${domain}/${sponsor.img}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {sponsor.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => sponsorId(sponsor)}>Editar</Button>
                <Button size="small" onClick={() => deleteSponsor(sponsor)}>Borrar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
