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

export const TopicCards = (props) => {
  const {
    items = [],
    topicId = function () {},
    deleteTopic = function () {}
  } = props;

  return (
    <>
      <Grid container spacing={3}>
        {items.map((topic, idx) => (
          <Grid xs={12} sm={6} md={4} key={"topic-data-v2-" + idx}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {topic.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => topicId(topic)}>Editar</Button>
                <Button size="small" onClick={() => deleteTopic(topic)}>Borrar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
