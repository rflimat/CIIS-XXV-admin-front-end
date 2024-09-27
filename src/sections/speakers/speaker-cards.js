import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Unstable_Grid2 as Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { domain } from "src/contexts/url-context";

export const SpeakerCards = (props) => {
  const {
    items = [],
    page,
    rowsPerPage,
    total,
    handlePageChange = function () {},
    speakerId = function () {},
    deleteSpeaker = function () {},
  } = props;

  return (
    <>
      <Grid container spacing={3}>
        {items.map((speaker, idx) => (
          <Grid xs={12} sm={6} md={4} key={"speaker-data-v2-" + idx}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={`${speaker.degree} ${speaker.name} ${speaker.lastname}`}
                height="300"
                image={`${domain}/${speaker.avatar}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {speaker.degree} {speaker.name} {speaker.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {speaker.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => speakerId(speaker)}>
                  Editar
                </Button>
                <Button size="small" onClick={() => deleteSpeaker(speaker)}>
                  Borrar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        shape="rounded"
        size="large"
        count={Math.trunc(total / rowsPerPage) + 1}
        page={page}
        onChange={handlePageChange}
      />
    </>
  );
};
